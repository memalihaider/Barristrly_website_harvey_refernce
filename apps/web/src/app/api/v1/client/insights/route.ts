import { NextRequest } from "next/server";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { getSessionUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  buildClientNextActions,
  rankNextBestActions,
} from "@/features/intelligence";

export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("Client insights");

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);
  if (session.profile.role !== "client") {
    return apiError("forbidden", "Client role required", 403);
  }

  const leadIdFilter = req.nextUrl.searchParams.get("leadId") ?? undefined;
  const supabase = await createClient();
  const clientId = session.auth.id;

  const { data: leadsRaw, error: leadsErr } = await supabase
    .from("leads")
    .select("id, status")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (leadsErr) return apiError("internal", leadsErr.message, 500);

  const leads = leadsRaw ?? [];
  const leadIds = leads.map((l) => l.id as string);

  const empty = { data: [] as Record<string, unknown>[] };

  const [meetingsRes, escrowRes, consentRes, matchesRes, notesRes] =
    await Promise.all([
      supabase
        .from("meetings")
        .select("id, status, scheduled_at, lead_id, lawyer_id")
        .eq("client_id", clientId),
      supabase
        .from("escrow_accounts")
        .select("id, status, client_confirmed, lead_id, lawyer_id, payment_id")
        .eq("client_id", clientId),
      supabase
        .from("dual_consent")
        .select(
          "id, lead_id, lawyer_id, client_consented, contact_revealed"
        )
        .eq("client_id", clientId),
      leadIds.length > 0
        ? supabase
            .from("lawyer_matches")
            .select("lead_id, lawyer_id, status, is_primary, rank")
            .in("lead_id", leadIds)
            .order("rank", { ascending: true })
        : Promise.resolve(empty),
      leadIds.length > 0
        ? supabase
            .from("lead_notes")
            .select("lead_id, created_at")
            .in("lead_id", leadIds)
            .order("created_at", { ascending: false })
            .limit(200)
        : Promise.resolve(empty),
    ]);

  const meetings = meetingsRes.data ?? [];
  const escrows = escrowRes.data ?? [];
  const consents = consentRes.data ?? [];
  const matches = matchesRes.data ?? [];

  const meetingLeadIds = new Set(
    meetings
      .filter((m) => !["cancelled"].includes(m.status as string))
      .map((m) => m.lead_id as string)
  );

  const escrowByLead = new Map<string, (typeof escrows)[number]>();
  for (const e of escrows) {
    escrowByLead.set(e.lead_id as string, e);
  }

  const pendingConsentLeadIds: string[] = [];
  const bookable: { leadId: string; lawyerId: string | null }[] = [];

  const matchedLeads = leads.filter((l) =>
    ["matched", "consulting"].includes(l.status as string)
  );

  for (const lead of matchedLeads) {
    const leadConsents = consents.filter((c) => c.lead_id === lead.id);
    const clientReady = leadConsents.some(
      (c) => c.client_consented || c.contact_revealed
    );
    if (!clientReady) {
      pendingConsentLeadIds.push(lead.id as string);
      continue;
    }
    if (!meetingLeadIds.has(lead.id as string)) {
      const consentRow =
        leadConsents.find((c) => c.contact_revealed || c.client_consented) ??
        leadConsents[0];
      const primaryMatch =
        matches.find((m) => m.lead_id === lead.id && m.is_primary) ??
        matches.find((m) => m.lead_id === lead.id);
      bookable.push({
        leadId: lead.id as string,
        lawyerId:
          (consentRow?.lawyer_id as string | undefined) ??
          (primaryMatch?.lawyer_id as string | undefined) ??
          null,
      });
    }
  }

  const needsEscrowFunding: { leadId: string; lawyerId: string | null }[] = [];
  for (const m of meetings) {
    if (["cancelled", "completed"].includes(m.status as string)) continue;
    const leadId = m.lead_id as string;
    const escrow = escrowByLead.get(leadId);
    if (!escrow) {
      needsEscrowFunding.push({
        leadId,
        lawyerId: (m.lawyer_id as string | null) ?? null,
      });
    }
  }

  const needsEscrowConfirm = escrows
    .filter((e) => e.status === "held" && !e.client_confirmed)
    .map((e) => ({ leadId: e.lead_id as string }));

  const weekAgo = Date.now() - 7 * 86400000;
  const notesByLead = new Map<string, string>();
  for (const n of notesRes.data ?? []) {
    const lid = n.lead_id as string;
    if (!notesByLead.has(lid)) notesByLead.set(lid, n.created_at as string);
  }

  const mattersNeedingUpdate = leads
    .filter((l) =>
      ["engaged", "consulting"].includes(l.status as string)
    )
    .filter((l) => {
      const last = notesByLead.get(l.id as string);
      if (!last) return true;
      return new Date(last).getTime() < weekAgo;
    })
    .map((l) => ({ id: l.id as string }));

  const now = Date.now();
  const upcomingMeetings = meetings.filter((m) => {
    if (["cancelled", "completed"].includes(m.status as string)) return false;
    if (!m.scheduled_at) return true;
    return new Date(m.scheduled_at as string).getTime() >= now;
  }).length;

  const raw = buildClientNextActions({
    leads,
    pendingConsentLeadIds,
    bookable,
    needsEscrowFunding,
    needsEscrowConfirm,
    mattersNeedingUpdate,
    upcomingMeetings,
    leadIdFilter,
  });

  return apiOk(rankNextBestActions(raw));
}
