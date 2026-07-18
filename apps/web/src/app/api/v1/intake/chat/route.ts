import { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/api/response";
import {
  intakeChatRequestSchema,
  mergeDraft,
  runIntakeChatTurn,
  isIntakeComplete,
} from "@/features/marketplace/intake-chat";
import { runAiAgent } from "@/features/ai";
import {
  extractIntakeStub,
  type StructuredIntake,
} from "@/features/marketplace/intake";
import { PRACTICE_AREAS, JURISDICTIONS, URGENCY_LEVELS } from "@/lib/ontology";
import { trackEvent } from "@/features/analytics";

function coerceStructured(raw: unknown, fallback: StructuredIntake): StructuredIntake {
  if (!raw || typeof raw !== "object") return fallback;
  const s = raw as Record<string, unknown>;
  return {
    practiceArea:
      typeof s.practiceArea === "string" &&
      (PRACTICE_AREAS as readonly string[]).includes(s.practiceArea)
        ? (s.practiceArea as StructuredIntake["practiceArea"])
        : fallback.practiceArea,
    jurisdiction:
      typeof s.jurisdiction === "string" &&
      (JURISDICTIONS as readonly string[]).includes(s.jurisdiction)
        ? (s.jurisdiction as StructuredIntake["jurisdiction"])
        : fallback.jurisdiction,
    urgency:
      typeof s.urgency === "string" &&
      (URGENCY_LEVELS as readonly string[]).includes(s.urgency)
        ? (s.urgency as StructuredIntake["urgency"])
        : fallback.urgency,
    summary:
      typeof s.summary === "string" && s.summary.trim()
        ? s.summary.trim().slice(0, 500)
        : fallback.summary,
    facts: fallback.facts ?? {},
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = intakeChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "validation_error",
      "Invalid intake chat payload",
      400,
      parsed.error.flatten()
    );
  }

  const { messages, draft: prior } = parsed.data;
  const userTurns = messages.filter((m) => m.role === "user").length;
  const transcript = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n");

  // Prefer Gemini when available; always fall back to conversational stub
  let result = runIntakeChatTurn({ messages, draft: prior });

  if (process.env.GEMINI_API_KEY) {
    const ai = await runAiAgent({
      agent: "intake",
      prompt: [
        "You are conducting multi-turn legal intake.",
        "Conversation so far:",
        ...messages.map((m) => `${m.role}: ${m.content}`),
        "",
        "Return JSON only with keys: practiceArea, jurisdiction, urgency, summary, assistantReply (string), complete (boolean).",
        "assistantReply should ask the next clarifying question unless complete is true.",
        "Set complete true only when practiceArea, jurisdiction, and a solid summary are known.",
      ].join("\n"),
    });

    if (ai.structured && typeof ai.structured === "object") {
      const s = ai.structured as Record<string, unknown>;
      const stub = extractIntakeStub(transcript);
      const merged = coerceStructured(
        ai.structured,
        mergeDraft(prior, stub)
      );
      const complete =
        typeof s.complete === "boolean"
          ? s.complete
          : isIntakeComplete(merged, userTurns);
      const reply =
        typeof s.assistantReply === "string" && s.assistantReply.trim()
          ? s.assistantReply.trim()
          : complete
            ? result.reply
            : ai.text || result.reply;

      result = { reply, draft: merged, complete };
    }
  }

  void trackEvent("intake_chat_turn", {
    userTurns,
    complete: result.complete,
    practiceArea: result.draft.practiceArea ?? null,
    jurisdiction: result.draft.jurisdiction ?? null,
  });

  return apiOk({
    reply: result.reply,
    draft: result.draft,
    complete: result.complete,
  });
}
