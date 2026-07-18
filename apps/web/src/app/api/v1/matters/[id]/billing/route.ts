import { NextRequest } from "next/server";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { getAccessibleLead } from "@/features/portal/access";
import { matterAccessError } from "@/features/portal/http";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  if (!isSupabaseConfigured()) return notConfigured("Matters");

  const { id } = await ctx.params;
  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const supabase = await createClient();
  const access = await getAccessibleLead(
    supabase,
    id,
    session.auth.id,
    session.profile.role
  );
  if (!access.ok) return matterAccessError(access);

  const { data: payments, error: payErr } = await supabase
    .from("payments")
    .select(
      "id, user_id, lead_id, type, amount, currency, status, description, stripe_session_id, created_at"
    )
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  if (payErr) return apiError("internal", payErr.message, 500);

  const { data: escrows, error: escErr } = await supabase
    .from("escrow_accounts")
    .select(
      "id, client_id, lawyer_id, lead_id, payment_id, amount, currency, client_confirmed, lawyer_confirmed, status, released_at, created_at"
    )
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  if (escErr) return apiError("internal", escErr.message, 500);

  return apiOk({
    payments: payments ?? [],
    escrows: escrows ?? [],
    canConfirmRelease: true,
  });
}
