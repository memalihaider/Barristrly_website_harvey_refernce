import { NextRequest } from "next/server";
import { apiOk, apiError } from "@/lib/api/response";
import { requireAdminService } from "@/features/enterprise/admin";

export async function GET(_req: NextRequest) {
  const gate = await requireAdminService();
  if (!gate.ok) return gate.response;
  const { admin } = gate;

  const [paymentsRes, escrowsRes] = await Promise.all([
    admin
      .from("payments")
      .select(
        "id, user_id, lead_id, type, amount, currency, status, description, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(100),
    admin
      .from("escrow_accounts")
      .select(
        "id, client_id, lawyer_id, lead_id, payment_id, amount, currency, status, client_confirmed, lawyer_confirmed, created_at, released_at"
      )
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  if (paymentsRes.error) return apiError("internal", paymentsRes.error.message, 500);
  if (escrowsRes.error) return apiError("internal", escrowsRes.error.message, 500);

  const payments = paymentsRes.data ?? [];
  const escrows = escrowsRes.data ?? [];

  const byStatus = (rows: { status: string }[]) => {
    const map: Record<string, number> = {};
    for (const r of rows) {
      map[r.status] = (map[r.status] ?? 0) + 1;
    }
    return map;
  };

  const gmv = payments
    .filter((p) => p.status === "succeeded")
    .reduce((s, p) => s + Number(p.amount ?? 0), 0);

  return apiOk({
    summary: {
      gmv,
      paymentByStatus: byStatus(payments),
      escrowByStatus: byStatus(escrows),
    },
    payments,
    escrows,
  });
}
