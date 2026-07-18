import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { initialsFromName } from "@/features/crm";
import { writeAuditLog } from "@/features/crm/access";
import { PRACTICE_AREAS, JURISDICTIONS } from "@/lib/ontology";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(_req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("Lawyer profile");

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);
  if (session.profile.role !== "lawyer") {
    return apiError("forbidden", "Lawyer role required", 403);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lawyer_profiles")
    .select(
      "id, display_name, initials, practice_areas, jurisdictions, languages, experience_years, rating, bio, hourly_range_min, hourly_range_max, is_verified, is_public, subscription_tier"
    )
    .eq("id", session.auth.id)
    .maybeSingle();

  if (error) return apiError("internal", error.message, 500);
  if (!data) return apiError("not_found", "Lawyer profile missing", 404);

  return apiOk({
    profile: data,
    options: {
      practiceAreas: PRACTICE_AREAS,
      jurisdictions: JURISDICTIONS,
    },
  });
}

const patchSchema = z.object({
  display_name: z.string().min(1).max(120).optional(),
  bio: z.string().max(5000).optional(),
  practice_areas: z.array(z.string()).optional(),
  jurisdictions: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  experience_years: z.number().int().min(0).max(70).optional(),
  hourly_range_min: z.number().int().min(0).optional(),
  hourly_range_max: z.number().int().min(0).optional(),
});

export async function PATCH(req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("Lawyer profile");

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("validation_error", "Invalid profile", 400, parsed.error.flatten());
  }

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);
  if (session.profile.role !== "lawyer") {
    return apiError("forbidden", "Lawyer role required", 403);
  }

  const updates: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.display_name) {
    updates.initials = initialsFromName(parsed.data.display_name);
  }
  if (
    parsed.data.hourly_range_min != null &&
    parsed.data.hourly_range_max != null &&
    parsed.data.hourly_range_max < parsed.data.hourly_range_min
  ) {
    return apiError("validation_error", "hourly_range_max must be >= min", 400);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lawyer_profiles")
    .update(updates)
    .eq("id", session.auth.id)
    .select(
      "id, display_name, initials, practice_areas, jurisdictions, languages, experience_years, rating, bio, hourly_range_min, hourly_range_max, is_verified, is_public, subscription_tier"
    )
    .single();

  if (error) return apiError("internal", error.message, 500);

  await writeAuditLog(supabase, {
    action: "lawyer.profile_update",
    performedBy: session.auth.id,
    details: `Updated fields: ${Object.keys(parsed.data).join(", ")}`,
  });

  return apiOk({ profile: data });
}
