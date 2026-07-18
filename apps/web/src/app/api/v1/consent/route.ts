import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError } from "@/lib/api/response";
import {
  boolToConsentStatus,
  isIdentityRevealed,
} from "@/features/marketplace/consent";
import { recordLeadActivity } from "@/features/portal/access";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";
import { notConfigured } from "@/lib/api/response";

const schema = z.object({
  leadId: z.string().uuid(),
  lawyerId: z.string().uuid(),
  as: z.enum(["client", "lawyer"]).optional(),
});

export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("Consent");

  const leadId = req.nextUrl.searchParams.get("leadId");
  const lawyerId = req.nextUrl.searchParams.get("lawyerId");
  if (!leadId || !lawyerId) {
    return apiError("validation_error", "leadId and lawyerId required", 400);
  }

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dual_consent")
    .select("*")
    .eq("lead_id", leadId)
    .eq("lawyer_id", lawyerId)
    .maybeSingle();

  if (error) return apiError("internal", error.message, 500);

  const state = {
    clientStatus: boolToConsentStatus(data?.client_consented),
    lawyerStatus: boolToConsentStatus(data?.lawyer_consented),
  };

  return apiOk({
    consent: data,
    state,
    contactRevealed: data?.contact_revealed ?? isIdentityRevealed(state),
  });
}

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("Consent");

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return apiError("validation_error", "Invalid consent payload", 400, parsed.error.flatten());
  }

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const supabase = await createClient();
  const { data: lead, error: leadErr } = await supabase
    .from("leads")
    .select("id, client_id")
    .eq("id", parsed.data.leadId)
    .maybeSingle();

  if (leadErr) return apiError("internal", leadErr.message, 500);
  if (!lead) return apiError("not_found", "Lead not found", 404);

  const role = session.profile.role;
  const as =
    parsed.data.as ??
    (role === "lawyer" ? "lawyer" : "client");

  if (as === "client" && lead.client_id !== session.auth.id) {
    return apiError("forbidden", "Only the lead client can grant client consent", 403);
  }
  if (as === "lawyer" && parsed.data.lawyerId !== session.auth.id) {
    return apiError("forbidden", "Only the matched lawyer can grant lawyer consent", 403);
  }

  const { data: existing } = await supabase
    .from("dual_consent")
    .select("*")
    .eq("lead_id", parsed.data.leadId)
    .eq("lawyer_id", parsed.data.lawyerId)
    .maybeSingle();

  const now = new Date().toISOString();
  const clientConsented =
    as === "client" ? true : Boolean(existing?.client_consented);
  const lawyerConsented =
    as === "lawyer" ? true : Boolean(existing?.lawyer_consented);
  const contactRevealed = clientConsented && lawyerConsented;

  const payload = {
    lead_id: parsed.data.leadId,
    client_id: lead.client_id as string,
    lawyer_id: parsed.data.lawyerId,
    client_consented: clientConsented,
    lawyer_consented: lawyerConsented,
    contact_revealed: contactRevealed,
    client_consented_at:
      as === "client" ? now : existing?.client_consented_at ?? null,
    lawyer_consented_at:
      as === "lawyer" ? now : existing?.lawyer_consented_at ?? null,
  };

  let row;
  if (existing?.id) {
    const { data, error } = await supabase
      .from("dual_consent")
      .update(payload)
      .eq("id", existing.id)
      .select("*")
      .single();
    if (error) return apiError("internal", error.message, 500);
    row = data;
  } else {
    const { data, error } = await supabase
      .from("dual_consent")
      .insert(payload)
      .select("*")
      .single();
    if (error) return apiError("internal", error.message, 500);
    row = data;
  }

  const state = {
    clientStatus: boolToConsentStatus(row.client_consented),
    lawyerStatus: boolToConsentStatus(row.lawyer_consented),
  };

  await recordLeadActivity(
    supabase,
    parsed.data.leadId,
    contactRevealed
      ? "Dual consent complete — contact revealed"
      : `${as} granted consent`
  );

  if (contactRevealed) {
    await supabase
      .from("leads")
      .update({
        status: "engaged",
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.leadId)
      .in("status", ["consulting", "matched", "open", "screening"]);
  }

  return apiOk({
    consent: row,
    state,
    contactRevealed: row.contact_revealed,
  });
}
