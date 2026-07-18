import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import {
  PIPELINE_STATUSES,
  canTransitionLead,
} from "@/features/crm";
import {
  lawyerCanAccessLead,
  listLawyerLeadRows,
  writeAuditLog,
} from "@/features/crm/access";
import { recordLeadActivity } from "@/features/portal/access";
import { maskDisplayName } from "@/features/marketplace/consent";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(_req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("CRM pipeline");

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);
  if (session.profile.role !== "lawyer") {
    return apiError("forbidden", "Lawyer role required", 403);
  }

  const supabase = await createClient();
  const leads = await listLawyerLeadRows(supabase, session.auth.id);

  const columns: Record<string, unknown[]> = {};
  for (const s of PIPELINE_STATUSES) columns[s] = [];

  for (const lead of leads) {
    const status = lead.status as string;
    if (!columns[status]) columns[status] = [];

    const { data: consent } = await supabase
      .from("dual_consent")
      .select("contact_revealed")
      .eq("lead_id", lead.id)
      .eq("lawyer_id", session.auth.id)
      .maybeSingle();
    const revealed = Boolean(consent?.contact_revealed);

    columns[status].push({
      id: lead.id,
      category: lead.category,
      status: lead.status,
      description: revealed
        ? lead.description
        : String(lead.description ?? "").slice(0, 80) +
          (String(lead.description ?? "").length > 80 ? "…" : ""),
      clientLabel: maskDisplayName("Client", revealed),
      contactRevealed: revealed,
      isMatter: ["consulting", "engaged", "completed"].includes(status),
      updatedAt: lead.updated_at,
    });
  }

  return apiOk({
    columns,
    statuses: PIPELINE_STATUSES,
    total: leads.length,
  });
}

const patchSchema = z.object({
  leadId: z.string().uuid(),
  status: z.enum(PIPELINE_STATUSES),
});

export async function PATCH(req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("CRM pipeline");

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("validation_error", "Invalid pipeline update", 400, parsed.error.flatten());
  }

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);
  if (session.profile.role !== "lawyer") {
    return apiError("forbidden", "Lawyer role required", 403);
  }

  const supabase = await createClient();
  const allowed = await lawyerCanAccessLead(
    supabase,
    session.auth.id,
    parsed.data.leadId
  );
  if (!allowed) return apiError("forbidden", "Not your lead", 403);

  const { data: lead, error: findErr } = await supabase
    .from("leads")
    .select("id, status")
    .eq("id", parsed.data.leadId)
    .maybeSingle();

  if (findErr) return apiError("internal", findErr.message, 500);
  if (!lead) return apiError("not_found", "Lead not found", 404);

  if (!canTransitionLead(lead.status as string, parsed.data.status)) {
    return apiError(
      "conflict",
      `Cannot move from ${lead.status} to ${parsed.data.status}`,
      409
    );
  }

  const { data: updated, error } = await supabase
    .from("leads")
    .update({
      status: parsed.data.status,
      updated_at: new Date().toISOString(),
      assigned_lawyer_id: session.auth.id,
    })
    .eq("id", parsed.data.leadId)
    .select("id, status, category, client_id, assigned_lawyer_id, updated_at")
    .single();

  if (error) return apiError("internal", error.message, 500);

  await recordLeadActivity(
    supabase,
    parsed.data.leadId,
    `Pipeline: ${lead.status} → ${parsed.data.status}`
  );
  await writeAuditLog(supabase, {
    action: "lead.pipeline_status",
    performedBy: session.auth.id,
    details: `Lead ${parsed.data.leadId}: ${lead.status} → ${parsed.data.status}`,
  });

  return apiOk({ lead: updated });
}
