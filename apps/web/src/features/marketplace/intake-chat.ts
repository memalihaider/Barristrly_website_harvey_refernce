import { z } from "zod";
import type { StructuredIntake } from "@/features/marketplace/intake";
import { GREETING_MESSAGE } from "@/lib/intake/questionnaire";
import type { ChatSessionData } from "@/lib/intake/types";

export const intakeChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(8000),
});

export type IntakeChatMessage = z.infer<typeof intakeChatMessageSchema>;

export type IntakeChatDraft = StructuredIntake;

/** Bumped when questionnaire shape changes — clears stale free-form sessions */
export const INTAKE_DRAFT_STORAGE_KEY = "barristrly_intake_flow_v2";

export function intakeOpeningMessage(): IntakeChatMessage {
  return { role: "assistant", content: GREETING_MESSAGE };
}

export type PersistedIntakeChat = {
  messages: IntakeChatMessage[];
  draft: StructuredIntake | null;
  session: ChatSessionData | null;
  options: string[];
  complete: boolean;
};
