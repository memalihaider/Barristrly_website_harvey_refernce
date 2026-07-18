/** Phase 7 — Thin enterprise helpers (admin console KPIs + compliance) */

export type PlatformKpis = {
  usersTotal: number;
  clients: number;
  lawyers: number;
  admins: number;
  leadsOpen: number;
  leadsMatched: number;
  leadsEngaged: number;
  meetingsTotal: number;
  paymentsSucceeded: number;
  gmv: number;
  escrowHeld: number;
  escrowReleased: number;
  pendingLawyerApprovals: number;
  pendingAds: number;
  coiScreens: number;
};

export function buildPlatformKpis(input: {
  users: { role: string }[];
  leads: { status: string }[];
  meetingsCount: number;
  payments: { status: string; amount: number | string }[];
  escrows: { status: string }[];
  pendingApprovals: number;
  pendingAds: number;
  coiCount: number;
}): PlatformKpis {
  const roleCount = (role: string) =>
    input.users.filter((u) => u.role === role).length;

  const leadStatus = (status: string) =>
    input.leads.filter((l) => l.status === status).length;

  const gmv = input.payments
    .filter((p) => p.status === "succeeded")
    .reduce((sum, p) => sum + Number(p.amount ?? 0), 0);

  return {
    usersTotal: input.users.length,
    clients: roleCount("client"),
    lawyers: roleCount("lawyer"),
    admins:
      roleCount("platform_admin") +
      roleCount("mediator") +
      roleCount("firm_admin"),
    leadsOpen: leadStatus("open"),
    leadsMatched: leadStatus("matched"),
    leadsEngaged:
      leadStatus("engaged") + leadStatus("consulting") + leadStatus("completed"),
    meetingsTotal: input.meetingsCount,
    paymentsSucceeded: input.payments.filter((p) => p.status === "succeeded")
      .length,
    gmv,
    escrowHeld: input.escrows.filter((e) => e.status === "held").length,
    escrowReleased: input.escrows.filter((e) => e.status === "released").length,
    pendingLawyerApprovals: input.pendingApprovals,
    pendingAds: input.pendingAds,
    coiScreens: input.coiCount,
  };
}

export type ComplianceCheck = {
  id: string;
  title: string;
  description: string;
  status: "pass" | "warn" | "info";
  metric?: number;
};

export const COMPLIANCE_STATIC: Omit<ComplianceCheck, "status" | "metric">[] = [
  {
    id: "escrow_dual_confirm",
    title: "Escrow dual confirmation",
    description: "Funds release only after client and lawyer both confirm.",
  },
  {
    id: "coi_before_reveal",
    title: "COI before contact reveal",
    description: "Conflict screens run before dual-consent identity reveal.",
  },
  {
    id: "audit_sensitive",
    title: "Audit on sensitive actions",
    description: "Escrow release and pipeline changes write audit_logs.",
  },
  {
    id: "lawyer_approval_gate",
    title: "Lawyer approval gate",
    description: "Only verified public lawyers enter the match pool.",
  },
];

export function buildComplianceChecks(counts: {
  openEscrow: number;
  pendingApprovals: number;
  coiCount: number;
  auditCount: number;
}): ComplianceCheck[] {
  const metrics: Array<{
    status: ComplianceCheck["status"];
    metric: number;
  }> = [
    {
      status: counts.openEscrow > 0 ? "warn" : "pass",
      metric: counts.openEscrow,
    },
    { status: "info", metric: counts.coiCount },
    {
      status: counts.auditCount > 0 ? "pass" : "info",
      metric: counts.auditCount,
    },
    {
      status: counts.pendingApprovals > 0 ? "warn" : "pass",
      metric: counts.pendingApprovals,
    },
  ];

  return COMPLIANCE_STATIC.map((item, i) => ({
    ...item,
    status: metrics[i]!.status,
    metric: metrics[i]!.metric,
  }));
}

export const AD_STATUSES = ["pending", "approved", "rejected", "active", "paused"] as const;
export type AdStatus = (typeof AD_STATUSES)[number];
