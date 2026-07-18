import { NextRequest } from "next/server";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { getSessionUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { listLawyerLeadRows } from "@/features/crm/access";
import { buildLawyerInsights, toLawyerNextBestActions } from "@/features/intelligence";

export async function GET(_req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("Lawyer insights");

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);
  if (session.profile.role !== "lawyer") {
    return apiError("forbidden", "Lawyer role required", 403);
  }

  const supabase = await createClient();
  const lawyerId = session.auth.id;
  const leads = await listLawyerLeadRows(supabase, lawyerId);
  const leadIds = leads.map((l) => l.id as string);

  const [matchesRes, meetingsRes, escrowRes, deadlinesRes] = await Promise.all([
    supabase
      .from("lawyer_matches")
      .select("id, status, created_at")
      .eq("lawyer_id", lawyerId),
    supabase
      .from("meetings")
      .select("id, status")
      .eq("lawyer_id", lawyerId),
    supabase
      .from("escrow_accounts")
      .select("id", { count: "exact", head: true })
      .eq("lawyer_id", lawyerId)
      .eq("status", "held"),
    leadIds.length > 0
      ? supabase
          .from("matter_deadlines")
          .select("id, lead_id, status")
          .in("lead_id", leadIds)
          .eq("status", "open")
      : Promise.resolve({ data: [] as { id: string; lead_id: string; status: string }[] }),
  ]);

  const openDeadlines = (deadlinesRes.data ?? []).length;

  const weekAgo = Date.now() - 7 * 86400000;
  const stalePipelineLeads = leads.filter((l) => {
    const status = l.status as string;
    if (["completed", "closed", "rejected"].includes(status)) return false;
    const updated = new Date(
      (l.updated_at as string) || (l.created_at as string)
    ).getTime();
    return updated < weekAgo;
  }).length;

  const insights = buildLawyerInsights({
    matches: matchesRes.data ?? [],
    meetings: meetingsRes.data ?? [],
    escrowsHeld: escrowRes.count ?? 0,
    openDeadlines,
    stalePipelineLeads,
  });

  const nba = toLawyerNextBestActions(insights);
  return apiOk({ insights, ...nba });
}
