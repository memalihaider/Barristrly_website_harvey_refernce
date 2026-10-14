/**
 * Shared Firebase Admin bootstrap for repo scripts.
 * Reads FIREBASE_SERVICE_ACCOUNT_KEY (JSON or base64) or
 * FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY from .env.local files.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PROJECT_ID = "barristrly-77608";

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

export const env = {
  ...loadEnv(path.join(ROOT, ".env.local")),
  ...loadEnv(path.join(ROOT, "apps/web/.env.local")),
  ...process.env,
};

function serviceAccount() {
  const raw = env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
  if (raw) {
    const json = raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
    return JSON.parse(json);
  }
  if (env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
    return {
      project_id: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || PROJECT_ID,
      client_email: env.FIREBASE_CLIENT_EMAIL,
      private_key: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
  }
  console.error(
    "Missing FIREBASE_SERVICE_ACCOUNT_KEY in .env.local\n" +
      "Firebase console → Project settings → Service accounts → Generate new private key"
  );
  process.exit(1);
}

const app = initializeApp({
  credential: cert(serviceAccount()),
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || PROJECT_ID,
});

export const auth = getAuth(app);
export const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true });

/** Creates or updates an Auth user (password reset, email confirmed). */
export async function upsertAuthUser({ email, password, displayName }) {
  try {
    const existing = await auth.getUserByEmail(email);
    return await auth.updateUser(existing.uid, {
      password,
      displayName,
      emailVerified: true,
    });
  } catch (err) {
    if (err?.code !== "auth/user-not-found") throw err;
    return auth.createUser({ email, password, displayName, emailVerified: true });
  }
}

/** Merges a row into a collection, keyed by `id`, with timestamps. */
export async function upsertRow(table, row) {
  const now = new Date().toISOString();
  const ref = db.collection(table).doc(row.id);
  const snap = await ref.get();
  await ref.set(
    snap.exists ? { ...row, updated_at: now } : { created_at: now, updated_at: now, ...row },
    { merge: true }
  );
}
