import { getAdminAuth } from "@/lib/firebase/admin";
import type { AuthUser } from "@/lib/firebase/db";

export const SESSION_COOKIE = "__session";
/** Firebase allows session cookies of up to 14 days. */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

/** Verifies a session cookie value; returns null when missing or invalid. */
export async function verifySessionCookie(
  value: string | undefined | null
): Promise<AuthUser | null> {
  if (!value) return null;
  try {
    const decoded = await getAdminAuth().verifySessionCookie(value, true);
    return {
      id: decoded.uid,
      email: decoded.email ?? null,
      user_metadata: {
        full_name: (decoded.name as string | undefined) ?? undefined,
      },
    };
  } catch {
    return null;
  }
}
