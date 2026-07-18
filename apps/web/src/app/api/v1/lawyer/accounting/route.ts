import { NextRequest } from "next/server";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { listLawyerLeadRows } from "@/features/crm/access";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(_req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("Accounting");

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);
  if (session.profile.role !== "lawyer") {
    return apiError("forbidden", "Lawyer role required", 403);
  }

  const supabase = await createClient();
  const leads = await listLawyerLeadRows(supabase, session.auth.id);
  const leadIds = leads.map((l) => l.id as string);

  let entries: unknown[] = [];
  if (leadIds.length > 0) {
    const { data, error } = await supabase
      .from("accounting_entries")
      .select(
        "id, amount, currency, type, description, payment_id, lead_id, user_id, created_at"
      )
      .in("lead_id", leadIds)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) return apiError("internal", error.message, 500);
    entries = data ?? [];
  }

  // Also include entries attributed to this lawyer as user_id
  const { data: own } = await supabase
    .from("accounting_entries")
    .select(
      "id, amount, currency, type, description, payment_id, lead_id, user_id, created_at"
    )
    .eq("user_id", session.auth.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const byId = new Map<string, unknown>();
  for (const e of [...entries, ...(own ?? [])]) {
    byId.set((e as { id: string }).id, e);
  }

  return apiOk({
    entries: Array.from(byId.values()),
    count: byId.size,
  });
}
