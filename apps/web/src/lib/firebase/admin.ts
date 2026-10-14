import {
  cert,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { firebaseConfig } from "@/lib/firebase/config";

/**
 * Server credentials, from either:
 * - FIREBASE_SERVICE_ACCOUNT_KEY: the service-account JSON (raw or base64), or
 * - FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY.
 */
function readServiceAccount(): ServiceAccount | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
  if (raw) {
    const json = raw.startsWith("{")
      ? raw
      : Buffer.from(raw, "base64").toString("utf8");
    const parsed = JSON.parse(json) as {
      project_id?: string;
      client_email?: string;
      private_key?: string;
    };
    return {
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key,
    };
  }
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (clientEmail && privateKey) {
    return { projectId: firebaseConfig.projectId, clientEmail, privateKey };
  }
  return null;
}

export function isFirebaseAdminConfigured() {
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
      (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)
  );
}

let firestore: Firestore | null = null;

export function getAdminApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;
  const account = readServiceAccount();
  return initializeApp({
    projectId: firebaseConfig.projectId,
    ...(account ? { credential: cert(account) } : {}),
  });
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminFirestore(): Firestore {
  if (firestore) return firestore;
  firestore = getFirestore(getAdminApp());
  firestore.settings({ ignoreUndefinedProperties: true });
  return firestore;
}

export function getAdminBucket() {
  return getStorage(getAdminApp()).bucket(firebaseConfig.storageBucket);
}
