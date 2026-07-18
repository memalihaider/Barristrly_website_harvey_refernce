import { NextRequest } from "next/server";
import { z } from "zod";
import { apiCreated, apiOk, apiError, notConfigured } from "@/lib/api/response";
import {
  getAccessibleLead,
  recordLeadActivity,
} from "@/features/portal/access";
import { matterAccessError } from "@/features/portal/http";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  if (!isSupabaseConfigured()) return notConfigured("Matters");

  const { id } = await ctx.params;
  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const supabase = await createClient();
  const access = await getAccessibleLead(
    supabase,
    id,
    session.auth.id,
    session.profile.role
  );
  if (!access.ok) return matterAccessError(access);

  const { data, error } = await supabase
    .from("lead_notes")
    .select("id, lead_id, note, created_at")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  if (error) return apiError("internal", error.message, 500);
  return apiOk({ notes: data ?? [] });
}

const postSchema = z.object({
  note: z.string().min(1).max(10000),
});

export async function POST(req: NextRequest, ctx: Ctx) {
  if (!isSupabaseConfigured()) return notConfigured("Matters");

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("validation_error", "Invalid note", 400, parsed.error.flatten());
  }

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const supabase = await createClient();
  const access = await getAccessibleLead(
    supabase,
    id,
    session.auth.id,
    session.profile.role
  );
  if (!access.ok) return matterAccessError(access);

  const { data, error } = await supabase
    .from("lead_notes")
    .insert({ lead_id: id, note: parsed.data.note })
    .select("id, lead_id, note, created_at")
    .single();

  if (error) return apiError("internal", error.message, 500);

  await recordLeadActivity(supabase, id, "Note added");

  return apiCreated({ note: data });
}
