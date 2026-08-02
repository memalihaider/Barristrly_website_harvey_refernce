import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { assignOnboardingRole, getSessionUser } from "@/lib/auth/session";

const schema = z.object({
  role: z.enum(["client", "lawyer", "firm_admin"]),
});

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("Onboarding");

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return apiError("validation_error", "Invalid role", 400, parsed.error.flatten());
  }

  try {
    const session = await getSessionUser();
    if (!session) return apiError("unauthorized", "Sign in required", 401);
    if (session.profile.onboarding_completed) {
      return apiError("conflict", "Onboarding already completed", 409);
    }

    const profile = await assignOnboardingRole(
      session.auth.id,
      parsed.data.role,
      session.profile.display_name ?? undefined
    );

    return apiOk({ role: profile.role, displayName: profile.display_name });
  } catch (err) {
    return apiError(
      "internal",
      err instanceof Error ? err.message : "Role assignment failed",
      500
    );
  }
}
