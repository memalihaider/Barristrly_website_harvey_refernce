import type { SupabaseClient } from "@supabase/supabase-js";
import { isMatterStatus, type LeadRow } from "@/features/portal";

export async function recordLeadActivity(
  supabase: SupabaseClient,
  leadId: string,
  activity: string
) {
  await supabase.from("lead_activity").insert({
    lead_id: leadId,
    activity,
  });
}

/** Load a lead and verify the session user is client or assigned/matched lawyer. */
export async function getAccessibleLead(
  supabase: SupabaseClient,
  leadId: string,
  userId: string,
  role: string
): Promise<{ ok: true; lead: LeadRow } | { ok: false; error: string; status: number }> {
  const { data: lead, error } = await supabase
    .from("leads")
    .select(
      "id, client_id, assigned_lawyer_id, status, category, description, created_at, updated_at"
    )
    .eq("id", leadId)
    .maybeSingle();

  if (error) return { ok: false, error: error.message, status: 500 };
  if (!lead) return { ok: false, error: "Matter not found", status: 404 };

  const row = lead as LeadRow;

  if (role === "lawyer") {
    if (row.assigned_lawyer_id === userId) {
      return { ok: true, lead: row };
    }
    const { data: match } = await supabase
      .from("lawyer_matches")
      .select("id")
      .eq("lead_id", leadId)
      .eq("lawyer_id", userId)
      .maybeSingle();
    if (!match) return { ok: false, error: "Not your matter", status: 403 };
    return { ok: true, lead: row };
  }

  if (row.client_id !== userId) {
    return { ok: false, error: "Not your matter", status: 403 };
  }
  return { ok: true, lead: row };
}

export async function listMattersForUser(
  supabase: SupabaseClient,
  userId: string,
  role: string
): Promise<{ leads: LeadRow[]; error?: string }> {
  if (role === "lawyer") {
    const { data: assigned, error: aErr } = await supabase
      .from("leads")
      .select(
        "id, client_id, assigned_lawyer_id, status, category, description, created_at, updated_at"
      )
      .eq("assigned_lawyer_id", userId)
      .in("status", ["consulting", "engaged", "completed"])
      .order("updated_at", { ascending: false });

    if (aErr) return { leads: [], error: aErr.message };

    const { data: matches } = await supabase
      .from("lawyer_matches")
      .select("lead_id")
      .eq("lawyer_id", userId);

    const matchIds = (matches ?? []).map((m) => m.lead_id as string);
    let matchedLeads: LeadRow[] = [];
    if (matchIds.length > 0) {
      const { data } = await supabase
        .from("leads")
        .select(
          "id, client_id, assigned_lawyer_id, status, category, description, created_at, updated_at"
        )
        .in("id", matchIds)
        .in("status", ["consulting", "engaged", "completed"]);
      matchedLeads = (data as LeadRow[] | null) ?? [];
    }

    const byId = new Map<string, LeadRow>();
    for (const l of [...((assigned as LeadRow[]) ?? []), ...matchedLeads]) {
      if (isMatterStatus(l.status)) byId.set(l.id, l);
    }
    return {
      leads: Array.from(byId.values()).sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      ),
    };
  }

  const { data, error } = await supabase
    .from("leads")
    .select(
      "id, client_id, assigned_lawyer_id, status, category, description, created_at, updated_at"
    )
    .eq("client_id", userId)
    .in("status", ["consulting", "engaged", "completed"])
    .order("updated_at", { ascending: false });

  if (error) return { leads: [], error: error.message };
  return { leads: (data as LeadRow[] | null) ?? [] };
}

export async function getContactRevealed(
  supabase: SupabaseClient,
  leadId: string,
  lawyerId: string | null
): Promise<boolean> {
  if (!lawyerId) return false;
  const { data } = await supabase
    .from("dual_consent")
    .select("contact_revealed")
    .eq("lead_id", leadId)
    .eq("lawyer_id", lawyerId)
    .maybeSingle();
  return Boolean(data?.contact_revealed);
}

export async function getDisplayName(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  const { data: lawyer } = await supabase
    .from("lawyer_profiles")
    .select("display_name")
    .eq("id", userId)
    .maybeSingle();
  if (lawyer?.display_name) return lawyer.display_name as string;

  const { data: user } = await supabase
    .from("users")
    .select("display_name")
    .eq("id", userId)
    .maybeSingle();
  return (user?.display_name as string | null) ?? null;
}

export async function ensureMatterOpenedActivity(
  supabase: SupabaseClient,
  leadId: string
) {
  const { count } = await supabase
    .from("lead_activity")
    .select("id", { count: "exact", head: true })
    .eq("lead_id", leadId);

  if ((count ?? 0) === 0) {
    await recordLeadActivity(supabase, leadId, "Matter opened from consult");
  }
}
