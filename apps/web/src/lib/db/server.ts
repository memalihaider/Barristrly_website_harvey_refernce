import { cookies } from "next/headers";
import { createDb } from "@/lib/firebase/db";
import { SESSION_COOKIE, verifySessionCookie } from "@/lib/firebase/session";

/**
 * Request-scoped data client: `auth.getUser()` resolves the signed-in user
 * from the session cookie. Data access runs with server (Admin) privileges,
 * so routes must keep doing their own role/ownership checks.
 */
export async function createClient() {
  const cookieStore = await cookies();
  return createDb(() =>
    verifySessionCookie(cookieStore.get(SESSION_COOKIE)?.value)
  );
}
