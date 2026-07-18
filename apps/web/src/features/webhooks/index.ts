/** Phase 7 — Webhook delivery helpers — doc/WEBHOOK_SPEC.md */
import { createHmac } from "crypto";

export function signWebhookPayload(secret: string, body: string): string {
  return createHmac("sha256", secret).update(body).digest("hex");
}

export function verifyWebhookSignature(
  secret: string,
  body: string,
  signature: string
): boolean {
  const expected = signWebhookPayload(secret, body);
  return expected === signature;
}
