import { z } from "zod";
import { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/api/response";
import {
  createInitialSession,
  draftToStructuredIntake,
  processChatTurn,
} from "@/lib/intake/chat-engine";
import type { ChatSessionData } from "@/lib/intake/types";
import { trackEvent } from "@/features/analytics";

const sessionSchema = z
  .object({
    id: z.string(),
    guestId: z.string(),
    state: z.enum(["greeting", "intake", "complete", "exited"]),
    intakeStep: z.number().int().min(0),
    messages: z.array(z.unknown()).optional(),
    intakeDraft: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();

const requestSchema = z.object({
  action: z
    .enum(["start", "restart", "message", "quick_reply"])
    .default("message"),
  text: z.string().max(8000).optional(),
  selectedOption: z.string().max(500).optional(),
  session: sessionSchema.optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "validation_error",
      "Invalid intake chat payload",
      400,
      parsed.error.flatten()
    );
  }

  const { action, text, selectedOption } = parsed.data;
  let session = (parsed.data.session as ChatSessionData | undefined) ?? null;

  if (!session || action === "start" || action === "restart") {
    session = createInitialSession();
    const started = await processChatTurn(session, {
      type: action === "restart" ? "restart" : "start",
    });
    const draft = draftToStructuredIntake(started.session.intakeDraft);
    void trackEvent("intake.chat_start", { sessionId: started.session.id });
    return apiOk({
      reply: started.botMessages.join("\n\n"),
      botMessages: started.botMessages,
      options: started.quickReplies ?? [],
      draft,
      session: started.session,
      complete: started.complete,
    });
  }

  const chip = selectedOption?.trim();
  const messageText = (chip || text || "").trim();
  if (!messageText) {
    return apiError("validation_error", "Message or selectedOption required", 400);
  }

  const turnAction =
    chip || action === "quick_reply"
      ? ({ type: "quick_reply" as const, text: messageText })
      : ({ type: "message" as const, text: messageText });

  const result = await processChatTurn(session, turnAction);
  const draft = draftToStructuredIntake(result.session.intakeDraft);

  if (result.complete) {
    void trackEvent("intake.chat_complete", {
      sessionId: result.session.id,
      practiceArea: draft.practiceArea,
      jurisdiction: draft.jurisdiction,
    });
  }

  return apiOk({
    reply: result.botMessages.join("\n\n") || "…",
    botMessages: result.botMessages,
    options: result.quickReplies ?? [],
    draft,
    session: result.session,
    complete: result.complete,
  });
}
