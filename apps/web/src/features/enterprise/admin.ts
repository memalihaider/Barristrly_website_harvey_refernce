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

export const SUPER_ADMIN_ROLES: AppRole[] = ["platform_admin", "mediator"];

/** Like requireAdminService, but only for Super Admin roles. */
export async function requireSuperAdminService(): Promise<AdminOk | AdminErr> {
  const gate = await requireAdminService();
  if (!gate.ok) return gate;
  if (!SUPER_ADMIN_ROLES.includes(gate.session.profile.role as AppRole)) {
    return {
      ok: false,
      response: apiError("forbidden", "Super Admin required", 403),
    };
  }
  return gate;
}

/** Display name for audit trails ("Heena", falls back to email). */
export function actorName(session: AdminOk["session"]): string {
  return (
    session.profile.display_name ||
    session.profile.email ||
    session.auth.email ||
    "Admin"
  );
}
