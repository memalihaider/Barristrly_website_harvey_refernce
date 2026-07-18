import { NextRequest } from "next/server";
import { apiOk, apiError } from "@/lib/api/response";
import { requireAdminService } from "@/features/enterprise/admin";
import { buildComplianceChecks } from "@/features/enterprise";

export async function GET(_req: NextRequest) {
  const gate = await requireAdminService();
  if (!gate.ok) return gate.response;
  const { admin } = gate;

  const [escrowRes, approvalsRes, coiRes, auditRes] = await Promise.all([
    admin
      .from("escrow_accounts")
      .select("id", { count: "exact", head: true })
      .eq("status", "held"),
    admin
      .from("lawyer_approvals")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    admin.from("coi_screens").select("id", { count: "exact", head: true }),
    admin.from("audit_logs").select("id", { count: "exact", head: true }),
  ]);

  if (escrowRes.error) return apiError("internal", escrowRes.error.message, 500);

  const counts = {
    openEscrow: escrowRes.count ?? 0,
    pendingApprovals: approvalsRes.count ?? 0,
    coiCount: coiRes.count ?? 0,
    auditCount: auditRes.count ?? 0,
  };

  return apiOk({
    counts,
    checks: buildComplianceChecks(counts),
  });
}
