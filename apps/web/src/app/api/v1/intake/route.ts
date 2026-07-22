import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError, apiCreated } from "@/lib/api/response";
import {
  extractIntakeStub,
  intakeRequestSchema,
  type StructuredIntake,
} from "@/features/marketplace/intake";
import { enqueueJob } from "@/lib/jobs/queue";
import { logger } from "@/lib/observability/logger";
import { getSessionUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { PRACTICE_AREAS, JURISDICTIONS, URGENCY_LEVELS } from "@/lib/ontology";
import { trackEvent } from "@/features/analytics";

const structuredBodySchema = z.object({
  message: z.string().min(1).max(20000).optional(),
  locale: z.string().default("en").optional(),
  draft: z
    .object({
      jurisdiction: z.enum(JURISDICTIONS).optional(),
      practiceArea: z.enum(PRACTICE_AREAS).optional(),
      urgency: z.enum(URGENCY_LEVELS).optional(),
      summary: z.string(),
      facts: z.record(z.string(), z.unknown()).optional(),
    })
    .optional(),
});

function coerceStructured(input: {
  message?: string;
  draft?: StructuredIntake;
}): StructuredIntake {
  if (input.draft?.summary) {
    return {
      practiceArea: input.draft.practiceArea,
      jurisdiction: input.draft.jurisdiction,
      urgency: input.draft.urgency ?? "medium",
      summary: input.draft.summary,
      facts: {
        masked: true,
        contactReleased: false,
        ...(input.draft.facts ?? {}),
      },
    };
  }
  const stub = extractIntakeStub(input.message ?? "Legal matter");
  return {
    ...stub,
    facts: { masked: true, contactReleased: false, ...(stub.facts ?? {}) },
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = structuredBodySchema.safeParse(body);
  if (!parsed.success) {
    // Back-compat: classic { message } only
    const legacy = intakeRequestSchema.safeParse(body);
    if (!legacy.success) {
      return apiError(
        "validation_error",
        "Invalid intake payload",
        400,
        parsed.error.flatten()
      );
    }
  }

  const message =
    parsed.success
      ? parsed.data.message ?? parsed.data.draft?.summary ?? ""
      : ((body as { message?: string })?.message ?? "");
  const draftIn = parsed.success
    ? (parsed.data.draft as StructuredIntake | undefined)
    : undefined;

  if (!message && !draftIn) {
    return apiError("validation_error", "message or draft required", 400);
  }

  const structured = coerceStructured({
    message: message || draftIn?.summary,
    draft: draftIn,
  });

  await enqueueJob("ai_intake_extract", { preview: structured.summary });
  logger.info("intake_extracted", {
    practiceArea: structured.practiceArea,
    jurisdiction: structured.jurisdiction,
    masked: structured.facts?.masked === true,
  });

  if (!isSupabaseConfigured()) {
    return apiOk({
      leadDraft: structured,
      persisted: false,
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
        next: "POST /api/v1/matches",
      });
    }

    const supabase = await createClient();
    const description = [
      structured.summary,
      structured.facts?.subCategory
        ? `Sub: ${String(structured.facts.subCategory)}`
        : null,
      structured.facts?.engagementModel
        ? `Engagement: ${String(structured.facts.engagementModel)}`
        : null,
      structured.facts?.budgetTier
        ? `Budget: ${String(structured.facts.budgetTier)}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        client_id: session.auth.id,
        status: "open",
        category: structured.practiceArea ?? "general",
        description,
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
        masked: true,
      },
      session.auth.id
    );

    return apiCreated({
      lead,
      leadDraft: structured,
      persisted: true,
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
