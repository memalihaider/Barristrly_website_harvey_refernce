import { createDb } from "@/lib/firebase/db";
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin";

/** Server-privileged data client for trusted API routes. */
export function createServiceClient() {
  return createDb();
}

export function isDbConfigured() {
  return isFirebaseAdminConfigured();
}
