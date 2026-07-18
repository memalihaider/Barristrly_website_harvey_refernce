import { z } from "zod";
import {
  extractIntakeStub,
  type StructuredIntake,
} from "@/features/marketplace/intake";
import { JURISDICTIONS, PRACTICE_AREAS, URGENCY_LEVELS } from "@/lib/ontology";

export const intakeChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(8000),
});

export const intakeChatRequestSchema = z.object({
  messages: z.array(intakeChatMessageSchema).min(1).max(40),
  draft: z
    .object({
      jurisdiction: z.enum(JURISDICTIONS).optional(),
      practiceArea: z.enum(PRACTICE_AREAS).optional(),
      urgency: z.enum(URGENCY_LEVELS).optional(),
      summary: z.string().optional(),
      facts: z.record(z.string(), z.unknown()).optional(),
    })
    .optional(),
});

export type IntakeChatMessage = z.infer<typeof intakeChatMessageSchema>;

export type IntakeChatDraft = Partial<StructuredIntake> & {
  facts?: Record<string, unknown>;
};

const OPENING =
  "I'm Barristrly's AI Intake assistant. Tell me what happened in your own words — I'll clarify jurisdiction, practice area, and urgency, then suggest matched lawyers.";

export function intakeOpeningMessage(): IntakeChatMessage {
  return { role: "assistant", content: OPENING };
}

export function mergeDraft(
  base: IntakeChatDraft | undefined,
  next: Partial<StructuredIntake>
): StructuredIntake {
  const stubSummary =
    next.summary ||
    base?.summary ||
    "Legal matter pending full description";
  return {
    practiceArea: next.practiceArea ?? base?.practiceArea,
    jurisdiction: next.jurisdiction ?? base?.jurisdiction,
    urgency: next.urgency ?? base?.urgency ?? "medium",
    summary: stubSummary,
    facts: {
      ...(base?.facts ?? {}),
      ...(next.facts ?? {}),
    },
  };
}

export function isIntakeComplete(draft: StructuredIntake, userTurns: number): boolean {
  const hasCore = Boolean(draft.practiceArea && draft.jurisdiction);
  const summaryOk = (draft.summary?.length ?? 0) >= 40;
  return hasCore && summaryOk && userTurns >= 2;
}

export function nextQuestion(draft: StructuredIntake): string {
  if (!draft.practiceArea) {
    return "What type of legal issue is this? For example employment, commercial contracts, family, real estate, or litigation.";
  }
  if (!draft.jurisdiction) {
    return "Which city or jurisdiction applies? (e.g. Dubai, DIFC, Abu Dhabi, Riyadh, London, Karachi)";
  }
  if ((draft.summary?.length ?? 0) < 80) {
    return "Can you share a few more facts — who is involved, what outcome you want, and any deadlines?";
  }
  if (!draft.facts?.budgetMentioned) {
    return "Do you have a budget range or preferred fee style for the consult? (optional — you can say skip)";
  }
  return "I have enough to structure your case. Reply “match me” when you want lawyer suggestions, or add anything else first.";
}

/** Conversational stub when Gemini is unavailable */
export function runIntakeChatTurn(params: {
  messages: IntakeChatMessage[];
  draft?: IntakeChatDraft;
}): {
  reply: string;
  draft: StructuredIntake;
  complete: boolean;
} {
  const userMessages = params.messages.filter((m) => m.role === "user");
  const lastUser = userMessages[userMessages.length - 1]?.content ?? "";
  const transcript = userMessages.map((m) => m.content).join("\n");

  const extracted = extractIntakeStub(transcript || lastUser);
  const draft = mergeDraft(params.draft, {
    ...extracted,
    summary:
      transcript.slice(0, 500) ||
      extracted.summary ||
      params.draft?.summary ||
      "",
    facts: {
      ...(params.draft?.facts ?? {}),
      ...(extracted.facts ?? {}),
      ...(/(budget|fee|aed|usd|skip)/i.test(lastUser)
        ? { budgetMentioned: true }
        : {}),
    },
  });

  const userTurns = userMessages.length;
  const wantsMatch = /match me|find (a )?lawyer|suggest|ready|done|that's all|thats all/i.test(
    lastUser
  );
  const complete =
    wantsMatch && isIntakeComplete(draft, userTurns)
      ? true
      : isIntakeComplete(draft, Math.max(userTurns, 3)) && userTurns >= 3
        ? true
        : false;

  if (complete || (wantsMatch && isIntakeComplete(draft, userTurns))) {
    return {
      reply: [
        "I've structured your case:",
        `• Practice: ${draft.practiceArea ?? "general"}`,
        `• Jurisdiction: ${draft.jurisdiction ?? "unspecified"}`,
        `• Urgency: ${draft.urgency}`,
        `• Summary: ${draft.summary.slice(0, 220)}`,
        "",
        "Next I'll suggest matched lawyers based on this intake.",
      ].join("\n"),
      draft,
      complete: true,
    };
  }

  const pieces: string[] = [];
  if (draft.practiceArea || draft.jurisdiction) {
    pieces.push(
      `Noted${draft.practiceArea ? `: ${draft.practiceArea.replace(/_/g, " ")}` : ""}${
        draft.jurisdiction ? ` · ${draft.jurisdiction}` : ""
      }.`
    );
  }
  pieces.push(nextQuestion(draft));

  return {
    reply: pieces.join(" "),
    draft,
    complete: false,
  };
}

export const INTAKE_DRAFT_STORAGE_KEY = "barristrly_intake_draft_v1";
