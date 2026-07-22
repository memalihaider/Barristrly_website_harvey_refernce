import {
  DATA_PROTECTION_NOTICE,
  GREETING_MESSAGE,
  INTAKE_STEP_SEQUENCE,
  getCategoryByLabel,
  mapJurisdictionLabel,
  mapToPracticeArea,
  mapUrgencyFromFlags,
  resolveSubCategoryOptions,
  type IntakeStepConfig,
} from "./questionnaire";
import { answerUserQuestion, classifyIntakeTurn } from "./llm";
import type {
  ChatAction,
  ChatSessionData,
  ChatTurnResult,
  IntakeDraft,
} from "./types";
import type { StructuredIntake } from "@/features/marketplace/intake";
import type { JurisdictionCode, PracticeArea, UrgencyLevel } from "@/lib/ontology";

function newMessage(role: "user" | "bot" | "system", content: string) {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

function matchOption(text: string, options: readonly string[]): string | null {
  const lower = text.trim().toLowerCase();
  const exact = options.find((o) => o.toLowerCase() === lower);
  if (exact) return exact;
  return (
    options.find(
      (o) =>
        lower.includes(o.toLowerCase().slice(0, 14)) ||
        o.toLowerCase().includes(lower.slice(0, 14))
    ) ?? null
  );
}

function getStepConfig(stepIndex: number): IntakeStepConfig | undefined {
  return INTAKE_STEP_SEQUENCE[stepIndex];
}

function getOptionsForStep(
  session: ChatSessionData,
  step: IntakeStepConfig
): readonly string[] {
  if (step.kind === "sub_category") {
    return resolveSubCategoryOptions(session.intakeDraft.primaryCategory ?? "");
  }
  return step.options ?? [];
}

function syncDraftForMatching(draft: IntakeDraft): void {
  if (draft.primaryCategory && draft.subCategory) {
    draft.practiceArea = mapToPracticeArea(
      draft.primaryCategory,
      draft.subCategory
    );
  }
  if (draft.jurisdiction) {
    draft.jurisdictionCode = mapJurisdictionLabel(draft.jurisdiction);
  }
  draft.urgency = mapUrgencyFromFlags(
    draft.urgentDetained === true,
    draft.legalNoticeServed === true
  );
  if (!draft.caseDescription && draft.subCategory) {
    draft.caseDescription = [
      draft.subCategory,
      draft.engagementModel,
      draft.feeStructure,
    ]
      .filter(Boolean)
      .join(" · ");
  }
}

function intakeQuestionnaireComplete(draft: IntakeDraft): boolean {
  return Boolean(
    draft.primaryCategory &&
      draft.subCategory &&
      draft.engagementModel &&
      draft.jurisdiction &&
      draft.budgetTier &&
      draft.language &&
      draft.contactPreference &&
      draft.clientFullName?.trim() &&
      draft.clientPhone?.trim() &&
      draft.clientEmail?.trim() &&
      draft.leadMaskingConsent === true
  );
}

function getQuickRepliesForCurrentStep(
  session: ChatSessionData
): string[] | undefined {
  const step = getStepConfig(session.intakeStep);
  if (!step) return undefined;
  const options = getOptionsForStep(session, step);
  return options.length > 0 ? [...options] : undefined;
}

function promptForIntakeStep(
  session: ChatSessionData,
  appendBot: (text: string) => void
): string[] | undefined {
  const step = getStepConfig(session.intakeStep);
  if (!step) return undefined;

  if (step.kind === "sub_category") {
    const options = resolveSubCategoryOptions(
      session.intakeDraft.primaryCategory ?? ""
    );
    if (!options.length) {
      session.intakeStep++;
      return promptForIntakeStep(session, appendBot);
    }
    appendBot(step.prompt);
    return [...options];
  }

  appendBot(step.prompt);
  return step.options ? [...step.options] : undefined;
}

function advanceIntakeStep(session: ChatSessionData): void {
  session.intakeStep++;
  while (session.intakeStep < INTAKE_STEP_SEQUENCE.length) {
    const step = getStepConfig(session.intakeStep)!;
    if (step.kind === "sub_category" && !session.intakeDraft.primaryCategory) {
      session.intakeStep++;
      continue;
    }
    if (step.optional) {
      const draft = session.intakeDraft;
      if (
        (step.kind === "fee_structure" && draft.feeStructure) ||
        (step.kind === "matter_summary" && draft.caseDescription?.trim())
      ) {
        session.intakeStep++;
        continue;
      }
    }
    break;
  }
}

function applyIntakeAnswer(
  session: ChatSessionData,
  step: IntakeStepConfig,
  text: string
): boolean {
  const draft = session.intakeDraft;
  const trimmed = text.trim();

  if (step.optional && /^(skip|none|n\/a)$/i.test(trimmed)) {
    advanceIntakeStep(session);
    return true;
  }

  const options = getOptionsForStep(session, step);
  if (options.length > 0) {
    const matched = matchOption(text, options);
    if (!matched) return false;

    switch (step.kind) {
      case "primary_category": {
        const cat = getCategoryByLabel(matched);
        draft.primaryCategory = matched;
        draft.primaryCategoryId = cat?.id;
        break;
      }
      case "sub_category":
        draft.subCategory = matched;
        syncDraftForMatching(draft);
        break;
      case "engagement_model":
        draft.engagementModel = matched;
        break;
      case "jurisdiction":
        draft.jurisdiction = matched;
        syncDraftForMatching(draft);
        break;
      case "budget_tier":
        draft.budgetTier = matched;
        break;
      case "fee_structure":
        draft.feeStructure = matched;
        break;
      case "urgency_detained":
        draft.urgentDetained = matched === "Yes";
        draft.urgency = mapUrgencyFromFlags(
          draft.urgentDetained,
          draft.legalNoticeServed === true
        );
        break;
      case "notice_served":
        draft.legalNoticeServed = matched === "Yes";
        draft.urgency = mapUrgencyFromFlags(
          draft.urgentDetained === true,
          draft.legalNoticeServed
        );
        break;
      case "language":
        draft.language = matched;
        break;
      case "contact_preference":
        draft.contactPreference = matched;
        break;
      case "lead_consent":
        if (matched.startsWith("I acknowledge")) {
          draft.leadMaskingConsent = true;
        } else {
          return false;
        }
        break;
      default:
        break;
    }
    advanceIntakeStep(session);
    return true;
  }

  switch (step.kind) {
    case "matter_summary":
      draft.caseDescription = trimmed;
      syncDraftForMatching(draft);
      break;
    case "lead_name":
      draft.clientFullName = trimmed;
      break;
    case "lead_phone":
      draft.clientPhone = trimmed;
      break;
    case "lead_email":
      draft.clientEmail = trimmed;
      break;
    default:
      return false;
  }
  advanceIntakeStep(session);
  return true;
}

function isCasualGreeting(text: string): boolean {
  return /^(hi|hello|hey|good\s+(morning|afternoon|evening)|salam|assalamu|marhaba)\b/i.test(
    text.trim()
  );
}

export function createInitialSession(guestId = "guest"): ChatSessionData {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    guestId,
    state: "greeting",
    intakeStep: 0,
    messages: [],
    intakeDraft: {},
    createdAt: now,
    updatedAt: now,
  };
}

async function handleAiAssistedIntakeFailure(
  session: ChatSessionData,
  step: IntakeStepConfig,
  text: string,
  appendBot: (text: string) => void,
  isQuickReply: boolean
): Promise<{ applied: boolean; quickReplies?: string[]; exited?: boolean }> {
  if (step.kind === "lead_consent") {
    if (/^no/i.test(text.trim())) {
      appendBot(
        "Intake paused. You can restart anytime. Your data has not been shared with any law firm."
      );
      session.state = "exited";
      return { applied: false, exited: true };
    }
    appendBot(
      "You must accept the privacy guardrail to continue. Lawyers only receive your contact details after consultation and your explicit approval."
    );
    return {
      applied: false,
      quickReplies: ["I acknowledge and agree", "No — exit intake"],
    };
  }

  if (isQuickReply) {
    appendBot("I didn't catch that. Please choose one of the options below.");
    const retryOptions = getOptionsForStep(session, step);
    return {
      applied: false,
      quickReplies: retryOptions.length > 0 ? [...retryOptions] : undefined,
    };
  }

  const stepOptions = getOptionsForStep(session, step);
  const classified = await classifyIntakeTurn({
    session,
    userText: text,
    currentStepPrompt: step.prompt,
    options: stepOptions,
  });

  if (classified.intent === "answer_question") {
    const answer =
      classified.answer?.trim() ||
      (await answerUserQuestion({ session, userText: text }));
    appendBot(answer);
    appendBot("Whenever you're ready, we can continue from this step:");
    appendBot(step.prompt);
    return {
      applied: false,
      quickReplies: stepOptions.length > 0 ? [...stepOptions] : undefined,
    };
  }

  if (classified.intent === "select_option" && classified.selectedOption) {
    const ok = applyIntakeAnswer(session, step, classified.selectedOption);
    if (ok) return { applied: true };
  }

  if (classified.intent === "provide_slot" && classified.slotValue) {
    const ok = applyIntakeAnswer(session, step, classified.slotValue);
    if (ok) return { applied: true };
  }

  appendBot(
    classified.intent === "unclear"
      ? "I didn't catch that. You can ask a process question, or choose one of the options below."
      : "I didn't catch that. Please choose one of the options below."
  );
  return {
    applied: false,
    quickReplies: stepOptions.length > 0 ? [...stepOptions] : undefined,
  };
}

function finishQuestionnaire(
  session: ChatSessionData,
  appendBot: (text: string) => void
): void {
  syncDraftForMatching(session.intakeDraft);
  session.state = "complete";
  appendBot(
    "Your secure lead profile is captured under platform masking (e.g. Client #REF — contact fields hidden from attorneys until you authorize release). You can continue to lawyer matches when ready."
  );
}

export async function processChatTurn(
  session: ChatSessionData,
  action: ChatAction
): Promise<ChatTurnResult> {
  const botMessages: string[] = [];
  let quickReplies: string[] | undefined;
  let complete = session.state === "complete";

  const appendBot = (text: string) => {
    botMessages.push(text);
    session.messages.push(newMessage("bot", text));
  };

  const appendUser = (text: string) => {
    session.messages.push(newMessage("user", text));
  };

  if (action.type === "start" || action.type === "restart") {
    session.state = "intake";
    session.intakeStep = 0;
    session.intakeDraft = {};
    session.messages = [];
    appendBot(GREETING_MESSAGE);
    appendBot(DATA_PROTECTION_NOTICE);
    quickReplies = promptForIntakeStep(session, appendBot);
    session.updatedAt = new Date().toISOString();
    return { session, botMessages, quickReplies, complete: false };
  }

  if (session.state === "exited") {
    appendBot("Intake was paused. Send “restart” or tap Restart to begin again.");
    session.updatedAt = new Date().toISOString();
    return {
      session,
      botMessages,
      quickReplies: ["Restart intake"],
      complete: false,
    };
  }

  if (session.state === "complete") {
    session.updatedAt = new Date().toISOString();
    return { session, botMessages: [], quickReplies: undefined, complete: true };
  }

  if (action.type === "message" || action.type === "quick_reply") {
    const text = action.text;
    appendUser(text);

    if (/^restart/i.test(text.trim())) {
      return processChatTurn(session, { type: "restart" });
    }
  }

  switch (session.state) {
    case "greeting": {
      session.state = "intake";
      session.intakeStep = 0;
      appendBot(GREETING_MESSAGE);
      appendBot(DATA_PROTECTION_NOTICE);
      quickReplies = promptForIntakeStep(session, appendBot);
      break;
    }

    case "intake": {
      const text =
        action.type === "message" || action.type === "quick_reply"
          ? action.text
          : "";
      const isQuickReply = action.type === "quick_reply";

      if (
        action.type === "message" &&
        isCasualGreeting(text) &&
        !session.intakeDraft.primaryCategory
      ) {
        appendBot(
          "Hello! Please choose your primary legal vertical below to begin the intake questionnaire (under 2 minutes)."
        );
        quickReplies =
          getQuickRepliesForCurrentStep(session) ??
          promptForIntakeStep(session, appendBot);
        break;
      }

      const step = getStepConfig(session.intakeStep);
      if (!step) {
        if (intakeQuestionnaireComplete(session.intakeDraft)) {
          finishQuestionnaire(session, appendBot);
          complete = true;
        }
        break;
      }

      let ok = applyIntakeAnswer(session, step, text);
      if (!ok) {
        const assisted = await handleAiAssistedIntakeFailure(
          session,
          step,
          text,
          appendBot,
          isQuickReply
        );
        if (assisted.exited) {
          quickReplies = ["Restart intake"];
          break;
        }
        if (!assisted.applied) {
          quickReplies = assisted.quickReplies;
          break;
        }
        ok = true;
      }

      if (intakeQuestionnaireComplete(session.intakeDraft)) {
        finishQuestionnaire(session, appendBot);
        complete = true;
        quickReplies = undefined;
      } else {
        quickReplies = promptForIntakeStep(session, appendBot);
      }
      break;
    }

    default:
      break;
  }

  session.updatedAt = new Date().toISOString();
  return { session, botMessages, quickReplies, complete };
}

/** Convert wizard draft → website StructuredIntake for matching / lead save */
export function draftToStructuredIntake(draft: IntakeDraft): StructuredIntake {
  syncDraftForMatching(draft);
  const summary =
    draft.caseDescription?.trim() ||
    [draft.subCategory, draft.engagementModel, draft.budgetTier]
      .filter(Boolean)
      .join(" · ") ||
    "Legal matter from AI Intake questionnaire";

  return {
    practiceArea: draft.practiceArea as PracticeArea | undefined,
    jurisdiction: draft.jurisdictionCode as JurisdictionCode | undefined,
    urgency: (draft.urgency as UrgencyLevel | undefined) ?? "medium",
    summary: summary.slice(0, 500),
    facts: {
      primaryCategory: draft.primaryCategory,
      primaryCategoryId: draft.primaryCategoryId,
      subCategory: draft.subCategory,
      engagementModel: draft.engagementModel,
      jurisdictionLabel: draft.jurisdiction,
      budgetTier: draft.budgetTier,
      feeStructure: draft.feeStructure,
      urgentDetained: draft.urgentDetained,
      legalNoticeServed: draft.legalNoticeServed,
      language: draft.language,
      contactPreference: draft.contactPreference,
      leadMaskingConsent: draft.leadMaskingConsent,
      masked: true,
      contactReleased: false,
      clientFullName: draft.clientFullName,
      clientPhone: draft.clientPhone,
      clientEmail: draft.clientEmail,
    },
  };
}
