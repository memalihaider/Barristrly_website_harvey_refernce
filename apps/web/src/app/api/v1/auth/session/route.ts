import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiError, notConfigured } from "@/lib/api/response";
import { getAdminAuth } from "@/lib/firebase/admin";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  verifySessionCookie,
} from "@/lib/firebase/session";
import { isDbConfigured } from "@/lib/db/client";
import { ensurePublicUser } from "@/lib/auth/session";

const bodySchema = z.object({
  idToken: z.string().min(1),
  fullName: z.string().trim().max(120).optional(),
  onboardingPending: z.boolean().optional(),
});

/** Exchanges a Firebase ID token for an httpOnly session cookie. */
export async function POST(req: NextRequest) {
  if (!isDbConfigured()) return notConfigured("Auth");

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return apiError("validation_error", "Invalid session request", 400);
  }

  const auth = getAdminAuth();
  let decoded;
  try {
    decoded = await auth.verifyIdToken(parsed.data.idToken, true);
  } catch {
    return apiError("unauthorized", "Invalid or expired sign-in token", 401);
  }

  // Only mint cookies from a recent sign-in (Firebase recommendation).
  if (Date.now() / 1000 - decoded.auth_time > 5 * 60) {
    return apiError("unauthorized", "Recent sign-in required", 401);
  }

  const fullName = parsed.data.fullName || (decoded.name as string | undefined);
  if (parsed.data.fullName && parsed.data.fullName !== decoded.name) {
    await auth.updateUser(decoded.uid, { displayName: parsed.data.fullName });
  }

  let sessionCookie: string;
  try {
    sessionCookie = await auth.createSessionCookie(parsed.data.idToken, {
      expiresIn: SESSION_MAX_AGE_SECONDS * 1000,
    });
  } catch (err) {
    return apiError(
      "internal",
      err instanceof Error ? err.message : "Could not create session",
      500
    );
  }

  // ensurePublicUser's data client does not depend on the (not yet set)
  // cookie; pass the decoded user explicitly.
  let profile;
  try {
    profile = await ensurePublicUser({
      id: decoded.uid,
      email: decoded.email ?? null,
      user_metadata: {
        full_name: fullName,
        onboarding_pending: parsed.data.onboardingPending === true,
      },
    });
  } catch (err) {
    return apiError(
      "internal",
      err instanceof Error ? err.message : "Could not load profile",
      500
    );
  }

  const res = NextResponse.json({
    ok: true,
    data: {
      user: {
        id: decoded.uid,
        email: decoded.email ?? null,
        role: profile.role,
        onboardingCompleted: Boolean(profile.onboarding_completed),
      },
    },
  });
  res.cookies.set(SESSION_COOKIE, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}

/** Signs out: revokes refresh tokens and clears the session cookie. */
export async function DELETE(req: NextRequest) {
  const user = await verifySessionCookie(req.cookies.get(SESSION_COOKIE)?.value);
  if (user) {
    await getAdminAuth()
      .revokeRefreshTokens(user.id)
      .catch(() => undefined);
  }
  const res = NextResponse.json({ ok: true, data: { signedOut: true } });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
