import { faqContextBlock, matchFaq } from "./faq-corpus";
import type { ChatSessionData } from "./types";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = (
  process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1"
).replace(/\/$/, "");
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const OLLAMA_BASE = process.env.OLLAMA_BASE_URL?.replace(/\/$/, "");
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3";

export type ChatCompletionMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type IntakeClassifyIntent =
  | "answer_question"
  | "provide_slot"
  | "select_option"
  | "unclear";

export interface IntakeClassifyResult {
  intent: IntakeClassifyIntent;
  selectedOption?: string;
  slotValue?: string;
  answer?: string;
}

const SYSTEM_GUARDRAIL = `You are Barristrly's UAE legal intake assistant (not a licensed lawyer).
Rules:
- Never invent lawyer names, fees, court outcomes, or legal advice.
- Never claim contact details are shared with lawyers before consultation + explicit client release.
- Keep replies short (2-4 sentences max).
- Prefer platform process facts from the FAQ context.
- If unsure, say so and invite the user to continue the intake options.`;

function substringMatchOption(
  userText: string,
  options: readonly string[]
): string | null {
  const lower = userText.trim().toLowerCase();
  if (!lower) return null;
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

export function isLlmConfigured(): boolean {
  return Boolean(OPENAI_API_KEY || OLLAMA_BASE);
}

export function isOpenAiConfigured(): boolean {
  return Boolean(OPENAI_API_KEY);
}

async function chatCompletionOpenAi(
  messages: ChatCompletionMessage[]
): Promise<string | null> {
  if (!OPENAI_API_KEY) return null;
  try {
    const res = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.2,
        messages,
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}

async function chatCompletionOllama(
  messages: ChatCompletionMessage[]
): Promise<string | null> {
  if (!OLLAMA_BASE) return null;
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        messages,
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { message?: { content?: string } };
    return data.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}

export async function chatCompletion(
  messages: ChatCompletionMessage[]
): Promise<string | null> {
  const fromOpenAi = await chatCompletionOpenAi(messages);
  if (fromOpenAi) return fromOpenAi;
  return chatCompletionOllama(messages);
}

function extractJsonObject(raw: string): Record<string, unknown> | null {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = (fenced?.[1] ?? raw).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function normalizeClassify(
  raw: Record<string, unknown> | null
): IntakeClassifyResult | null {
  if (!raw || typeof raw.intent !== "string") return null;
  const intent = raw.intent as string;
  if (
    intent !== "answer_question" &&
    intent !== "provide_slot" &&
    intent !== "select_option" &&
    intent !== "unclear"
  ) {
    return null;
  }
  return {
    intent,
    selectedOption:
      typeof raw.selectedOption === "string" ? raw.selectedOption : undefined,
    slotValue: typeof raw.slotValue === "string" ? raw.slotValue : undefined,
    answer: typeof raw.answer === "string" ? raw.answer : undefined,
  };
}

function deterministicClassify(
  userText: string,
  options: readonly string[]
): IntakeClassifyResult {
  const faq = matchFaq(userText);
  const looksLikeQuestion =
    /\?|\b(what|how|why|when|where|who|will|can|do you|does|is my|are my)\b/i.test(
      userText
    );

  if (faq && looksLikeQuestion) {
    return { intent: "answer_question", answer: faq };
  }

  if (options.length > 0) {
    const matched = substringMatchOption(userText, options);
    if (matched) return { intent: "select_option", selectedOption: matched };
  } else if (userText.trim().length >= 2) {
    return { intent: "provide_slot", slotValue: userText.trim() };
  }

  if (faq) return { intent: "answer_question", answer: faq };
  return { intent: "unclear" };
}

export async function classifyIntakeTurn(params: {
  session: ChatSessionData;
  userText: string;
  currentStepPrompt: string;
  options: readonly string[];
}): Promise<IntakeClassifyResult> {
  const { session, userText, currentStepPrompt, options } = params;
  const fallback = deterministicClassify(userText, options);

  if (!isLlmConfigured()) return fallback;

  const optionBlock =
    options.length > 0
      ? `Allowed options (pick exact string if selecting):\n${options.map((o) => `- ${o}`).join("\n")}`
      : "This step expects free-text (no fixed options). Put the answer in slotValue.";

  const content = await chatCompletion([
    {
      role: "system",
      content: `${SYSTEM_GUARDRAIL}

Classify the user's message for a structured legal intake wizard.
Return ONLY valid JSON with this shape:
{"intent":"answer_question"|"provide_slot"|"select_option"|"unclear","selectedOption":string|null,"slotValue":string|null,"answer":string|null}

intent meanings:
- answer_question: user is asking about process/privacy/fees/COI/jurisdiction (not filling the current step)
- select_option: user is choosing one of the allowed options (selectedOption must be an exact option string)
- provide_slot: user is providing free-text for the current step (slotValue)
- unclear: cannot tell

FAQ context:
${faqContextBlock()}

Current intake state: ${session.state}
Current step prompt: ${currentStepPrompt}
${optionBlock}`,
    },
    { role: "user", content: userText },
  ]);

  if (!content) return fallback;

  const parsed = normalizeClassify(extractJsonObject(content));
  if (!parsed) return fallback;

  if (parsed.intent === "select_option" && options.length > 0) {
    const exact =
      (parsed.selectedOption &&
        options.find(
          (o) => o.toLowerCase() === parsed.selectedOption!.toLowerCase()
        )) ||
      substringMatchOption(parsed.selectedOption ?? userText, options);
    if (!exact) {
      if (parsed.answer || matchFaq(userText)) {
        return {
          intent: "answer_question",
          answer: parsed.answer ?? matchFaq(userText) ?? undefined,
        };
      }
      return { intent: "unclear" };
    }
    return { intent: "select_option", selectedOption: exact };
  }

  if (parsed.intent === "provide_slot") {
    const value = (parsed.slotValue ?? userText).trim();
    if (!value) return { intent: "unclear" };
    return { intent: "provide_slot", slotValue: value };
  }

  if (parsed.intent === "answer_question") {
    const answer =
      parsed.answer?.trim() ||
      matchFaq(userText) ||
      "I can help with how Barristrly intake, privacy masking, COI screening, and matching work. Choose an option below to continue, or ask another process question.";
    return { intent: "answer_question", answer };
  }

  return parsed.intent === "unclear" ? { intent: "unclear" } : fallback;
}

export async function answerUserQuestion(params: {
  session: ChatSessionData;
  userText: string;
}): Promise<string> {
  const { session, userText } = params;
  const faq = matchFaq(userText);

  if (!isLlmConfigured()) {
    return (
      faq ??
      "I can answer questions about privacy masking, fees, jurisdictions, COI screening, and matching. I cannot give legal advice on your specific matter — continue the intake so we can route you to a verified specialist."
    );
  }

  const content = await chatCompletion([
    {
      role: "system",
      content: `${SYSTEM_GUARDRAIL}

Answer the user's process question using ONLY this FAQ context and anonymity rules.
If the question seeks legal advice on their case facts, politely decline and invite them to continue intake.
Remind them that contact details stay masked from lawyers until after consultation and explicit release.

FAQ:
${faqContextBlock()}

Session state: ${session.state}
Draft practice area: ${session.intakeDraft.primaryCategory ?? "not set yet"}`,
    },
    { role: "user", content: userText },
  ]);

  if (content && content.length < 800) return content;
  return (
    faq ??
    "Your details stay masked from lawyers until after consultation and your explicit approval. Choose an option below to continue intake, or ask another process question."
  );
}
