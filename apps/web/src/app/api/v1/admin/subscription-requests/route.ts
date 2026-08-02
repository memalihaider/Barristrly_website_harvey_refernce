import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError } from "@/lib/api/response";
import { requireAdminService } from "@/features/enterprise/admin";
import {
  activateSubscriptionRequest,
  rejectSubscriptionRequest,
} from "@/lib/onboarding/service";

function assertSuperAdmin(role: string) {
  return role === "platform_admin" || role === "mediator";
}

export async function GET(_req: NextRequest) {
  const gate = await requireAdminService();
  if (!gate.ok) return gate.response;
  if (!assertSuperAdmin(gate.session.profile.role)) {
    return apiError("forbidden", "Super Admin required", 403);
  }

  const { data, error } = await gate.admin
    .from("subscription_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return apiError("internal", error.message, 500);
  return apiOk({ requests: data ?? [] });
}

const patchSchema = z.object({
  id: z.string().uuid(),
  action: z.enum(["approve", "reject"]),
  adminNotes: z.string().max(2000).optional(),
});

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("validation_error", "Invalid patch", 400, parsed.error.flatten());
  }

  const gate = await requireAdminService();
  if (!gate.ok) return gate.response;
  if (!assertSuperAdmin(gate.session.profile.role)) {
    return apiError("forbidden", "Super Admin required", 403);
  }

  try {
    if (parsed.data.action === "approve") {
      const result = await activateSubscriptionRequest(parsed.data.id, {
        reviewedBy: gate.session.auth.id,
        adminNotes: parsed.data.adminNotes,
        client: gate.admin,
      });
      return apiOk({ status: "active", ...result });
    }

    await rejectSubscriptionRequest(
      parsed.data.id,
      gate.session.auth.id,
      parsed.data.adminNotes,
      gate.admin
    );
    return apiOk({ status: "rejected", requestId: parsed.data.id });
  } catch (err) {
    return apiError(
      "internal",
      err instanceof Error ? err.message : "Update failed",
      500
    );
  }
}
