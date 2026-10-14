import type { AuthUser } from "@/lib/firebase/db";
import { createClient } from "@/lib/db/server";

export type AppRole =
  | "client"
  | "lawyer"
  | "firm_admin"
  | "platform_admin"
  | "mediator";

/**
 * Role model (see doc/AUTH_SCHEMA.md):
 * - client = Customer who needs a lawyer
 * - lawyer = Provider who needs clients via the platform
 * - mediator = AI Bot (BARRI / BARRI VOICE)
 * - firm_admin = Admin — business owner / agency with many lawyers
 * - platform_admin = Super Admin — owner of the SaaS app
 */

export type PublicUser = {
  id: string;
  role: string;
  email: string | null;
  display_name: string | null;
  onboarding_completed?: boolean | null;
  organization_id?: string | null;
};

async function provisionRoleProfiles(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  email: string | null | undefined,
  displayName: string,
  role: AppRole
) {
  if (role === "client") {
    await supabase.from("client_profiles").upsert({
      id: userId,
      preferred_language: "en",
      contact_preference: "platform",
      full_name: displayName,
    });
  }

  if (role === "lawyer") {
    const initials =
      displayName
        .split(/\s+/)
        .map((p) => p[0])
        .join("")
        .slice(0, 3)
        .toUpperCase() || "LW";
    await supabase.from("lawyer_profiles").upsert({
      id: userId,
      display_name: displayName,
      initials,
      practice_areas: [],
      jurisdictions: [],
      languages: ["en"],
      is_verified: false,
      is_public: false,
      subscription_tier: "free",
    });
    await supabase.from("lawyer_approvals").upsert({
      id: userId,
      email: email ?? `${userId}@unknown`,
      display_name: displayName,
      status: "pending",
    });
  }
}

/**
 * Emails that are always Super Admin (platform_admin). Extend with the
 * SUPER_ADMIN_EMAILS env var (comma separated).
 */
const BOOTSTRAP_SUPER_ADMINS = ["heena@barristrly.com"];

export function isBootstrapSuperAdmin(email: string | null | undefined) {
  if (!email) return false;
  const list = [
    ...BOOTSTRAP_SUPER_ADMINS,
    ...(process.env.SUPER_ADMIN_EMAILS ?? "").split(","),
  ]
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

const USER_COLUMNS =
  "id, role, email, display_name, onboarding_completed, organization_id";

/** Ensures a `users` row exists for the authenticated Firebase user. */
export async function ensurePublicUser(
  authUser: AuthUser,
  role: AppRole = "client"
): Promise<PublicUser> {
  const supabase = await createClient();
  const superAdmin = isBootstrapSuperAdmin(authUser.email);

  const { data: existing } = await supabase
    .from("users")
    .select(USER_COLUMNS)
    .eq("id", authUser.id)
    .maybeSingle();

  if (existing) {
    if (
      superAdmin &&
      (existing.role !== "platform_admin" || !existing.onboarding_completed)
    ) {
      const { data: promoted } = await supabase
        .from("users")
        .update({ role: "platform_admin", onboarding_completed: true })
        .eq("id", authUser.id)
        .select(USER_COLUMNS)
        .single();
      if (promoted) return promoted as PublicUser;
    }
    return existing as PublicUser;
  }

  const displayName =
    (authUser.user_metadata?.full_name as string | undefined) ||
    authUser.email?.split("@")[0] ||
    "User";

  const onboardingPending =
    !superAdmin && authUser.user_metadata?.onboarding_pending === true;
  const metaRole = authUser.user_metadata?.role as AppRole | undefined;
  // Provisional client role when onboarding has not chosen a role yet
  const resolvedRole: AppRole = superAdmin
    ? "platform_admin"
    : onboardingPending
      ? "client"
      : metaRole || role;

  const insertAttempt = await supabase
    .from("users")
    .insert({
      id: authUser.id,
      email: authUser.email,
      role: resolvedRole,
      status: "active",
      display_name: displayName,
      onboarding_completed: superAdmin,
    })
    .select(USER_COLUMNS)
    .single();

  if (insertAttempt.error || !insertAttempt.data) {
    // A concurrent request may have created the row first.
    const { data: raced } = await supabase
      .from("users")
      .select(USER_COLUMNS)
      .eq("id", authUser.id)
      .maybeSingle();
    if (raced) return raced as PublicUser;
    throw insertAttempt.error ?? new Error("Failed to create user");
  }

  // Defer profile side-effects until onboarding role is chosen
  if (!onboardingPending) {
    await provisionRoleProfiles(
      supabase,
      authUser.id,
      authUser.email,
      displayName,
      resolvedRole
    );
  }

  return insertAttempt.data as PublicUser;
}

export async function assignOnboardingRole(
  userId: string,
  role: "client" | "lawyer" | "firm_admin",
  displayName?: string
) {
  const supabase = await createClient();
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("id, role, email, display_name, onboarding_completed")
    .eq("id", userId)
    .single();

  if (fetchError || !user) throw fetchError ?? new Error("User not found");
  if (user.onboarding_completed) {
    throw new Error("Onboarding already completed");
  }

  const name = displayName?.trim() || user.display_name || "User";

  const { data, error } = await supabase
    .from("users")
    .update({ role, display_name: name })
    .eq("id", userId)
    .select("id, role, email, display_name, onboarding_completed, organization_id")
    .single();

  if (error) throw error;

  // Clean provisional client profile if switching away
  if (role !== "client") {
    await supabase.from("client_profiles").delete().eq("id", userId);
  }

  await provisionRoleProfiles(supabase, userId, user.email, name, role);
  return data as PublicUser;
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
