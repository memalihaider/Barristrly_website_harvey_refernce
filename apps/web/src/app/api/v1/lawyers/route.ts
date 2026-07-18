import { NextRequest } from "next/server";
import { apiOk } from "@/lib/api/response";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function GET(_req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return apiOk({
      lawyers: [],
      message: "Configure Supabase to load directory",
    });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lawyer_profiles")
    .select(
      "id, display_name, practice_areas, jurisdictions, rating, bio, subscription_tier, is_verified"
    )
    .eq("is_public", true)
    .order("rating", { ascending: false })
    .limit(50);

  if (error) {
    return apiOk({ lawyers: [], error: error.message });
  }

  return apiOk({
    lawyers: data ?? [],
    filters: ["practiceArea", "jurisdiction", "minRating"],
  });
}
