import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError } from "@/lib/api/response";
import { requireAdminService } from "@/features/enterprise/admin";
import { writeAuditLog } from "@/features/crm/access";

export async function GET() {
  const gate = await requireAdminService();
  if (!gate.ok) return gate.response;

  const { data, error } = await gate.admin
    .from("lawyer_approvals")
    .select("id, email, display_name, status, submitted_at")
    .order("submitted_at", { ascending: false });

  if (error) return apiError("internal", error.message, 500);
  return apiOk({ approvals: data ?? [] });
}

const actionSchema = z.object({
  approvalId: z.string().uuid().optional(),
  email: z.string().email().optional(),
  action: z.enum(["approve", "reject"]),
});

export async function POST(req: NextRequest) {
  const gate = await requireAdminService();
  if (!gate.ok) return gate.response;

  const body = await req.json().catch(() => null);
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "validation_error",
      "Invalid payload",
      400,
      parsed.error.flatten()
    );
  }

  let approvalQuery = gate.admin.from("lawyer_approvals").select("*");
  if (parsed.data.approvalId) {
    approvalQuery = approvalQuery.eq("id", parsed.data.approvalId);
  } else if (parsed.data.email) {
    approvalQuery = approvalQuery.eq("email", parsed.data.email);
  } else {
    return apiError("validation_error", "approvalId or email required", 400);
  }

  const { data: approval, error: findErr } = await approvalQuery.maybeSingle();
  if (findErr) return apiError("internal", findErr.message, 500);
  if (!approval) return apiError("not_found", "Approval not found", 404);

  const nextStatus = parsed.data.action === "approve" ? "approved" : "rejected";
  const { error: updErr } = await gate.admin
    .from("lawyer_approvals")
    .update({ status: nextStatus })
    .eq("id", approval.id);
  if (updErr) return apiError("internal", updErr.message, 500);

  if (parsed.data.action === "approve") {
    await gate.admin
      .from("lawyer_profiles")
      .update({
        is_verified: true,
        is_public: true,
        display_name: approval.display_name,
      })
      .eq("id", approval.id);
  }

  await writeAuditLog(gate.admin, {
    action: `lawyer_approval.${parsed.data.action}`,
    performedBy: gate.session.auth.id,
    details: `Approval ${approval.id} → ${nextStatus}`,
  });

  return apiOk({
    approvalId: approval.id,
    status: nextStatus,
  });
}
