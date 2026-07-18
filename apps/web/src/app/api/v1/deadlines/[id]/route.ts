import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { DEADLINE_STATUSES } from "@/features/litigation";
import { getAccessibleLead, recordLeadActivity } from "@/features/portal/access";
import { matterAccessError } from "@/features/portal/http";
import { writeAuditLog } from "@/features/crm/access";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  status: z.enum(["open", "done", "missed", "cancelled"]).optional(),
  dueAt: z.string().datetime().optional(),
  title: z.string().min(1).max(300).optional(),
});

export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!isSupabaseConfigured()) return notConfigured("Deadlines");

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("validation_error", "Invalid update", 400, parsed.error.flatten());
  }

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const supabase = await createClient();
  const { data: row, error: findErr } = await supabase
    .from("matter_deadlines")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (findErr) return apiError("internal", findErr.message, 500);
  if (!row) return apiError("not_found", "Deadline not found", 404);

  const access = await getAccessibleLead(
    supabase,
    row.lead_id as string,
    session.auth.id,
    session.profile.role
  );
  if (!access.ok) return matterAccessError(access);

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (parsed.data.status) updates.status = parsed.data.status;
  if (parsed.data.dueAt) updates.due_at = parsed.data.dueAt;
  if (parsed.data.title) updates.title = parsed.data.title;

  const { data, error } = await supabase
    .from("matter_deadlines")
    .update(updates)
    .eq("id", id)
    .select(
      "id, lead_id, title, due_at, status, kind, created_by, created_at, updated_at"
    )
    .single();

  if (error) return apiError("internal", error.message, 500);

  if (parsed.data.status) {
    await recordLeadActivity(
      supabase,
      row.lead_id as string,
      `Deadline ${parsed.data.status}: ${row.title}`
    );
  }
  await writeAuditLog(supabase, {
    action: "deadline.update",
    performedBy: session.auth.id,
    details: `Deadline ${id}: ${JSON.stringify(parsed.data)}`,
  });

  return apiOk({ deadline: data, statuses: DEADLINE_STATUSES });
}
