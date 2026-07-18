import { createClient } from "@supabase/supabase-js";

function getPublishableKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = getPublishableKey();
  return { url, anon };
}

/** Legacy browser client — prefer `@/lib/supabase/browser` for SSR apps. */
export function createBrowserSupabase() {
  const { url, anon } = getSupabaseEnv();
  if (!url || !anon) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    );
  }
  return createClient(url, anon);
}

/** Service-role / non-cookie server client for trusted API routes. */
export function createServerSupabase(options?: { serviceRole?: boolean }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = options?.serviceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : getPublishableKey();
  if (!url || !key) {
    throw new Error("Missing Supabase environment variables");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isSupabaseConfigured() {
  const { url, anon } = getSupabaseEnv();
  return Boolean(url && anon);
}
