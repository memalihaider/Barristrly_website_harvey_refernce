import { NextRequest } from "next/server";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { homeForRole } from "@/lib/auth/portal";

export async function GET(_req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("Onboarding");

  try {
    const session = await getSessionUser();
    if (!session) return apiError("unauthorized", "Sign in required", 401);

    const supabase = await createClient();
    const { data: pending } = await supabase
      .from("subscription_requests")
      .select("id, status, plan_id, payment_method, role, created_at")
      .eq("user_id", session.auth.id)
      .in("status", ["pending_payment", "pending_approval"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const completed = Boolean(session.profile.onboarding_completed);

    return apiOk({
      completed,
      role: session.profile.role,
      displayName: session.profile.display_name,
      email: session.auth.email,
      pendingRequest: pending,
      portal: completed ? homeForRole(session.profile.role) : null,
    });
  } catch (err) {
    return apiError(
      "internal",
      err instanceof Error ? err.message : "Status failed",
      500
    );
  }
}
