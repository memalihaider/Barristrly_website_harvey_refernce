import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type AppRole = "client" | "lawyer" | "firm_admin" | "platform_admin" | "mediator";

/** Ensures a row exists in public.users for the authenticated Supabase user. */
export async function ensurePublicUser(
  authUser: User,
  role: AppRole = "client"
) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("users")
    .select("id, role, email, display_name")
    .eq("id", authUser.id)
    .maybeSingle();

  if (existing) return existing;

  const displayName =
    (authUser.user_metadata?.full_name as string | undefined) ||
    authUser.email?.split("@")[0] ||
    "User";

  const metaRole = authUser.user_metadata?.role as AppRole | undefined;
  const resolvedRole = metaRole || role;

  const { data, error } = await supabase
    .from("users")
    .insert({
      id: authUser.id,
      email: authUser.email,
      role: resolvedRole,
      status: "active",
      display_name: displayName,
    })
    .select("id, role, email, display_name")
    .single();

  if (error) throw error;

  if (resolvedRole === "client") {
    await supabase.from("client_profiles").upsert({
      id: authUser.id,
      preferred_language: "en",
      contact_preference: "platform",
    });
  }

  if (resolvedRole === "lawyer") {
    const initials = displayName
      .split(/\s+/)
      .map((p) => p[0])
      .join("")
      .slice(0, 3)
      .toUpperCase() || "LW";
    await supabase.from("lawyer_profiles").upsert({
      id: authUser.id,
      display_name: displayName,
      initials,
      practice_areas: [],
      jurisdictions: [],
      languages: ["en"],
      is_verified: false,
      is_public: false,
      subscription_tier: "free",
    });
    // lawyer_approvals.id FK → users.id
    await supabase.from("lawyer_approvals").upsert({
      id: authUser.id,
      email: authUser.email ?? `${authUser.id}@unknown`,
      display_name: displayName,
      status: "pending",
    });
  }

  return data;
}

export async function requireRole(roles: AppRole[]) {
  const session = await getSessionUser();
  if (!session) return null;
  if (!roles.includes(session.profile.role as AppRole)) return null;
  return session;
}

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = await ensurePublicUser(user);
  return { auth: user, profile };
}
