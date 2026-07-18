import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError } from "@/lib/api/response";
import {
  signWebhookPayload,
  verifyWebhookSignature,
} from "@/features/webhooks";
import { getSessionUser } from "@/lib/auth/session";

const schema = z.object({
  secret: z.string().min(8).optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
  signature: z.string().optional(),
  verify: z.boolean().optional(),
});

/** Thin webhook platform demo — HMAC sign/verify, no org DB. */
export async function POST(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body ?? {});
  if (!parsed.success) {
    return apiError(
      "validation_error",
      "Invalid webhook test payload",
      400,
      parsed.error.flatten()
    );
  }

  const secret =
    parsed.data.secret ||
    process.env.STRIPE_WEBHOOK_SECRET ||
    "barristrly_webhook_test_secret";

  const event = {
    id: crypto.randomUUID(),
    type: "platform.test",
    created_at: new Date().toISOString(),
    data: parsed.data.payload ?? { ping: true },
  };
  const raw = JSON.stringify(event);
  const signature = signWebhookPayload(secret, raw);

  if (parsed.data.verify && parsed.data.signature) {
    const valid = verifyWebhookSignature(
      secret,
      raw,
      parsed.data.signature
    );
    return apiOk({
      verified: valid,
      note: "Compared provided signature against freshly signed body of this request event",
      event,
      signature,
    });
  }

  return apiOk({
    event,
    signature,
    algorithm: "sha256-hmac",
    headerHint: "X-Barristrly-Signature",
  });
}
