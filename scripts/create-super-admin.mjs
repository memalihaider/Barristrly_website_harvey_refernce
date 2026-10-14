#!/usr/bin/env node
/**
 * Create (or reset) a Super Admin (platform_admin) account.
 * Usage (from repo root):
 *   node scripts/create-super-admin.mjs <email> '<password>' ["Display Name"]
 *
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 * Credentials are taken from argv so they are never committed to the repo.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function loadEnv(file) {
  const env = {};
  if (!fs.existsSync(file)) return env;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    env[t.slice(0, i)] = t.slice(i + 1).replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = {
  ...loadEnv(path.join(ROOT, ".env.local")),
  ...loadEnv(path.join(ROOT, "apps/web/.env.local")),
};
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const [email, password, displayName = "Super Admin"] = process.argv.slice(2);

if (!email || !password) {
  console.error("Usage: node scripts/create-super-admin.mjs <email> '<password>' [name]");
  process.exit(1);
}
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(target) {
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const users = data.users ?? [];
    const hit = users.find((u) => u.email?.toLowerCase() === target.toLowerCase());
    if (hit || users.length < 200) return hit;
  }
}

async function main() {
  const metadata = { full_name: displayName, role: "platform_admin" };
  const existing = await findUserByEmail(email);

  const { data, error } = existing
    ? await admin.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
        user_metadata: metadata,
      })
    : await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: metadata,
      });
  if (error) throw error;
  const user = data.user;

  const { error: rowErr } = await admin.from("users").upsert(
    {
      id: user.id,
      email,
      role: "platform_admin",
      status: "active",
      display_name: displayName,
      onboarding_completed: true,
    },
    { onConflict: "id" }
  );
  if (rowErr) throw rowErr;

  console.log(`${existing ? "Updated" : "Created"} Super Admin ${email} (${user.id})`);
}

main().catch((err) => {
  console.error("Failed:", err.message ?? err);
  process.exit(1);
});
