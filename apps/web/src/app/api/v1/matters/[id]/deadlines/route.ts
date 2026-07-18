import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiCreated, apiError, notConfigured } from "@/lib/api/response";
import {
  DEADLINE_KINDS,
  sortDeadlinesByDue,
  toDeadlineAlert,
} from "@/features/litigation";
import { getAccessibleLead, recordLeadActivity } from "@/features/portal/access";
import { matterAccessError } from "@/features/portal/http";
import { writeAuditLog } from "@/features/crm/access";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  if (!isSupabaseConfigured()) return notConfigured("Deadlines");

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
    .from("matter_deadlines")
    .select(
      "id, lead_id, title, due_at, status, kind, created_by, created_at, updated_at"
    )
    .eq("lead_id", id)
    .order("due_at", { ascending: true });

  if (error) return apiError("internal", error.message, 500);

  const rows = sortDeadlinesByDue(data ?? []);
  return apiOk({
    deadlines: rows,
    alerts: rows
      .filter((d) => d.status === "open")
      .map((d) => toDeadlineAlert(d)),
  });
}

const postSchema = z.object({
  title: z.string().min(1).max(300),
  dueAt: z.string().datetime(),
  kind: z.enum(["hearing", "filing", "limitation", "obligation", "general"]).default("general"),
});

export async function POST(req: NextRequest, ctx: Ctx) {
  if (!isSupabaseConfigured()) return notConfigured("Deadlines");

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("validation_error", "Invalid deadline", 400, parsed.error.flatten());
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
    .from("matter_deadlines")
    .insert({
      lead_id: id,
      title: parsed.data.title,
      due_at: parsed.data.dueAt,
      kind: parsed.data.kind,
      status: "open",
      created_by: session.auth.id,
    })
    .select(
      "id, lead_id, title, due_at, status, kind, created_by, created_at, updated_at"
    )
    .single();

  if (error) return apiError("internal", error.message, 500);

  await recordLeadActivity(
    supabase,
    id,
    `Deadline added: ${parsed.data.title}`
  );
  await writeAuditLog(supabase, {
    action: "deadline.create",
    performedBy: session.auth.id,
    details: `Deadline ${data.id} on lead ${id}`,
  });

  return apiCreated({ deadline: data, kinds: DEADLINE_KINDS });
}
