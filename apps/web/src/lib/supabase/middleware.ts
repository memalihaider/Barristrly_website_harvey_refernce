import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import {
  homeForRole,
  portalPrefix,
  roleAllowedForPortal,
} from "@/lib/auth/portal";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Refreshes the Auth session cookies and guards portal routes by role.
 * Returns the NextResponse that must be returned from middleware.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const pathname = request.nextUrl.pathname;

  if (pathname === "/api/v1/health") {
    return supabaseResponse;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOnboarding =
    pathname === "/onboarding" || pathname.startsWith("/onboarding/");
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/register/");
  const isApi = pathname.startsWith("/api/");

  if (user && !isApi && !isAuthPage) {
    const { data: profile } = await supabase
      .from("users")
      .select("role, onboarding_completed")
      .eq("id", user.id)
      .maybeSingle();

    const completed = Boolean(profile?.onboarding_completed);
    const role = (profile?.role as string | undefined) ?? "client";

    if (!completed && !isOnboarding) {
      const welcome = request.nextUrl.clone();
      welcome.pathname = "/onboarding/welcome";
      welcome.search = "";
      return NextResponse.redirect(welcome);
    }

    if (completed && isOnboarding) {
      const dest = request.nextUrl.clone();
      dest.pathname = homeForRole(role);
      dest.search = "";
      return NextResponse.redirect(dest);
    }

    const portal = portalPrefix(pathname);
    if (portal) {
      if (!completed) {
        const welcome = request.nextUrl.clone();
        welcome.pathname = "/onboarding/welcome";
        welcome.search = "";
        return NextResponse.redirect(welcome);
      }
      if (!roleAllowedForPortal(role, portal)) {
        const dest = request.nextUrl.clone();
        dest.pathname = homeForRole(role);
        dest.search = "";
        return NextResponse.redirect(dest);
      }
    }

    return supabaseResponse;
  }

  const portal = portalPrefix(pathname);
  if (portal) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set(
        "next",
        `${pathname}${request.nextUrl.search}`
      );
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isOnboarding && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}
