import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError } from "@/lib/api/response";
import { requireAdminService } from "@/features/enterprise/admin";
import { writeAuditLog } from "@/features/crm/access";

export async function GET(_req: NextRequest) {
  const gate = await requireAdminService();
  if (!gate.ok) return gate.response;
  const { admin } = gate;

  const { data, error } = await admin
    .from("lawyer_ads")
    .select(
      "id, lawyer_id, status, headline, practice_area, jurisdiction, budget, clicks, impressions, rejection_reason, start_date, end_date, created_at, updated_at"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return apiError("internal", error.message, 500);
  return apiOk({ ads: data ?? [] });
}

const patchSchema = z.object({
  adId: z.string().uuid(),
  action: z.enum(["approve", "reject"]),
  rejectionReason: z.string().max(500).optional(),
});

export async function PATCH(req: NextRequest) {
  const gate = await requireAdminService();
  if (!gate.ok) return gate.response;
  const { admin, session } = gate;

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "validation_error",
      "Invalid ads payload",
      400,
      parsed.error.flatten()
    );
  }

  const nextStatus = parsed.data.action === "approve" ? "approved" : "rejected";
  const updates: Record<string, unknown> = {
    status: nextStatus,
    updated_at: new Date().toISOString(),
  };
  if (parsed.data.action === "reject") {
    updates.rejection_reason =
      parsed.data.rejectionReason?.trim() || "Rejected by admin";
  } else {
    updates.rejection_reason = null;
  }

  const { data, error } = await admin
    .from("lawyer_ads")
    .update(updates)
    .eq("id", parsed.data.adId)
    .select("*")
    .maybeSingle();

  if (error) return apiError("internal", error.message, 500);
  if (!data) return apiError("not_found", "Ad not found", 404);

  const actorId = session?.auth.id;
  if (actorId) {
    await writeAuditLog(admin, {
      action: `ads.${parsed.data.action}`,
      performedBy: actorId,
      details: `Ad ${parsed.data.adId} → ${nextStatus}`,
    });
  }

  return apiOk({ ad: data });
}
