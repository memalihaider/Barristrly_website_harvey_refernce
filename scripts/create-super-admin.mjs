#!/usr/bin/env node
/**
 * Create (or reset) a Super Admin (platform_admin) account in Firebase.
 * Usage (from repo root):
 *   node scripts/create-super-admin.mjs <email> '<password>' ["Display Name"]
 *
 * Requires FIREBASE_SERVICE_ACCOUNT_KEY in .env.local.
 * Credentials are taken from argv so they are never committed to the repo.
 */
import { upsertAuthUser, upsertRow } from "./lib/firebase-admin.mjs";

const [email, password, displayName = "Super Admin"] = process.argv.slice(2);

if (!email || !password) {
  console.error("Usage: node scripts/create-super-admin.mjs <email> '<password>' [name]");
  process.exit(1);
}

try {
  const user = await upsertAuthUser({ email, password, displayName });
  await upsertRow("users", {
    id: user.uid,
    email,
    role: "platform_admin",
    status: "active",
    display_name: displayName,
    onboarding_completed: true,
  });
  console.log(`Super Admin ready: ${email} (${user.uid})`);
} catch (err) {
  console.error("Failed:", err.message ?? err);
  process.exit(1);
}
