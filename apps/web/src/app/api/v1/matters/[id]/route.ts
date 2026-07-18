import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { matterTitle, toMatterSummary } from "@/features/portal";
import {
  ensureMatterOpenedActivity,
  getAccessibleLead,
  getContactRevealed,
  getDisplayName,
  recordLeadActivity,
} from "@/features/portal/access";
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

  const lead = access.lead;
  await ensureMatterOpenedActivity(supabase, lead.id);

  const lawyerId = lead.assigned_lawyer_id;
  const revealed = await getContactRevealed(supabase, lead.id, lawyerId);
  const isLawyer = session.profile.role === "lawyer";
  const counterpartId = isLawyer ? lead.client_id : lawyerId;
  const counterpartName = counterpartId
    ? await getDisplayName(supabase, counterpartId)
    : null;

  const matter = toMatterSummary(lead, {
    viewerRole: session.profile.role,
    counterpartName: isLawyer ? counterpartName ?? "Client" : counterpartName,
    contactRevealed: revealed,
  });

  return apiOk({
    matter: {
      ...matter,
      description: revealed
        ? lead.description
        : lead.description.slice(0, 120) +
          (lead.description.length > 120 ? "…" : ""),
      fullTitle: matterTitle(lead),
      createdAt: lead.created_at,
    },
  });
}

const patchSchema = z.object({
  status: z.enum(["consulting", "engaged", "completed"]).optional(),
});

export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!isSupabaseConfigured()) return notConfigured("Matters");

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("validation_error", "Invalid payload", 400, parsed.error.flatten());
  }

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

  if (!parsed.data.status) {
    return apiError("validation_error", "Nothing to update", 400);
  }

  const { data, error } = await supabase
    .from("leads")
    .update({
      status: parsed.data.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(
      "id, client_id, assigned_lawyer_id, status, category, description, created_at, updated_at"
    )
    .single();

  if (error) return apiError("internal", error.message, 500);

  await recordLeadActivity(
    supabase,
    id,
    `Status changed to ${parsed.data.status}`
  );

  return apiOk({ matter: data });
}
