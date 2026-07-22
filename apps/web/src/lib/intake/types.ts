export type ChatState = "greeting" | "intake" | "complete" | "exited";

export interface ChatMessage {
  id: string;
  role: "user" | "bot" | "system";
  content: string;
  createdAt: string;
}

export interface IntakeDraft {
  primaryCategory?: string;
  primaryCategoryId?: string;
  subCategory?: string;
  engagementModel?: string;
  jurisdiction?: string;
  budgetTier?: string;
  feeStructure?: string;
  caseDescription?: string;
  urgentDetained?: boolean;
  legalNoticeServed?: boolean;
  language?: string;
  contactPreference?: string;
  leadMaskingConsent?: boolean;
  clientFullName?: string;
  clientPhone?: string;
  clientEmail?: string;
  /** Ontology-mapped fields for matching */
  practiceArea?: string;
  jurisdictionCode?: string;
  urgency?: string;
}

export interface ChatSessionData {
  id: string;
  guestId: string;
  state: ChatState;
  intakeStep: number;
  messages: ChatMessage[];
  intakeDraft: IntakeDraft;
  createdAt: string;
  updatedAt: string;
}

export interface ChatTurnResult {
  session: ChatSessionData;
  botMessages: string[];
  quickReplies?: string[];
  complete: boolean;
}

export type ChatAction =
  | { type: "message"; text: string }
  | { type: "quick_reply"; text: string }
  | { type: "start" }
  | { type: "restart" };
