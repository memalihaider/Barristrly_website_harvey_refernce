import { NextRequest } from "next/server";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import {
  ALLOWED_MIME_TYPES,
  MAX_DOCUMENT_BYTES,
  MATTER_DOCUMENTS_BUCKET,
  buildStoragePath,
  inferDocType,
  isAllowedMimeType,
  nextDocumentVersion,
  sanitizeFileName,
} from "@/features/documents";
import { getAccessibleLead, recordLeadActivity } from "@/features/portal/access";
import { matterAccessError } from "@/features/portal/http";
import { writeAuditLog } from "@/features/crm/access";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  if (!isSupabaseConfigured()) return notConfigured("Documents");

  const { id } = await ctx.params;
  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const form = await req.formData().catch(() => null);
  if (!form) return apiError("validation_error", "Expected multipart form", 400);

  const file = form.get("file");
  if (!(file instanceof File)) {
    return apiError("validation_error", "file is required", 400);
  }
  if (!isAllowedMimeType(file.type)) {
    return apiError(
      "validation_error",
      `Unsupported type. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`,
      400
    );
  }
  if (file.size > MAX_DOCUMENT_BYTES) {
    return apiError("validation_error", "File exceeds 15MB limit", 400);
  }

  const supabase = await createClient();
  const { data: doc, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return apiError("internal", error.message, 500);
  if (!doc) return apiError("not_found", "Document not found", 404);
  if (doc.status === "archived") {
    return apiError("conflict", "Cannot version an archived document", 409);
  }

  const access = await getAccessibleLead(
    supabase,
    doc.lead_id as string,
    session.auth.id,
    session.profile.role
  );
  if (!access.ok) return matterAccessError(access);

  const version = nextDocumentVersion(Number(doc.version));
  const title =
    (typeof form.get("title") === "string" &&
      String(form.get("title")).trim()) ||
    (doc.title as string) ||
    sanitizeFileName(file.name);
  const storagePath = buildStoragePath(
    doc.lead_id as string,
    id,
    version,
    file.name
  );
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error: uploadErr } = await supabase.storage
    .from(MATTER_DOCUMENTS_BUCKET)
    .upload(storagePath, bytes, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadErr) return apiError("internal", uploadErr.message, 500);

  const oldPath = doc.storage_path as string;

  const { data: updated, error: updErr } = await supabase
    .from("documents")
    .update({
      title,
      version,
      storage_path: storagePath,
      mime_type: file.type,
      byte_size: file.size,
      doc_type: inferDocType(file.type, title),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(
      "id, lead_id, uploaded_by, title, doc_type, status, version, storage_path, mime_type, byte_size, created_at, updated_at"
    )
    .single();

  if (updErr) {
    await supabase.storage.from(MATTER_DOCUMENTS_BUCKET).remove([storagePath]);
    return apiError("internal", updErr.message, 500);
  }

  if (oldPath && oldPath !== storagePath) {
    await supabase.storage.from(MATTER_DOCUMENTS_BUCKET).remove([oldPath]);
  }

  await recordLeadActivity(
    supabase,
    doc.lead_id as string,
    `Document versioned to v${version}: ${title}`
  );
  await writeAuditLog(supabase, {
    action: "document.version",
    performedBy: session.auth.id,
    details: `Document ${id} → v${version}`,
  });

  return apiOk({ document: updated });
}
