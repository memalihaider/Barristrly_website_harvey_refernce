import type { SupabaseClient } from "@supabase/supabase-js";

export async function writeAuditLog(
  supabase: SupabaseClient,
  opts: {
    action: string;
    performedBy: string;
    details: string;
  }
) {
  await supabase.from("audit_logs").insert({
    action: opts.action,
    performed_by: opts.performedBy,
    details: opts.details,
  });
}

/** Leads visible to a lawyer: assigned or matched. */
export async function listLawyerLeadRows(
  supabase: SupabaseClient,
  lawyerId: string
) {
  const { data: assigned } = await supabase
    .from("leads")
    .select(
      "id, client_id, assigned_lawyer_id, status, category, description, created_at, updated_at"
    )
    .eq("assigned_lawyer_id", lawyerId);

  const { data: matches } = await supabase
    .from("lawyer_matches")
    .select("lead_id")
    .eq("lawyer_id", lawyerId);

  const matchIds = (matches ?? []).map((m) => m.lead_id as string);
  let matched: typeof assigned = [];
  if (matchIds.length > 0) {
    const { data } = await supabase
      .from("leads")
      .select(
        "id, client_id, assigned_lawyer_id, status, category, description, created_at, updated_at"
      )
      .in("id", matchIds);
    matched = data ?? [];
  }

  const byId = new Map<string, NonNullable<typeof assigned>[number]>();
  for (const l of [...(assigned ?? []), ...(matched ?? [])]) {
    byId.set(l.id as string, l);
  }
  return Array.from(byId.values());
}

export async function lawyerCanAccessLead(
  supabase: SupabaseClient,
  lawyerId: string,
  leadId: string
): Promise<boolean> {
  const { data: lead } = await supabase
    .from("leads")
    .select("id, assigned_lawyer_id")
    .eq("id", leadId)
    .maybeSingle();
  if (!lead) return false;
  if (lead.assigned_lawyer_id === lawyerId) return true;
  const { data: match } = await supabase
    .from("lawyer_matches")
    .select("id")
    .eq("lead_id", leadId)
    .eq("lawyer_id", lawyerId)
    .maybeSingle();
  return Boolean(match);
}
