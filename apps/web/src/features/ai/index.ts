/** Phase 5 — Thin AI gateway (Gemini when keyed, stubs otherwise) */

import { extractIntakeStub } from "@/features/marketplace/intake";

export type AiAgentKey = "intake" | "research" | "draft" | "summarize" | "coi";

export type AiCitation = {
  label: string;
  url?: string;
};

export type AiAgentResult = {
  text: string;
  citations: AiCitation[];
  model: string;
  gated: boolean;
  requireHumanReview: boolean;
  structured?: unknown;
};

export type AiMatterContext = {
  matterId: string;
  category?: string | null;
  description?: string | null;
  notes?: string[];
  activity?: string[];
};

export function selectModelForAgent(agent: AiAgentKey): string {
  switch (agent) {
    case "research":
    case "draft":
      return "gemini-2.5-pro";
    default:
      return "gemini-2.5-flash";
  }
}

export function requireHumanReview(agent: AiAgentKey): boolean {
  return agent === "research" || agent === "draft";
}

export function buildSystemPrompt(agent: AiAgentKey): string {
  switch (agent) {
    case "intake":
      return "You are a legal intake assistant for Barristrly. Extract practice area, jurisdiction hints, urgency, and a short summary. Be concise. Do not invent facts.";
    case "summarize":
      return "You are a legal matter summarizer. Produce a clear brief for counsel and client. Flag unknowns. Do not invent facts.";
    case "draft":
      return "You are a legal drafting assistant. Produce a short professional draft. Mark anything that needs lawyer review. Do not invent case law citations.";
    case "research":
      return "You are a legal research assistant. Outline research steps and questions. Do not fabricate authorities; leave citations empty unless provided.";
    case "coi":
      return "You are a conflict-check assistant. List parties and conflict risk flags from the text. Do not invent parties.";
  }
}

function buildUserContent(
  agent: AiAgentKey,
  prompt: string,
  context?: AiMatterContext
): string {
  const parts = [`User request:\n${prompt}`];
  if (context) {
    parts.push(
      `Matter context:\n- id: ${context.matterId}\n- category: ${context.category ?? "n/a"}\n- description: ${context.description ?? "n/a"}`
    );
    if (context.notes?.length) {
      parts.push(`Recent notes:\n${context.notes.map((n) => `- ${n}`).join("\n")}`);
    }
    if (context.activity?.length) {
      parts.push(
        `Recent activity:\n${context.activity.map((a) => `- ${a}`).join("\n")}`
      );
    }
  }
  if (agent === "intake") {
    parts.push(
      "Respond as JSON with keys: practiceArea, jurisdiction, urgency, summary (string)."
    );
  }
  return parts.join("\n\n");
}

function stubResult(
  agent: AiAgentKey,
  prompt: string,
  context?: AiMatterContext
): AiAgentResult {
  const model = selectModelForAgent(agent);
  const gated = true;
  const review = requireHumanReview(agent);

  if (agent === "intake") {
    const structured = extractIntakeStub(prompt);
    return {
      text: `Intake summary: ${structured.summary}`,
      citations: [],
      model: "stub",
      gated,
      requireHumanReview: false,
      structured,
    };
  }

  if (agent === "summarize") {
    const desc = context?.description?.slice(0, 400) || prompt.slice(0, 400);
    return {
      text: [
        "Matter brief (stub — configure GEMINI_API_KEY for live inference)",
        "",
        `Category: ${context?.category ?? "general"}`,
        `Synopsis: ${desc}`,
        context?.notes?.length
          ? `Notes considered: ${context.notes.length}`
          : "Notes: none yet",
        "",
        "Next steps: confirm facts with client, review documents, schedule follow-up.",
      ].join("\n"),
      citations: [],
      model: "stub",
      gated,
      requireHumanReview: review,
    };
  }

  if (agent === "draft") {
    return {
      text: [
        "Subject: Follow-up on your legal matter",
        "",
        "Dear Client,",
        "",
        `Thank you for the update regarding: ${prompt.slice(0, 160) || "your matter"}.`,
        "",
        "I recommend we review the next steps together. Please confirm your availability for a short consult.",
        "",
        "Kind regards,",
        "[Lawyer name — review before send]",
        "",
        "⚠ Human review required before sending.",
      ].join("\n"),
      citations: [],
      model: "stub",
      gated,
      requireHumanReview: true,
    };
  }

  if (agent === "research") {
    return {
      text: [
        "Research outline (stub — no live authorities)",
        "1. Confirm governing law / forum",
        "2. Identify key statutes and procedural rules",
        "3. Gather primary documents and chronology",
        "4. Map opposing positions and settlement options",
        "",
        "Citations intentionally empty until research engine is wired.",
      ].join("\n"),
      citations: [],
      model: "stub",
      gated,
      requireHumanReview: true,
    };
  }

  return {
    text: `COI stub for: ${prompt.slice(0, 200)}`,
    citations: [],
    model: "stub",
    gated,
    requireHumanReview: false,
  };
}

async function callGemini(
  agent: AiAgentKey,
  prompt: string,
  context?: AiMatterContext
): Promise<AiAgentResult> {
  const apiKey = process.env.GEMINI_API_KEY!;
  const model = selectModelForAgent(agent);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${buildSystemPrompt(agent)}\n\n${buildUserContent(agent, prompt, context)}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: agent === "draft" ? 0.4 : 0.2,
      maxOutputTokens: 2048,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Gemini error ${res.status}: ${errText.slice(0, 300)}`);
  }

  const json = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text =
    json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ||
    "";

  let structured: unknown;
  if (agent === "intake") {
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) structured = JSON.parse(match[0]);
    } catch {
      structured = extractIntakeStub(prompt);
    }
  }

  return {
    text: text || "(empty model response)",
    citations: [],
    model,
    gated: false,
    requireHumanReview: requireHumanReview(agent),
    structured,
  };
}

export async function runAiAgent(opts: {
  agent: AiAgentKey;
  prompt: string;
  context?: AiMatterContext;
}): Promise<AiAgentResult> {
  if (!process.env.GEMINI_API_KEY) {
    return stubResult(opts.agent, opts.prompt, opts.context);
  }
  try {
    return await callGemini(opts.agent, opts.prompt, opts.context);
  } catch {
    // Fall back to stub so the product loop never hard-fails
    const stub = stubResult(opts.agent, opts.prompt, opts.context);
    return {
      ...stub,
      text: `${stub.text}\n\n(Note: live Gemini call failed; showing stub.)`,
      gated: true,
    };
  }
}
