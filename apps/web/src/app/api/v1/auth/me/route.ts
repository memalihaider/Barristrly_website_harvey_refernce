import { NextRequest } from "next/server";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(_req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return notConfigured("Auth");
  }

  try {
    const session = await getSessionUser();
    return apiOk({
      user: session
        ? {
            id: session.auth.id,
            email: session.auth.email,
            role: session.profile.role,
            displayName: (session.profile as { display_name?: string }).display_name ?? null,
          }
        : null,
    });
  } catch (err) {
    return apiError(
      "internal",
      err instanceof Error ? err.message : "Auth lookup failed",
      500
    );
  }
}
