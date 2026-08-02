import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";
import {
  activateSubscriptionRequest,
  createStripeCheckout,
  createSubscriptionRequest,
} from "@/lib/onboarding/service";
import { findPlan } from "@/lib/marketing/onboarding-plans";

const schema = z.object({
  role: z.enum(["client", "lawyer", "firm_admin"]),
  planId: z.string().min(1),
  paymentMethod: z.enum(["stripe", "paypal", "bank_transfer"]),
  profileSnapshot: z.record(z.string(), z.unknown()),
  organizationId: z.string().uuid().nullable().optional(),
});

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("Onboarding");

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "validation_error",
      "Invalid checkout payload",
      400,
      parsed.error.flatten()
    );
  }

  try {
    const session = await getSessionUser();
    if (!session) return apiError("unauthorized", "Sign in required", 401);
    if (session.profile.onboarding_completed) {
      return apiError("conflict", "Onboarding already completed", 409);
    }

    const plan = findPlan(parsed.data.planId);
    if (!plan) return apiError("validation_error", "Unknown plan", 400);

    if (session.profile.role !== parsed.data.role) {
      return apiError("validation_error", "Role mismatch", 400);
    }

    const { request } = await createSubscriptionRequest({
      userId: session.auth.id,
      role: parsed.data.role,
      planId: parsed.data.planId,
      paymentMethod: parsed.data.paymentMethod,
      profileSnapshot: parsed.data.profileSnapshot as never,
      organizationId:
        parsed.data.organizationId ?? session.profile.organization_id,
    });

    const origin = req.nextUrl.origin;

    if (parsed.data.paymentMethod === "stripe") {
      const checkout = await createStripeCheckout({
        requestId: request.id,
        plan,
        customerEmail: session.auth.email ?? "",
        successUrl: `${origin}/onboarding/complete`,
        cancelUrl: `${origin}/onboarding?step=checkout`,
      });

      if (checkout.mode === "stub") {
        const activated = await activateSubscriptionRequest(request.id, {
          stripeSessionId: checkout.sessionId,
        });
        return apiOk({
          status: "active",
          requestId: request.id,
          portal: activated.portal,
          checkoutUrl: null,
          message: "Staging Stripe stub — subscription activated.",
        });
      }

      return apiOk({
        status: "pending_payment",
        requestId: request.id,
        checkoutUrl: checkout.url,
        portal: null,
      });
    }

    // PayPal & bank transfer → pending Super Admin approval
    return apiOk({
      status: "pending_approval",
      requestId: request.id,
      checkoutUrl: null,
      portal: null,
      message:
        parsed.data.paymentMethod === "bank_transfer"
          ? "Bank transfer request submitted. Super Admin will confirm after invoice clearance."
          : "PayPal request submitted. Super Admin will confirm once payment is verified.",
    });
  } catch (err) {
    return apiError(
      "internal",
      err instanceof Error ? err.message : "Checkout failed",
      500
    );
  }
}
