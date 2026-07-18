import { NextRequest } from "next/server";
import { apiOk, apiError, apiCreated } from "@/lib/api/response";
import {
  extractIntakeStub,
  intakeRequestSchema,
  type StructuredIntake,
} from "@/features/marketplace/intake";
import { runAiAgent } from "@/features/ai";
import { enqueueJob } from "@/lib/jobs/queue";
import { logger } from "@/lib/observability/logger";
import { getSessionUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { PRACTICE_AREAS, JURISDICTIONS, URGENCY_LEVELS } from "@/lib/ontology";
import { trackEvent } from "@/features/analytics";

function mergeIntakeFromAi(
  fallback: StructuredIntake,
  structured: unknown
): StructuredIntake {
  if (!structured || typeof structured !== "object") return fallback;
  const s = structured as Record<string, unknown>;
  const practiceArea =
    typeof s.practiceArea === "string" &&
    (PRACTICE_AREAS as readonly string[]).includes(s.practiceArea)
      ? (s.practiceArea as StructuredIntake["practiceArea"])
      : fallback.practiceArea;
  const jurisdiction =
    typeof s.jurisdiction === "string" &&
    (JURISDICTIONS as readonly string[]).includes(s.jurisdiction)
      ? (s.jurisdiction as StructuredIntake["jurisdiction"])
      : fallback.jurisdiction;
  const urgency =
    typeof s.urgency === "string" &&
    (URGENCY_LEVELS as readonly string[]).includes(s.urgency)
      ? (s.urgency as StructuredIntake["urgency"])
      : fallback.urgency;
  const summary =
    typeof s.summary === "string" && s.summary.trim()
      ? s.summary.trim().slice(0, 500)
      : fallback.summary;
  return { ...fallback, practiceArea, jurisdiction, urgency, summary };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = intakeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "validation_error",
      "Invalid intake payload",
      400,
      parsed.error.flatten()
    );
  }

  let structured = extractIntakeStub(parsed.data.message);
  let aiGated = true;

  if (process.env.GEMINI_API_KEY) {
    const ai = await runAiAgent({
      agent: "intake",
      prompt: parsed.data.message,
    });
    aiGated = ai.gated;
    structured = mergeIntakeFromAi(structured, ai.structured);
    if (!ai.structured && ai.text) {
      structured = { ...structured, summary: ai.text.slice(0, 280) };
    }
  }

  await enqueueJob("ai_intake_extract", { preview: structured.summary });
  logger.info("intake_extracted", {
    practiceArea: structured.practiceArea,
    jurisdiction: structured.jurisdiction,
    aiGated,
  });

  if (!isSupabaseConfigured()) {
    return apiOk({
      leadDraft: structured,
      persisted: false,
      aiGated,
      next: "POST /api/v1/matches",
    });
  }

  try {
    const session = await getSessionUser();
    if (!session) {
      return apiOk({
        leadDraft: structured,
        persisted: false,
        message: "Sign in to save a lead",
        aiGated,
        next: "POST /api/v1/matches",
      });
    }

    const supabase = await createClient();
    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        client_id: session.auth.id,
        status: "open",
        category: structured.practiceArea ?? "general",
        description: parsed.data.message,
      })
      .select("id, status, category, created_at")
      .single();

    if (error) {
      return apiError("internal", error.message, 500);
    }

    void trackEvent(
      "intake.created",
      {
        leadId: lead.id,
        practiceArea: structured.practiceArea,
        jurisdiction: structured.jurisdiction,
        aiGated,
      },
      session.auth.id
    );

    return apiCreated({
      lead,
      leadDraft: structured,
      persisted: true,
      aiGated,
      next: "POST /api/v1/matches",
    });
  } catch (err) {
    return apiError(
      "internal",
      err instanceof Error ? err.message : "Intake failed",
      500
    );
  }
}
