import { NextRequest } from "next/server";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { MATTER_DOCUMENTS_BUCKET } from "@/features/documents";
import { getAccessibleLead, recordLeadActivity } from "@/features/portal/access";
import { matterAccessError } from "@/features/portal/http";
import { writeAuditLog } from "@/features/crm/access";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  if (!isSupabaseConfigured()) return notConfigured("Documents");

  const { id } = await ctx.params;
  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const supabase = await createClient();
  const { data: doc, error } = await supabase
    .from("documents")
    .select(
      "id, lead_id, uploaded_by, title, doc_type, status, version, storage_path, mime_type, byte_size, created_at, updated_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) return apiError("internal", error.message, 500);
  if (!doc) return apiError("not_found", "Document not found", 404);

  const access = await getAccessibleLead(
    supabase,
    doc.lead_id as string,
    session.auth.id,
    session.profile.role
  );
  if (!access.ok) return matterAccessError(access);

  const { data: signed, error: signErr } = await supabase.storage
    .from(MATTER_DOCUMENTS_BUCKET)
    .createSignedUrl(doc.storage_path as string, 60 * 10);

  if (signErr) return apiError("internal", signErr.message, 500);

  return apiOk({
    document: doc,
    downloadUrl: signed?.signedUrl ?? null,
  });
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  if (!isSupabaseConfigured()) return notConfigured("Documents");

  const { id } = await ctx.params;
  const hard = req.nextUrl.searchParams.get("hard") === "true";

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const supabase = await createClient();
  const { data: doc, error } = await supabase
    .from("documents")
    .select("id, lead_id, title, storage_path, status")
    .eq("id", id)
    .maybeSingle();

  if (error) return apiError("internal", error.message, 500);
  if (!doc) return apiError("not_found", "Document not found", 404);

  const access = await getAccessibleLead(
    supabase,
    doc.lead_id as string,
    session.auth.id,
    session.profile.role
  );
  if (!access.ok) return matterAccessError(access);

  if (hard) {
    await supabase.storage
      .from(MATTER_DOCUMENTS_BUCKET)
      .remove([doc.storage_path as string]);
    const { error: delErr } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);
    if (delErr) return apiError("internal", delErr.message, 500);
    await recordLeadActivity(
      supabase,
      doc.lead_id as string,
      `Document deleted: ${doc.title}`
    );
  } else {
    const { error: updErr } = await supabase
      .from("documents")
      .update({
        status: "archived",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (updErr) return apiError("internal", updErr.message, 500);
    await recordLeadActivity(
      supabase,
      doc.lead_id as string,
      `Document archived: ${doc.title}`
    );
  }

  await writeAuditLog(supabase, {
    action: hard ? "document.delete" : "document.archive",
    performedBy: session.auth.id,
    details: `Document ${id} on lead ${doc.lead_id}`,
  });

  return apiOk({ archived: !hard, deleted: hard, id });
}
