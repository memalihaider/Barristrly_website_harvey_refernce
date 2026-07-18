#!/usr/bin/env node
/**
 * Seed test Auth users + public.users / profiles for all app roles.
 * Usage (from repo root):
 *   npm run seed:test-users
 *
 * Requires apps/web/.env.local with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const envPath = path.join(ROOT, "apps/web/.env.local");
const outPath = path.join(ROOT, "apps/web/.test-accounts.local.md");

function loadEnv(file) {
  const env = {};
  if (!fs.existsSync(file)) return env;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    env[t.slice(0, i)] = t.slice(i + 1);
  }
  return env;
}

const env = { ...loadEnv(path.join(ROOT, ".env.local")), ...loadEnv(envPath) };
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const PASSWORD = "TestBarristrly2026!";

const ACCOUNTS = [
  {
    email: "admin@barristrly.test",
    role: "platform_admin",
    displayName: "Test Super Admin",
  },
  {
    email: "mediator@barristrly.test",
    role: "mediator",
    displayName: "Test Mediator",
  },
  {
    email: "firmadmin@barristrly.test",
    role: "firm_admin",
    displayName: "Test Firm Admin",
  },
  {
    email: "lawyer@barristrly.test",
    role: "lawyer",
    displayName: "Test Lawyer",
    lawyer: true,
  },
  {
    email: "lawyer2@barristrly.test",
    role: "lawyer",
    displayName: "Test Lawyer Two",
    lawyer: true,
  },
  {
    email: "client@barristrly.test",
    role: "client",
    displayName: "Test Client",
  },
];

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email) {
  const { data, error } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  if (error) throw error;
  return (data.users ?? []).find(
    (u) => u.email?.toLowerCase() === email.toLowerCase()
  );
}

async function upsertAuthUser(account) {
  const existing = await findUserByEmail(account.email);
  if (existing) {
    const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
      password: PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: account.displayName,
        role: account.role,
      },
    });
    if (error) throw error;
    return data.user;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email: account.email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: {
      full_name: account.displayName,
      role: account.role,
    },
  });
  if (error) throw error;
  return data.user;
}

async function upsertPublicRows(user, account) {
  const { error: userErr } = await admin.from("users").upsert(
    {
      id: user.id,
      email: account.email,
      role: account.role,
      status: "active",
      display_name: account.displayName,
    },
    { onConflict: "id" }
  );
  if (userErr) throw userErr;

  if (account.role === "client") {
    const { error } = await admin.from("client_profiles").upsert({
      id: user.id,
      preferred_language: "en",
      contact_preference: "platform",
    });
    if (error) throw error;
  }

  if (account.lawyer) {
    const initials =
      account.displayName
        .split(/\s+/)
        .map((p) => p[0])
        .join("")
        .slice(0, 3)
        .toUpperCase() || "LW";

    const { error: lpErr } = await admin.from("lawyer_profiles").upsert({
      id: user.id,
      display_name: account.displayName,
      initials,
      practice_areas: ["commercial", "corporate", "employment"],
      jurisdictions: ["AE-DU", "AE-DIFC", "AE-ADGM"],
      languages: ["en"],
      is_verified: true,
      is_public: true,
      subscription_tier: "free",
      rating: 4.7,
    });
    if (lpErr) throw lpErr;

    const { error: apErr } = await admin.from("lawyer_approvals").upsert({
      id: user.id,
      email: account.email,
      display_name: account.displayName,
      status: "approved",
    });
    if (apErr) throw apErr;
  }

  if (account.role === "mediator") {
    const { error } = await admin.from("mediator_profiles").upsert({
      id: user.id,
      display_name: account.displayName,
    });
    if (error) {
      console.warn("  (mediator_profiles skip:", error.message + ")");
    }
  }
}

async function main() {
  console.log("Seeding test users against", url);
  const rows = [];

  for (const account of ACCOUNTS) {
    process.stdout.write(`  ${account.email} (${account.role})… `);
    const user = await upsertAuthUser(account);
    await upsertPublicRows(user, account);
    console.log("ok");
    rows.push({
      role: account.role,
      email: account.email,
      password: PASSWORD,
      displayName: account.displayName,
      id: user.id,
      portal:
        account.role === "lawyer"
          ? "/lawyer"
          : account.role === "client"
            ? "/client"
            : "/admin",
    });
  }

  const md = [
    "# Test accounts (local)",
    "",
    "Generated by `npm run seed:test-users`. Do not commit.",
    "",
    `Shared password: \`${PASSWORD}\``,
    "",
    "| Role | Email | Portal |",
    "| --- | --- | --- |",
    ...rows.map((r) => `| ${r.role} | \`${r.email}\` | ${r.portal} |`),
    "",
    "## Notes",
    "",
    "- Lawyers are **verified + public** (match pool ready).",
    "- Login at `/login`.",
    "- Super admin = `platform_admin` → `/admin`.",
    "",
  ].join("\n");

  fs.writeFileSync(outPath, md);
  console.log("\nWrote", outPath);
  console.log("\nCredentials (password for all):", PASSWORD);
  for (const r of rows) {
    console.log(`  ${r.role.padEnd(16)} ${r.email}  → ${r.portal}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
