import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError } from "@/lib/api/response";
import { rankLawyerMatches } from "@/features/marketplace/matching";
import { maskDisplayName } from "@/features/marketplace/consent";
import { PRACTICE_AREAS, JURISDICTIONS } from "@/lib/ontology";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";
import { trackEvent } from "@/features/analytics";
import { buildOutcomeStatsMap } from "@/features/intelligence";

const schema = z.object({
  leadId: z.string().uuid().optional(),
  practiceArea: z.enum(PRACTICE_AREAS).optional(),
  jurisdiction: z.enum(JURISDICTIONS).optional(),
  opponentName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body ?? {});
  if (!parsed.success) {
    return apiError(
      "validation_error",
      "Invalid match payload",
      400,
      parsed.error.flatten()
    );
  }

  let practiceArea = parsed.data.practiceArea;
  let clientId: string | null = null;
  let leadCategory: string | null = null;

  type LawyerRow = {
    id: string;
    display_name: string | null;
    practice_areas: string[] | null;
    jurisdictions: string[] | null;
    rating: number | null;
    is_verified: boolean | null;
    is_public: boolean | null;
  };

  let lawyers: LawyerRow[] = [];
  let fromDatabase = false;
  let outcomeMap = buildOutcomeStatsMap([], []);

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const session = await getSessionUser();

    if (parsed.data.leadId) {
      const { data: lead, error: leadErr } = await supabase
        .from("leads")
        .select("id, client_id, category, status")
        .eq("id", parsed.data.leadId)
        .maybeSingle();
      if (leadErr) return apiError("internal", leadErr.message, 500);
      if (!lead) return apiError("not_found", "Lead not found", 404);
      if (session && lead.client_id !== session.auth.id) {
        return apiError("forbidden", "Not your lead", 403);
      }
      clientId = lead.client_id as string;
      leadCategory = lead.category as string;
      if (!practiceArea && lead.category) {
        const cat = lead.category as string;
        if ((PRACTICE_AREAS as readonly string[]).includes(cat)) {
          practiceArea = cat as (typeof PRACTICE_AREAS)[number];
        }
      }
    }

    const { data: rows } = await supabase
      .from("lawyer_profiles")
      .select(
        "id, display_name, practice_areas, jurisdictions, rating, is_verified, is_public"
      )
      .eq("is_public", true)
      .eq("is_verified", true)
      .limit(50);

    lawyers = (rows as LawyerRow[] | null) ?? [];
    fromDatabase = lawyers.length > 0;

    if (fromDatabase && lawyers.length > 0) {
      const ids = lawyers.map((l) => l.id);
      const [matchRows, meetingRows] = await Promise.all([
        supabase
          .from("lawyer_matches")
          .select("lawyer_id, status")
          .in("lawyer_id", ids),
        supabase
          .from("meetings")
          .select("lawyer_id, status")
          .in("lawyer_id", ids),
      ]);
      outcomeMap = buildOutcomeStatsMap(
        (matchRows.data ?? []) as { lawyer_id: string; status: string }[],
        (meetingRows.data ?? []) as { lawyer_id: string; status: string }[]
      );
    }
  }

  let candidates = lawyers.map((l) => ({
    id: l.id,
    practiceAreas: l.practice_areas ?? [],
    jurisdictions: l.jurisdictions ?? [],
    rating: Number(l.rating ?? 0),
    isAcceptingLeads: true,
    displayName: l.display_name,
    outcomeFit: outcomeMap.get(l.id)?.outcomeFit ?? 0.5,
  }));

  if (candidates.length === 0) {
    candidates = [
      {
        id: "00000000-0000-4000-8000-000000000001",
        practiceAreas: ["commercial", "corporate"],
        jurisdictions: ["AE-DU", "AE-DIFC"],
        rating: 4.8,
        isAcceptingLeads: true,
        displayName: "Demo Counsel A",
        outcomeFit: 0.5,
      },
      {
        id: "00000000-0000-4000-8000-000000000002",
        practiceAreas: ["employment", "litigation"],
        jurisdictions: ["AE-AZ", "AE-ADGM"],
        rating: 4.5,
        isAcceptingLeads: true,
        displayName: "Demo Counsel B",
        outcomeFit: 0.5,
      },
    ];
  }

  const ranked = rankLawyerMatches({
    practiceArea,
    jurisdiction: parsed.data.jurisdiction,
    candidates,
  });

  const consentByLawyer = new Map<string, boolean>();

  if (isSupabaseConfigured() && parsed.data.leadId && fromDatabase) {
    const supabase = await createClient();
    const session = await getSessionUser();
    const resolvedClientId = clientId ?? session?.auth.id;

    if (resolvedClientId) {
      await supabase.from("coi_screens").insert({
        client_id: resolvedClientId,
        opponent_name: parsed.data.opponentName?.trim() || "(none)",
        status: "cleared",
      });
    }

    // No unique (lead_id, lawyer_id) — replace suggested set for this lead
    await supabase
      .from("lawyer_matches")
      .delete()
      .eq("lead_id", parsed.data.leadId);

    const top = ranked.slice(0, 5);
    const rows = top.map((m) => ({
      lead_id: parsed.data.leadId,
      lawyer_id: m.lawyerId,
      score: m.score,
      confidence: m.score,
      rank: m.rank,
      is_primary: m.rank === 1,
      status: "suggested" as const,
    }));

    if (rows.length > 0) {
      const { error: matchErr } = await supabase
        .from("lawyer_matches")
        .insert(rows);
      if (matchErr) return apiError("internal", matchErr.message, 500);
    }

    await supabase
      .from("leads")
      .update({ status: "matched" })
      .eq("id", parsed.data.leadId);

    const { data: consents } = await supabase
      .from("dual_consent")
      .select("lawyer_id, contact_revealed")
      .eq("lead_id", parsed.data.leadId);
    for (const c of consents ?? []) {
      consentByLawyer.set(c.lawyer_id as string, Boolean(c.contact_revealed));
    }
  }

  const nameById = new Map(
    candidates.map((c) => [c.id, c.displayName ?? null])
  );

  const matches = ranked.map((m) => {
    const revealed = consentByLawyer.get(m.lawyerId) ?? false;
    return {
      ...m,
      displayName: maskDisplayName(nameById.get(m.lawyerId), revealed),
      contactRevealed: revealed,
      practiceAreas: candidates.find((c) => c.id === m.lawyerId)?.practiceAreas ?? [],
      rating: candidates.find((c) => c.id === m.lawyerId)?.rating ?? 0,
    };
  });

  void trackEvent(
    "matches.ranked",
    {
      leadId: parsed.data.leadId ?? null,
      practiceArea: practiceArea ?? leadCategory,
      matchCount: matches.length,
      source: fromDatabase ? "database" : "demo",
    },
    clientId
  );

  return apiOk({
    matches,
    leadId: parsed.data.leadId ?? null,
    practiceArea: practiceArea ?? leadCategory,
    coiRequired: true,
    source: fromDatabase ? "database" : "demo",
  });
}
