import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiCreated, apiError, notConfigured } from "@/lib/api/response";
import { CONTRACT_STATUSES } from "@/features/clm";
import { getAccessibleLead, recordLeadActivity } from "@/features/portal/access";
import { matterAccessError } from "@/features/portal/http";
import { writeAuditLog } from "@/features/crm/access";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  if (!isSupabaseConfigured()) return notConfigured("Contracts");

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

  const { data, error } = await supabase
    .from("contracts")
    .select(
      "id, lead_id, title, status, counterparty, effective_on, expires_on, document_id, created_by, created_at, updated_at"
    )
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  if (error) return apiError("internal", error.message, 500);
  return apiOk({ contracts: data ?? [], statuses: CONTRACT_STATUSES });
}

const postSchema = z.object({
  title: z.string().min(1).max(300),
  counterparty: z.string().max(300).default(""),
  effectiveOn: z.string().optional(),
  expiresOn: z.string().optional(),
  documentId: z.string().uuid().optional(),
});

export async function POST(req: NextRequest, ctx: Ctx) {
  if (!isSupabaseConfigured()) return notConfigured("Contracts");

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("validation_error", "Invalid contract", 400, parsed.error.flatten());
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

  if (parsed.data.documentId) {
    const { data: doc } = await supabase
      .from("documents")
      .select("id, lead_id")
      .eq("id", parsed.data.documentId)
      .maybeSingle();
    if (!doc || doc.lead_id !== id) {
      return apiError("validation_error", "documentId must belong to this matter", 400);
    }
  }

  const { data, error } = await supabase
    .from("contracts")
    .insert({
      lead_id: id,
      title: parsed.data.title,
      counterparty: parsed.data.counterparty,
      effective_on: parsed.data.effectiveOn || null,
      expires_on: parsed.data.expiresOn || null,
      document_id: parsed.data.documentId || null,
      status: "draft",
      created_by: session.auth.id,
    })
    .select(
      "id, lead_id, title, status, counterparty, effective_on, expires_on, document_id, created_by, created_at, updated_at"
    )
    .single();

  if (error) return apiError("internal", error.message, 500);

  await recordLeadActivity(supabase, id, `Contract created: ${parsed.data.title}`);
  await writeAuditLog(supabase, {
    action: "contract.create",
    performedBy: session.auth.id,
    details: `Contract ${data.id} on lead ${id}`,
  });

  return apiCreated({ contract: data });
}
