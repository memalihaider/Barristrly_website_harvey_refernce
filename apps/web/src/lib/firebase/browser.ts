"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, inMemoryPersistence, setPersistence } from "firebase/auth";
import { firebaseConfig } from "@/lib/firebase/config";

export function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

/** Starts Analytics in the browser when supported (no-op elsewhere). */
export async function initAnalytics() {
  const { getAnalytics, isSupported } = await import("firebase/analytics");
  if (await isSupported()) getAnalytics(getFirebaseApp());
}

/**
 * Client auth. The server session lives in an httpOnly cookie, so the
 * browser keeps no Firebase session of its own.
 */
export async function getClientAuth() {
  const auth = getAuth(getFirebaseApp());
  await setPersistence(auth, inMemoryPersistence);
  return auth;
}

/** Exchanges a fresh ID token for the server session cookie. */
export async function createServerSession(
  idToken: string,
  extra?: { fullName?: string; onboardingPending?: boolean }
) {
  const res = await fetch("/api/v1/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, ...extra }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.ok) {
    throw new Error(json?.error?.message ?? "Could not start session");
  }
  return json.data.user as {
    role: string;
    onboardingCompleted: boolean;
  };
}

/** Maps Firebase Auth error codes to readable messages. */
export function authErrorMessage(err: unknown, fallback: string) {
  const code = (err as { code?: string })?.code ?? "";
  const map: Record<string, string> = {
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/user-not-found": "Incorrect email or password.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/email-already-in-use":
      "An account with this email already exists. Please log in.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/too-many-requests":
      "Too many attempts. Please wait a moment and try again.",
    "auth/network-request-failed":
      "Cannot reach the authentication server. Check your connection.",
    "auth/operation-not-allowed":
      "Email sign-in is not enabled for this project yet.",
  };
  if (map[code]) return map[code];
  return err instanceof Error && err.message ? err.message : fallback;
}
