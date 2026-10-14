import type { DbClient } from "@/lib/firebase/db";
import { apiError, notConfigured } from "@/lib/api/response";
import { requireRole, type AppRole } from "@/lib/auth/session";
import {
  createServiceClient,
  isDbConfigured,
} from "@/lib/db/client";

export const ADMIN_ROLES: AppRole[] = [
  "platform_admin",
  "mediator",
  "firm_admin",
];

type AdminOk = {
  ok: true;
  session: NonNullable<Awaited<ReturnType<typeof requireRole>>>;
  admin: DbClient;
};

type AdminErr = { ok: false; response: Response };

/** Admin session + service-role client. Strict role — no staging fallback. */
export async function requireAdminService(): Promise<AdminOk | AdminErr> {
  if (!isDbConfigured()) {
    return { ok: false, response: notConfigured("Admin") };
  }

  const session = await requireRole(ADMIN_ROLES);
  if (!session) {
    const { getSessionUser } = await import("@/lib/auth/session");
    const any = await getSessionUser();
    if (!any) {
      return {
        ok: false,
        response: apiError("unauthorized", "Sign in required", 401),
      };
    }
    return {
      ok: false,
      response: apiError("forbidden", "Admin role required", 403),
    };
  }

  if (!isDbConfigured()) {
    return {
      ok: false,
      response: apiError(
        "not_configured",
        "FIREBASE_SERVICE_ACCOUNT_KEY required for admin console",
        503
      ),
    };
  }

  return {
    ok: true,
    session,
    admin: createServiceClient(),
  };
}
