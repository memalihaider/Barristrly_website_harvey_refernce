import type { AppRole } from "@/lib/auth/session";

export const ADMIN_PORTAL_ROLES: AppRole[] = [
  "platform_admin",
  "mediator",
  "firm_admin",
];

/** Safe same-origin relative path for post-login redirect. */
export function isSafeNextPath(path: string | null | undefined): path is string {
  if (!path || typeof path !== "string") return false;
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.includes("://")) return false;
  if (path.startsWith("/login") || path.startsWith("/register")) return false;
  return true;
}

export function homeForRole(role: string | null | undefined): string {
  switch (role) {
    case "lawyer":
      return "/lawyer";
    case "platform_admin":
    case "mediator":
    case "firm_admin":
      return "/admin";
    case "client":
    default:
      return "/client";
  }
}

export function portalPrefix(pathname: string): "client" | "lawyer" | "admin" | null {
  if (pathname === "/client" || pathname.startsWith("/client/")) return "client";
  if (pathname === "/lawyer" || pathname.startsWith("/lawyer/")) return "lawyer";
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return "admin";
  return null;
}

export function roleAllowedForPortal(
  role: string | null | undefined,
  portal: "client" | "lawyer" | "admin"
): boolean {
  if (!role) return false;
  if (portal === "client") return role === "client";
  if (portal === "lawyer") return role === "lawyer";
  return ADMIN_PORTAL_ROLES.includes(role as AppRole);
}

/** Prefer safe next when role can access that portal; else role home. */
export function resolvePostAuthRedirect(
  role: string | null | undefined,
  next: string | null | undefined
): string {
  const home = homeForRole(role);
  if (!isSafeNextPath(next)) return home;
  const portal = portalPrefix(next);
  if (!portal) return next.startsWith("/api") ? home : next;
  if (roleAllowedForPortal(role, portal)) return next;
  return home;
}
