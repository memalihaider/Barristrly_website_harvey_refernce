import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";
import { activateSubscriptionRequest } from "@/lib/onboarding/service";
import { createClient } from "@/lib/supabase/server";
import { homeForRole } from "@/lib/auth/portal";

const schema = z.object({
  requestId: z.string().uuid().optional(),
  sessionId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("Onboarding");

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body ?? {});
  if (!parsed.success) {
    return apiError("validation_error", "Invalid complete payload", 400);
  }

  try {
    const session = await getSessionUser();
    if (!session) return apiError("unauthorized", "Sign in required", 401);

    const supabase = await createClient();
    let requestId = parsed.data.requestId;

    if (!requestId && parsed.data.sessionId) {
      const { data } = await supabase
        .from("subscription_requests")
        .select("id")
        .eq("user_id", session.auth.id)
        .eq("stripe_session_id", parsed.data.sessionId)
        .maybeSingle();
      requestId = data?.id;
    }

    if (!requestId) {
      const { data } = await supabase
        .from("subscription_requests")
        .select("id, status")
        .eq("user_id", session.auth.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      requestId = data?.id;
    }

    if (!requestId) {
      return apiError("not_found", "No subscription request found", 404);
    }

    const { data: owned } = await supabase
      .from("subscription_requests")
      .select("id, status, payment_method")
      .eq("id", requestId)
      .eq("user_id", session.auth.id)
      .maybeSingle();

    if (!owned) {
      return apiError("forbidden", "Request does not belong to this user", 403);
    }

    if (owned.status === "active") {
      return apiOk({
        completed: true,
        portal: homeForRole(session.profile.role),
        requestId,
      });
    }

    // Self-serve completion is Stripe-only; bank/PayPal need Super Admin
    if (owned.payment_method !== "stripe") {
      return apiError(
        "forbidden",
        "This payment method requires Super Admin confirmation",
        403
      );
    }

    const activated = await activateSubscriptionRequest(requestId, {
      stripeSessionId: parsed.data.sessionId,
    });

    return apiOk({
      completed: true,
      portal: activated.portal,
      requestId,
    });
  } catch (err) {
    return apiError(
      "internal",
      err instanceof Error ? err.message : "Complete failed",
      500
    );
  }
}
