import { NextRequest } from "next/server";
import { z } from "zod";
import { apiCreated, apiError } from "@/lib/api/response";
import { trackEvent } from "@/features/analytics";
import { createServiceClient, isDbConfigured } from "@/lib/db/client";
import { SERVICE_CATALOG } from "@/lib/marketing/service-catalog";

const serviceIdSchema = z.enum([
  "arbitration",
  "agreements-ebooks",
  "company-formation",
  "wills-estate",
  "contract-drafting",
  "retainers",
]);

const payloadSchema = z.object({
  schemaVersion: z.literal("barristrly.service-request.v1"),
  serviceId: serviceIdSchema,
  serviceSlug: z.string().min(1).max(80),
  submittedAt: z.string().optional(),
  source: z.literal("web-phase1"),
  fields: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean(), z.null()]),
  ),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "validation_error",
      "Invalid service request",
      400,
      parsed.error.flatten(),
    );
  }

  const data = parsed.data;
  const service = SERVICE_CATALOG.find((s) => s.id === data.serviceId);
  if (!service || service.slug !== data.serviceSlug) {
    return apiError("validation_error", "Unknown service", 400);
  }

  const fields = data.fields;
  const name =
    String(
      fields.clientName ??
        fields.contactName ??
        fields.fullName ??
        fields.name ??
        fields.ownerName ??
        fields.companyName ??
        "Service request",
    ).slice(0, 120) || "Service request";
  const email = String(fields.email ?? "").trim();
  if (!email || !email.includes("@")) {
    return apiError("validation_error", "A valid email is required", 400);
  }

  const messageParts = Object.entries(fields)
    .filter(([k]) => k !== "email")
    .map(([k, v]) => `${k}: ${v === null || v === undefined ? "" : String(v)}`)
    .join("\n");

  if (!isDbConfigured()) {
    // Phase-1 local/dev fallback: accept payload shape without DB so forms stay modular
    console.info("[service-requests] accepted (no DB)", {
      serviceId: data.serviceId,
      email,
    });
    return apiCreated({
      received: true,
      schemaVersion: data.schemaVersion,
      serviceId: data.serviceId,
      message: "Request received. We will confirm within 24 hours.",
    });
  }

  const { error: insertError } = await createServiceClient()
    .from("inquiries")
    .insert({
      source: `service_${data.serviceSlug}`,
      name,
      email,
      organization:
        typeof fields.companyName === "string"
          ? fields.companyName
          : typeof fields.organization === "string"
            ? fields.organization
            : null,
      role: "client",
      country: null,
      message: messageParts.slice(0, 4000),
      metadata: {
        schemaVersion: data.schemaVersion,
        serviceId: data.serviceId,
        serviceSlug: data.serviceSlug,
        fields,
        phase: "phase1",
        userAgent: req.headers.get("user-agent"),
        referer: req.headers.get("referer"),
        webhookHint: "Forward to Airtable/Make.com using barristrly.service-request.v1",
      },
    });

  if (insertError) {
    console.error("[service-requests] insert failed", insertError.message);
    return apiError(
      "internal",
      "We could not submit your request. Please try again.",
      500,
    );
  }

  void trackEvent("service_request_submitted", {
    serviceId: data.serviceId,
    serviceSlug: data.serviceSlug,
  });

  return apiCreated({
    received: true,
    schemaVersion: data.schemaVersion,
    serviceId: data.serviceId,
    message: "Request received. We will confirm within 24 hours.",
  });
}
