import { NextRequest } from "next/server";
import { apiOk, apiError } from "@/lib/api/response";
import { requireAdminService } from "@/features/enterprise/admin";
import { buildPlatformKpis } from "@/features/enterprise";
import {
  buildAdminOptimizationTips,
  buildExecutiveBrief,
} from "@/features/intelligence";

export async function GET(_req: NextRequest) {
  const gate = await requireAdminService();
  if (!gate.ok) return gate.response;
  const { admin } = gate;

  const [
    usersRes,
    leadsRes,
    meetingsRes,
    paymentsRes,
    escrowsRes,
    approvalsRes,
    adsRes,
    coiRes,
  ] = await Promise.all([
    admin.from("users").select("id, role"),
    admin.from("leads").select("id, status"),
    admin.from("meetings").select("id", { count: "exact", head: true }),
    admin.from("payments").select("id, status, amount"),
    admin.from("escrow_accounts").select("id, status"),
    admin
      .from("lawyer_approvals")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    admin
      .from("lawyer_ads")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    admin.from("coi_screens").select("id", { count: "exact", head: true }),
  ]);

  if (usersRes.error) return apiError("internal", usersRes.error.message, 500);

  const kpis = buildPlatformKpis({
    users: usersRes.data ?? [],
    leads: leadsRes.data ?? [],
    meetingsCount: meetingsRes.count ?? 0,
    payments: paymentsRes.data ?? [],
    escrows: escrowsRes.data ?? [],
    pendingApprovals: approvalsRes.count ?? 0,
    pendingAds: adsRes.count ?? 0,
    coiCount: coiRes.count ?? 0,
  });

  return apiOk({
    kpis,
    tips: buildAdminOptimizationTips(kpis),
    briefBullets: buildExecutiveBrief(kpis),
  });
}
