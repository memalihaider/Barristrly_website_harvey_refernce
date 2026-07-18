import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { canTransitionContract, CONTRACT_STATUSES } from "@/features/clm";
import { getAccessibleLead, recordLeadActivity } from "@/features/portal/access";
import { matterAccessError } from "@/features/portal/http";
import { writeAuditLog } from "@/features/crm/access";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  status: z
    .enum(["draft", "in_review", "executed", "expired", "terminated"])
    .optional(),
  title: z.string().min(1).max(300).optional(),
  counterparty: z.string().max(300).optional(),
  effectiveOn: z.string().nullable().optional(),
  expiresOn: z.string().nullable().optional(),
  documentId: z.string().uuid().nullable().optional(),
});

export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!isSupabaseConfigured()) return notConfigured("Contracts");

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("validation_error", "Invalid update", 400, parsed.error.flatten());
  }

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const supabase = await createClient();
  const { data: row, error: findErr } = await supabase
    .from("contracts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (findErr) return apiError("internal", findErr.message, 500);
  if (!row) return apiError("not_found", "Contract not found", 404);

  const access = await getAccessibleLead(
    supabase,
    row.lead_id as string,
    session.auth.id,
    session.profile.role
  );
  if (!access.ok) return matterAccessError(access);

  if (
    parsed.data.status &&
    !canTransitionContract(row.status as string, parsed.data.status)
  ) {
    return apiError(
      "conflict",
      `Cannot move contract from ${row.status} to ${parsed.data.status}`,
      409
    );
  }

  if (parsed.data.documentId) {
    const { data: doc } = await supabase
      .from("documents")
      .select("id, lead_id")
      .eq("id", parsed.data.documentId)
      .maybeSingle();
    if (!doc || doc.lead_id !== row.lead_id) {
      return apiError("validation_error", "documentId must belong to this matter", 400);
    }
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (parsed.data.status) updates.status = parsed.data.status;
  if (parsed.data.title) updates.title = parsed.data.title;
  if (parsed.data.counterparty !== undefined) {
    updates.counterparty = parsed.data.counterparty;
  }
  if (parsed.data.effectiveOn !== undefined) {
    updates.effective_on = parsed.data.effectiveOn;
  }
  if (parsed.data.expiresOn !== undefined) {
    updates.expires_on = parsed.data.expiresOn;
  }
  if (parsed.data.documentId !== undefined) {
    updates.document_id = parsed.data.documentId;
  }

  const { data, error } = await supabase
    .from("contracts")
    .update(updates)
    .eq("id", id)
    .select(
      "id, lead_id, title, status, counterparty, effective_on, expires_on, document_id, created_by, created_at, updated_at"
    )
    .single();

  if (error) return apiError("internal", error.message, 500);

  if (parsed.data.status) {
    await recordLeadActivity(
      supabase,
      row.lead_id as string,
      `Contract ${parsed.data.status}: ${row.title}`
    );
  }
  await writeAuditLog(supabase, {
    action: "contract.update",
    performedBy: session.auth.id,
    details: `Contract ${id}: ${JSON.stringify(parsed.data)}`,
  });

  return apiOk({ contract: data, statuses: CONTRACT_STATUSES });
}
