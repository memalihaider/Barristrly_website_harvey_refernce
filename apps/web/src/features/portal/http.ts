import { apiError } from "@/lib/api/response";
import type { getAccessibleLead } from "@/features/portal/access";

type AccessDenied = Extract<
  Awaited<ReturnType<typeof getAccessibleLead>>,
  { ok: false }
>;

export function matterAccessError(access: AccessDenied) {
  const code =
    access.status === 404
      ? "not_found"
      : access.status === 403
        ? "forbidden"
        : "internal";
  return apiError(code, access.error, access.status);
}
