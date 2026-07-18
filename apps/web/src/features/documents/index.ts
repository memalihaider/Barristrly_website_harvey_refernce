/** Phase 4 — Thin Documents MVP (matter = lead) */

export const MATTER_DOCUMENTS_BUCKET = "matter-documents";

export const MAX_DOCUMENT_BYTES = 15 * 1024 * 1024; // 15MB

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "text/plain",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export const DOCUMENT_CAPABILITIES = [
  "upload",
  "version",
  "download",
  "archive",
] as const;

export interface DocumentVersionMeta {
  documentId: string;
  version: number;
  title: string;
}

export function nextDocumentVersion(current: number): number {
  return Math.max(1, current) + 1;
}

export function isAllowedMimeType(mime: string): mime is AllowedMimeType {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mime);
}

export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 180) || "file";
}

/** Path: {leadId}/{documentId}/v{version}_{filename} */
export function buildStoragePath(
  leadId: string,
  documentId: string,
  version: number,
  fileName: string
): string {
  return `${leadId}/${documentId}/v${version}_${sanitizeFileName(fileName)}`;
}

export function inferDocType(mime: string, title: string): string {
  if (mime === "application/pdf") return "pdf";
  if (mime.includes("wordprocessingml")) return "docx";
  if (mime.startsWith("image/")) return "image";
  if (mime === "text/plain") return "text";
  const ext = title.split(".").pop()?.toLowerCase();
  return ext || "other";
}
