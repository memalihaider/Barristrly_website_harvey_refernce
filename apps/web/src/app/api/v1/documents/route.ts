import { NextRequest } from "next/server";
import { apiOk, apiCreated, apiError, notConfigured } from "@/lib/api/response";
import {
  ALLOWED_MIME_TYPES,
  DOCUMENT_CAPABILITIES,
  MAX_DOCUMENT_BYTES,
  MATTER_DOCUMENTS_BUCKET,
  buildStoragePath,
  inferDocType,
  isAllowedMimeType,
  sanitizeFileName,
} from "@/features/documents";
import { getAccessibleLead, recordLeadActivity } from "@/features/portal/access";
import { matterAccessError } from "@/features/portal/http";
import { writeAuditLog } from "@/features/crm/access";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("Documents");

  const leadId = req.nextUrl.searchParams.get("leadId");
  const includeArchived =
    req.nextUrl.searchParams.get("includeArchived") === "true";

  if (!leadId) {
    return apiOk({
      documents: [],
      capabilities: DOCUMENT_CAPABILITIES,
      allowedMimeTypes: ALLOWED_MIME_TYPES,
      maxBytes: MAX_DOCUMENT_BYTES,
      message: "Pass leadId to list matter documents",
    });
  }

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const supabase = await createClient();
  const access = await getAccessibleLead(
    supabase,
    leadId,
    session.auth.id,
    session.profile.role
  );
  if (!access.ok) return matterAccessError(access);

  let query = supabase
    .from("documents")
    .select(
      "id, lead_id, uploaded_by, title, doc_type, status, version, storage_path, mime_type, byte_size, created_at, updated_at"
    )
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (!includeArchived) {
    query = query.eq("status", "active");
  }

  const { data, error } = await query;
  if (error) return apiError("internal", error.message, 500);

  return apiOk({
    documents: data ?? [],
    capabilities: DOCUMENT_CAPABILITIES,
    allowedMimeTypes: ALLOWED_MIME_TYPES,
    maxBytes: MAX_DOCUMENT_BYTES,
  });
}

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("Documents");

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const form = await req.formData().catch(() => null);
  if (!form) return apiError("validation_error", "Expected multipart form", 400);

  const leadId = String(form.get("leadId") ?? "");
  const file = form.get("file");
  const titleOverride = form.get("title");

  if (!leadId || !(file instanceof File)) {
    return apiError("validation_error", "leadId and file are required", 400);
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
  const access = await getAccessibleLead(
    supabase,
    leadId,
    session.auth.id,
    session.profile.role
  );
  if (!access.ok) return matterAccessError(access);

  const documentId = crypto.randomUUID();
  const version = 1;
  const title =
    (typeof titleOverride === "string" && titleOverride.trim()) ||
    sanitizeFileName(file.name);
  const storagePath = buildStoragePath(leadId, documentId, version, file.name);
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error: uploadErr } = await supabase.storage
    .from(MATTER_DOCUMENTS_BUCKET)
    .upload(storagePath, bytes, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadErr) {
    return apiError("internal", uploadErr.message, 500);
  }

  const { data: doc, error: insertErr } = await supabase
    .from("documents")
    .insert({
      id: documentId,
      lead_id: leadId,
      uploaded_by: session.auth.id,
      title,
      doc_type: inferDocType(file.type, title),
      status: "active",
      version,
      storage_path: storagePath,
      mime_type: file.type,
      byte_size: file.size,
    })
    .select(
      "id, lead_id, uploaded_by, title, doc_type, status, version, storage_path, mime_type, byte_size, created_at, updated_at"
    )
    .single();

  if (insertErr) {
    await supabase.storage.from(MATTER_DOCUMENTS_BUCKET).remove([storagePath]);
    return apiError("internal", insertErr.message, 500);
  }

  await recordLeadActivity(supabase, leadId, `Document uploaded: ${title}`);
  await writeAuditLog(supabase, {
    action: "document.upload",
    performedBy: session.auth.id,
    details: `Document ${documentId} on lead ${leadId}`,
  });

  return apiCreated({ document: doc });
}
