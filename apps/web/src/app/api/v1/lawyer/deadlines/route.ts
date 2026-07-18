import { NextRequest } from "next/server";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { sortDeadlinesByDue, toDeadlineAlert, daysUntil } from "@/features/litigation";
import { listLawyerLeadRows } from "@/features/crm/access";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(_req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("Deadlines");

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);
  if (session.profile.role !== "lawyer") {
    return apiError("forbidden", "Lawyer role required", 403);
  }

  const supabase = await createClient();
  const leads = await listLawyerLeadRows(supabase, session.auth.id);
  const leadIds = leads.map((l) => l.id as string);
  if (leadIds.length === 0) {
    return apiOk({ deadlines: [], alerts: [], upcomingCount: 0 });
  }

  const { data, error } = await supabase
    .from("matter_deadlines")
    .select(
      "id, lead_id, title, due_at, status, kind, created_by, created_at, updated_at"
    )
    .in("lead_id", leadIds)
    .eq("status", "open")
    .order("due_at", { ascending: true })
    .limit(100);

  if (error) return apiError("internal", error.message, 500);

  const rows = sortDeadlinesByDue(data ?? []);
  const leadById = new Map(leads.map((l) => [l.id as string, l]));

  const deadlines = rows.map((d) => ({
    ...d,
    daysRemaining: daysUntil(new Date(d.due_at as string)),
    category: leadById.get(d.lead_id as string)?.category ?? null,
  }));

  const upcomingCount = deadlines.filter((d) => d.daysRemaining <= 14).length;

  return apiOk({
    deadlines,
    alerts: deadlines.map((d) => toDeadlineAlert(d)),
    upcomingCount,
  });
}
