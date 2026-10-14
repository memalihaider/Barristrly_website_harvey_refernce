import { type NextRequest, NextResponse } from "next/server";
import {
  homeForRole,
  portalPrefix,
  roleAllowedForPortal,
} from "@/lib/auth/portal";
import { createDb } from "@/lib/firebase/db";
import { SESSION_COOKIE, verifySessionCookie } from "@/lib/firebase/session";

function redirectTo(request: NextRequest, pathname: string, next?: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  if (next) url.searchParams.set("next", next);
  return NextResponse.redirect(url);
}

/** Guards portal and onboarding routes by Firebase session and role. */
export async function guardRequest(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const passThrough = NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return passThrough;
  }

  const isOnboarding =
    pathname === "/onboarding" || pathname.startsWith("/onboarding/");
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/register/");
  const portal = portalPrefix(pathname);

  // Public marketing pages need no session lookup.
  if (!portal && !isOnboarding) return passThrough;

  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const user = await verifySessionCookie(cookie);

  if (!user) {
    const res = redirectTo(
      request,
      "/login",
      `${pathname}${portal ? request.nextUrl.search : ""}`
    );
    if (cookie) res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  }

  if (isAuthPage) return passThrough;

  const { data: profile } = await createDb()
    .from("users")
    .select("role, onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  const completed = Boolean(profile?.onboarding_completed);
  const role = (profile?.role as string | undefined) ?? "client";

  if (!completed && !isOnboarding) {
    return redirectTo(request, "/onboarding/welcome");
  }
  if (completed && isOnboarding) {
    return redirectTo(request, homeForRole(role));
  }
  if (portal && !roleAllowedForPortal(role, portal)) {
    return redirectTo(request, homeForRole(role));
  }

  return passThrough;
}
