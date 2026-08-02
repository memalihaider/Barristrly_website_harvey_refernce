import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import {
  findPlan,
  type OnboardingPlan,
  type OnboardingRole,
} from "@/lib/marketing/onboarding-plans";
import { homeForRole } from "@/lib/auth/portal";
import type { PublicUser } from "@/lib/auth/session";

async function db(client?: SupabaseClient) {
  return client ?? (await createClient());
}

export type PaymentMethod = "stripe" | "paypal" | "bank_transfer";

export type AgencyDetails = {
  companyName: string;
  businessEmail: string;
  phone: string;
  vatId: string;
  employeeCount: number;
  location: string;
};

export type SoloDetails = {
  fullName: string;
  phone: string;
  email: string;
  lawyerId: string;
};

export type CustomerDetails = {
  fullName: string;
  idNumber: string;
};

export type ProfileDetails = AgencyDetails | SoloDetails | CustomerDetails;

function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || `org-${Date.now()}`
  );
}

export async function saveOnboardingDetails(
  user: PublicUser,
  role: OnboardingRole,
  details: ProfileDetails
) {
  const supabase = await createClient();
  let organizationId: string | null = user.organization_id ?? null;

  if (role === "firm_admin") {
    const d = details as AgencyDetails;
    const payload = {
      name: d.companyName,
      slug: slugify(d.companyName),
      type: "law_firm" as const,
      vat_id: d.vatId,
      business_email: d.businessEmail,
      phone: d.phone,
      employee_count: d.employeeCount,
      location: d.location,
      metadata: { onboarding: true },
    };

    if (organizationId) {
      await supabase.from("organizations").update(payload).eq("id", organizationId);
    } else {
      const { data: org, error } = await supabase
        .from("organizations")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      organizationId = org.id;
      await supabase
        .from("users")
        .update({ organization_id: organizationId })
        .eq("id", user.id);
    }
  }

  if (role === "lawyer") {
    const d = details as SoloDetails;
    await supabase
      .from("users")
      .update({ display_name: d.fullName })
      .eq("id", user.id);
    await supabase.from("lawyer_profiles").upsert({
      id: user.id,
      display_name: d.fullName,
      phone: d.phone,
      lawyer_license_id: d.lawyerId,
      practice_areas: [],
      jurisdictions: [],
      languages: ["en"],
      is_verified: false,
      is_public: false,
      subscription_tier: "free",
      initials: d.fullName
        .split(/\s+/)
        .map((p) => p[0])
        .join("")
        .slice(0, 3)
        .toUpperCase(),
    });
  }

  if (role === "client") {
    const d = details as CustomerDetails;
    await supabase
      .from("users")
      .update({ display_name: d.fullName })
      .eq("id", user.id);
    await supabase.from("client_profiles").upsert({
      id: user.id,
      preferred_language: "en",
      contact_preference: "platform",
      full_name: d.fullName,
      id_number: d.idNumber,
    });
  }

  return { organizationId };
}

export async function createSubscriptionRequest(input: {
  userId: string;
  role: OnboardingRole;
  planId: string;
  paymentMethod: PaymentMethod;
  profileSnapshot: ProfileDetails;
  organizationId?: string | null;
}) {
  const plan = findPlan(input.planId);
  if (!plan) throw new Error("Unknown plan");

  const supabase = await createClient();
  const status =
    input.paymentMethod === "stripe" ? "pending_payment" : "pending_approval";

  const { data, error } = await supabase
    .from("subscription_requests")
    .insert({
      user_id: input.userId,
      role: input.role,
      plan_id: plan.id,
      plan_snapshot: plan,
      profile_snapshot: input.profileSnapshot,
      payment_method: input.paymentMethod,
      status,
      organization_id: input.organizationId ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return { request: data, plan };
}

export async function activateSubscriptionRequest(
  requestId: string,
  opts?: {
    stripeSessionId?: string;
    reviewedBy?: string;
    adminNotes?: string;
    client?: SupabaseClient;
  }
) {
  const supabase = await db(opts?.client);
  const { data: request, error } = await supabase
    .from("subscription_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (error || !request) throw error ?? new Error("Request not found");

  const { error: updErr } = await supabase
    .from("subscription_requests")
    .update({
      status: "active",
      stripe_session_id: opts?.stripeSessionId ?? request.stripe_session_id,
      reviewed_by: opts?.reviewedBy ?? null,
      reviewed_at: opts?.reviewedBy ? new Date().toISOString() : null,
      admin_notes: opts?.adminNotes ?? request.admin_notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (updErr) throw updErr;

  await supabase
    .from("users")
    .update({
      onboarding_completed: true,
      role: request.role,
    })
    .eq("id", request.user_id);

  if (request.role === "lawyer") {
    const plan = request.plan_snapshot as OnboardingPlan;
    await supabase
      .from("lawyer_profiles")
      .update({ subscription_tier: plan?.id ?? request.plan_id })
      .eq("id", request.user_id);
  }

  return {
    portal: homeForRole(request.role),
    requestId,
  };
}

export async function rejectSubscriptionRequest(
  requestId: string,
  reviewedBy: string,
  adminNotes?: string,
  client?: SupabaseClient
) {
  const supabase = await db(client);
  const { error } = await supabase
    .from("subscription_requests")
    .update({
      status: "rejected",
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString(),
      admin_notes: adminNotes ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) throw error;
}

/** Stripe Checkout Session or staging stub. */
export async function createStripeCheckout(input: {
  requestId: string;
  plan: OnboardingPlan;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    // Staging stub — caller activates immediately
    return {
      mode: "stub" as const,
      sessionId: `cs_staging_${input.requestId}`,
      url: null as string | null,
    };
  }

  // Lightweight Checkout Session via Stripe REST (no SDK dependency)
  const amountMatch = input.plan.price.replace(/[^\d]/g, "");
  const amountAed = Number(amountMatch) || 0;
  const unitAmount = Math.max(amountAed, 1) * 100;

  const params = new URLSearchParams();
  params.set("mode", input.plan.kind === "meeting" ? "payment" : "payment");
  params.set("success_url", `${input.successUrl}?session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", input.cancelUrl);
  params.set("customer_email", input.customerEmail);
  params.set("client_reference_id", input.requestId);
  params.set("line_items[0][price_data][currency]", "aed");
  params.set("line_items[0][price_data][product_data][name]", input.plan.name);
  params.set(
    "line_items[0][price_data][product_data][description]",
    input.plan.detail
  );
  params.set("line_items[0][price_data][unit_amount]", String(unitAmount));
  params.set("line_items[0][quantity]", "1");
  params.set("metadata[subscription_request_id]", input.requestId);

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const json = (await res.json()) as { id?: string; url?: string; error?: { message: string } };
  if (!res.ok || !json.id || !json.url) {
    throw new Error(json.error?.message ?? "Stripe Checkout failed");
  }

  const supabase = await createClient();
  await supabase
    .from("subscription_requests")
    .update({
      stripe_session_id: json.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.requestId);

  return { mode: "live" as const, sessionId: json.id, url: json.url };
}
