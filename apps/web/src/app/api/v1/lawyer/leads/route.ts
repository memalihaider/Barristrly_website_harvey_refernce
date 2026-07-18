import { NextRequest } from "next/server";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { maskDisplayName } from "@/features/marketplace/consent";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(_req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("Lawyer leads");

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const supabase = await createClient();
  const { data: matches, error } = await supabase
    .from("lawyer_matches")
    .select(
      "id, lead_id, lawyer_id, status, score, rank, is_primary, created_at, leads(id, description, category, status, client_id)"
    )
    .eq("lawyer_id", session.auth.id)
    .order("created_at", { ascending: false });

  if (error) return apiError("internal", error.message, 500);

  const leadIds = (matches ?? []).map((m) => m.lead_id as string);
  const consentMap = new Map<string, boolean>();
  if (leadIds.length > 0) {
    const { data: consents } = await supabase
      .from("dual_consent")
      .select("lead_id, contact_revealed, client_consented, lawyer_consented")
      .eq("lawyer_id", session.auth.id)
      .in("lead_id", leadIds);
    for (const c of consents ?? []) {
      consentMap.set(c.lead_id as string, Boolean(c.contact_revealed));
    }
  }

  const leads = (matches ?? []).map((m) => {
    const raw = m.leads as unknown;
    const lead = (Array.isArray(raw) ? raw[0] : raw) as {
      id: string;
      description: string;
      category: string;
      status: string;
      client_id: string;
    } | null;
    const revealed = consentMap.get(m.lead_id as string) ?? false;
    return {
      matchId: m.id,
      leadId: m.lead_id,
      status: m.status,
      score: m.score,
      rank: m.rank,
      isPrimary: m.is_primary,
      category: lead?.category ?? null,
      leadStatus: lead?.status ?? null,
      description: revealed
        ? lead?.description ?? ""
        : anonymizeDescription(lead?.description),
      clientLabel: maskDisplayName("Client", revealed),
      contactRevealed: revealed,
    };
  });

  return apiOk({ leads });
}

function anonymizeDescription(text: string | null | undefined): string {
  if (!text) return "Anonymous matter (details after consent)";
  const trimmed = text.trim();
  if (trimmed.length <= 80) return trimmed;
  return `${trimmed.slice(0, 80)}…`;
}
