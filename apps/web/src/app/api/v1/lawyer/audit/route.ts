import { NextRequest } from "next/server";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(_req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("Audit");

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);
  if (session.profile.role !== "lawyer") {
    return apiError("forbidden", "Lawyer role required", 403);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("id, action, performed_by, details, created_at")
    .eq("performed_by", session.auth.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return apiError("internal", error.message, 500);
  return apiOk({ logs: data ?? [], count: data?.length ?? 0 });
}
