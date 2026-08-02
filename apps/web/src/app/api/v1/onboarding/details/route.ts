import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";
import { saveOnboardingDetails } from "@/lib/onboarding/service";

const agencySchema = z.object({
  role: z.literal("firm_admin"),
  companyName: z.string().min(2).max(160),
  businessEmail: z.string().email(),
  phone: z.string().min(5).max(40),
  vatId: z.string().min(2).max(80),
  employeeCount: z.coerce.number().int().min(1).max(100000),
  location: z.string().min(2).max(160),
});

const soloSchema = z.object({
  role: z.literal("lawyer"),
  fullName: z.string().min(2).max(120),
  phone: z.string().min(5).max(40),
  email: z.string().email(),
  lawyerId: z.string().min(2).max(80),
});

const customerSchema = z.object({
  role: z.literal("client"),
  fullName: z.string().min(2).max(120),
  idNumber: z.string().min(3).max(80),
});

const schema = z.discriminatedUnion("role", [
  agencySchema,
  soloSchema,
  customerSchema,
]);

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("Onboarding");

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "validation_error",
      "Invalid details",
      400,
      parsed.error.flatten()
    );
  }

  try {
    const session = await getSessionUser();
    if (!session) return apiError("unauthorized", "Sign in required", 401);
    if (session.profile.onboarding_completed) {
      return apiError("conflict", "Onboarding already completed", 409);
    }

    const { role, ...rest } = parsed.data;
    if (session.profile.role !== role) {
      return apiError(
        "validation_error",
        "Select your role before saving details",
        400
      );
    }

    const result = await saveOnboardingDetails(
      session.profile,
      role,
      rest as never
    );

    return apiOk({
      organizationId: result.organizationId,
      details: rest,
      role,
    });
  } catch (err) {
    return apiError(
      "internal",
      err instanceof Error ? err.message : "Failed to save details",
      500
    );
  }
}
