import { NextRequest } from "next/server";
import { z } from "zod";
import { apiCreated, apiError, apiOk } from "@/lib/api/response";
import { trackEvent } from "@/features/analytics";

const demoRequestSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  organization: z.string().trim().max(200).optional().or(z.literal("")),
  role: z.enum(["client", "lawyer", "firm", "enterprise", "other"]),
  country: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = demoRequestSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "validation_error",
      "Invalid demo request",
      400,
      parsed.error.flatten()
    );
  }

  const payload = {
    ...parsed.data,
    organization: parsed.data.organization || null,
    country: parsed.data.country || null,
    message: parsed.data.message || null,
    submittedAt: new Date().toISOString(),
  };

  void trackEvent("demo_request_submitted", {
    role: payload.role,
    country: payload.country,
    hasOrganization: Boolean(payload.organization),
  });

  return apiCreated({
    received: true,
    message: "Thanks — we will be in touch shortly.",
  });
}

export async function GET() {
  return apiOk({
    roles: ["client", "lawyer", "firm", "enterprise", "other"] as const,
  });
}
