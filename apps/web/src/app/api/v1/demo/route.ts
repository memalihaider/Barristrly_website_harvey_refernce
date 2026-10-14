import { NextRequest } from "next/server";
import { z } from "zod";
import { apiCreated, apiError, apiOk } from "@/lib/api/response";
import { trackEvent } from "@/features/analytics";
import { createServiceClient, isDbConfigured } from "@/lib/db/client";

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

  if (!isDbConfigured()) {
    return apiError(
      "not_configured",
      "Inquiries are not configured. Please try again later.",
      503
    );
  }

  const { error: insertError } = await createServiceClient()
    .from("inquiries")
    .insert({
      source: "request_demo",
      name: payload.name,
      email: payload.email,
      organization: payload.organization,
      role: payload.role,
      country: payload.country,
      message: payload.message,
      metadata: {
        userAgent: req.headers.get("user-agent"),
        referer: req.headers.get("referer"),
      },
    });

  if (insertError) {
    console.error("[demo] failed to store inquiry", insertError.message);
    return apiError(
      "internal",
      "We could not submit your request. Please try again.",
      500
    );
  }

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
