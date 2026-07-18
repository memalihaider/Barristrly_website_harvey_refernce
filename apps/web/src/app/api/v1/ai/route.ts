import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { runAiAgent, type AiAgentKey } from "@/features/ai";
import { getAccessibleLead, recordLeadActivity } from "@/features/portal/access";
import { matterAccessError } from "@/features/portal/http";
import { writeAuditLog } from "@/features/crm/access";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";

const schema = z.object({
  agent: z
    .enum(["intake", "research", "draft", "summarize", "coi"])
    .default("intake"),
  prompt: z.string().min(1).max(20000),
  matterId: z.string().uuid().optional(),
  sessionId: z.string().min(1).max(128).optional(),
});

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  at: string;
  agent?: string;
};

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("AI");

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return apiError("validation_error", "Invalid AI payload", 400, parsed.error.flatten());
  }

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const supabase = await createClient();
  const agent = parsed.data.agent as AiAgentKey;

  let context:
    | {
        matterId: string;
        category?: string | null;
        description?: string | null;
        notes?: string[];
        activity?: string[];
      }
    | undefined;

  if (parsed.data.matterId) {
    const access = await getAccessibleLead(
      supabase,
      parsed.data.matterId,
      session.auth.id,
      session.profile.role
    );
    if (!access.ok) return matterAccessError(access);

    const { data: notes } = await supabase
      .from("lead_notes")
      .select("note")
      .eq("lead_id", parsed.data.matterId)
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: activity } = await supabase
      .from("lead_activity")
      .select("activity")
      .eq("lead_id", parsed.data.matterId)
      .order("created_at", { ascending: false })
      .limit(8);

    context = {
      matterId: access.lead.id,
      category: access.lead.category,
      description: access.lead.description,
      notes: (notes ?? []).map((n) => n.note as string),
      activity: (activity ?? []).map((a) => a.activity as string),
    };
  }

  const result = await runAiAgent({
    agent,
    prompt: parsed.data.prompt,
    context,
  });

  const sessionId =
    parsed.data.sessionId ??
    `ai_${agent}_${session.auth.id.slice(0, 8)}_${Date.now().toString(36)}`;

  const { data: existing } = await supabase
    .from("chat_sessions")
    .select("id, data")
    .eq("id", sessionId)
    .maybeSingle();

  const prevMessages: ChatMessage[] = Array.isArray(
    (existing?.data as { messages?: ChatMessage[] } | null)?.messages
  )
    ? ((existing?.data as { messages: ChatMessage[] }).messages ?? [])
    : [];

  const now = new Date().toISOString();
  const nextMessages: ChatMessage[] = [
    { role: "user" as const, content: parsed.data.prompt, at: now, agent },
    { role: "assistant" as const, content: result.text, at: now, agent },
  ];
  const messages: ChatMessage[] = [...prevMessages, ...nextMessages].slice(-40);

  const payload = {
    id: sessionId,
    guest_id: session.auth.id,
    user_id: session.auth.id,
    data: {
      agent,
      matterId: parsed.data.matterId ?? null,
      messages,
      lastModel: result.model,
      gated: result.gated,
    },
    updated_at: now,
  };

  if (existing?.id) {
    await supabase
      .from("chat_sessions")
      .update({
        data: payload.data,
        updated_at: now,
        user_id: session.auth.id,
      })
      .eq("id", sessionId);
  } else {
    await supabase.from("chat_sessions").insert({
      ...payload,
      created_at: now,
    });
  }

  if (parsed.data.matterId) {
    await recordLeadActivity(
      supabase,
      parsed.data.matterId,
      `AI ${agent} run`
    );
    await writeAuditLog(supabase, {
      action: `ai.${agent}`,
      performedBy: session.auth.id,
      details: `session ${sessionId} on matter ${parsed.data.matterId}`,
    });
  }

  return apiOk({
    agent,
    sessionId,
    result: {
      text: result.text,
      citations: result.citations,
      model: result.model,
      structured: result.structured,
    },
    gated: result.gated,
    requireHumanReview: result.requireHumanReview,
  });
}

export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("AI");

  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return apiError("validation_error", "sessionId required", 400);
  }

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("id, data, updated_at")
    .eq("id", sessionId)
    .eq("user_id", session.auth.id)
    .maybeSingle();

  if (error) return apiError("internal", error.message, 500);
  if (!data) return apiError("not_found", "Session not found", 404);

  return apiOk({ session: data });
}
