import { NextRequest } from "next/server";
import { z } from "zod";
import { apiCreated, apiError, apiOk, notConfigured } from "@/lib/api/response";
import { canReleaseEscrow, createCheckoutStub } from "@/features/payments/escrow";
import { recordLeadActivity } from "@/features/portal/access";
import { writeAuditLog } from "@/features/crm/access";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";
import { trackEvent } from "@/features/analytics";

const createSchema = z.object({
  leadId: z.string().uuid(),
  lawyerId: z.string().uuid(),
  amount: z.number().positive().default(500),
  currency: z.string().default("usd"),
  description: z.string().optional(),
});

const releaseSchema = z.object({
  action: z.literal("release"),
  escrowId: z.string().uuid().optional(),
  paymentId: z.string().uuid(),
  clientConfirmed: z.boolean().optional(),
  lawyerConfirmed: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("Payments");

  const body = await req.json().catch(() => null);
  if (body?.action === "release") {
    return releaseEscrow(body);
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("validation_error", "Invalid payment payload", 400, parsed.error.flatten());
  }

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const supabase = await createClient();
  const { data: lead } = await supabase
    .from("leads")
    .select("id, client_id")
    .eq("id", parsed.data.leadId)
    .maybeSingle();

  if (!lead) return apiError("not_found", "Lead not found", 404);
  if (lead.client_id !== session.auth.id) {
    return apiError("forbidden", "Not your lead", 403);
  }

  // Live payments.status: pending | succeeded | failed (held lives on escrow_accounts)
  const paymentStatus = process.env.STRIPE_SECRET_KEY ? "pending" : "pending";
  const checkout = createCheckoutStub(Math.round(parsed.data.amount * 100), parsed.data.currency);

  let stripeSessionId: string | null = null;
  if (process.env.STRIPE_SECRET_KEY) {
    // Stripe Checkout wired when key present — session id placeholder until SDK call
    stripeSessionId = `cs_staging_${crypto.randomUUID().slice(0, 8)}`;
  }

  const { data: payment, error: payErr } = await supabase
    .from("payments")
    .insert({
      user_id: session.auth.id,
      lead_id: parsed.data.leadId,
      type: "consultation",
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      status: paymentStatus,
      stripe_session_id: stripeSessionId,
      description:
        parsed.data.description ??
        `Consultation escrow for lead ${parsed.data.leadId.slice(0, 8)}`,
    })
    .select("*")
    .single();

  if (payErr) return apiError("internal", payErr.message, 500);

  const { data: escrow, error: escErr } = await supabase
    .from("escrow_accounts")
    .insert({
      client_id: session.auth.id,
      lawyer_id: parsed.data.lawyerId,
      lead_id: parsed.data.leadId,
      payment_id: payment.id,
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      status: "held",
      client_confirmed: false,
      lawyer_confirmed: false,
    })
    .select("*")
    .single();

  if (escErr) return apiError("internal", escErr.message, 500);

  // Staging demo without Stripe: mark payment succeeded while funds stay in escrow held
  if (!process.env.STRIPE_SECRET_KEY) {
    await supabase
      .from("payments")
      .update({ status: "succeeded" })
      .eq("id", payment.id);
  }

  await recordLeadActivity(
    supabase,
    parsed.data.leadId,
    `Escrow payment created (${parsed.data.amount} ${parsed.data.currency})`
  );

  void trackEvent(
    "payment.escrow_created",
    {
      paymentId: payment.id,
      leadId: parsed.data.leadId,
      amount: parsed.data.amount,
      currency: parsed.data.currency,
    },
    session.auth.id
  );

  return apiCreated({
    payment: { ...payment, status: process.env.STRIPE_SECRET_KEY ? paymentStatus : "succeeded" },
    escrow,
    checkout,
  });
}

async function releaseEscrow(body: unknown) {
  const parsed = releaseSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("validation_error", "Invalid escrow release payload", 400, parsed.error.flatten());
  }

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const supabase = await createClient();
  let query = supabase.from("escrow_accounts").select("*");
  if (parsed.data.escrowId) {
    query = query.eq("id", parsed.data.escrowId);
  } else {
    query = query.eq("payment_id", parsed.data.paymentId);
  }

  const { data: escrow, error } = await query.maybeSingle();
  if (error) return apiError("internal", error.message, 500);
  if (!escrow) return apiError("not_found", "Escrow not found", 404);

  const isClient = escrow.client_id === session.auth.id;
  const isLawyer = escrow.lawyer_id === session.auth.id;
  if (!isClient && !isLawyer) {
    return apiError("forbidden", "Not a party to this escrow", 403);
  }

  const clientConfirmed = isClient
    ? (parsed.data.clientConfirmed ?? true)
    : Boolean(escrow.client_confirmed);
  const lawyerConfirmed = isLawyer
    ? (parsed.data.lawyerConfirmed ?? true)
    : Boolean(escrow.lawyer_confirmed);

  const releasable = canReleaseEscrow({
    paymentId: escrow.payment_id ?? parsed.data.paymentId,
    clientConfirmed,
    lawyerConfirmed,
    status: (escrow.status as "held" | "released" | "pending") ?? "held",
  });

  const updates: Record<string, unknown> = {
    client_confirmed: clientConfirmed,
    lawyer_confirmed: lawyerConfirmed,
    updated_at: new Date().toISOString(),
  };

  if (releasable) {
    updates.status = "released";
    updates.released_at = new Date().toISOString();
  }

  const { data: updated, error: updErr } = await supabase
    .from("escrow_accounts")
    .update(updates)
    .eq("id", escrow.id)
    .select("*")
    .single();

  if (updErr) return apiError("internal", updErr.message, 500);

  if (escrow.lead_id) {
    await recordLeadActivity(
      supabase,
      escrow.lead_id as string,
      releasable
        ? "Escrow released"
        : "Escrow confirmation recorded — awaiting counterparty"
    );
  }

  if (releasable) {
    await supabase.from("accounting_entries").insert({
      amount: escrow.amount,
      currency: escrow.currency ?? "usd",
      type: "escrow_release",
      description: `Escrow released for lead ${String(escrow.lead_id).slice(0, 8)}`,
      payment_id: escrow.payment_id,
      lead_id: escrow.lead_id,
      user_id: escrow.lawyer_id,
    });
    await writeAuditLog(supabase, {
      action: "escrow.released",
      performedBy: session.auth.id,
      details: `Escrow ${escrow.id} released · payment ${escrow.payment_id}`,
    });
  }

  return apiOk({
    escrow: updated,
    releasable,
    next: releasable ? "capture_and_transfer" : "awaiting_dual_confirmation",
  });
}
