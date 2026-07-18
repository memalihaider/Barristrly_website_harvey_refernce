"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/app/app-shell";

type Payment = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  lead_id: string | null;
  created_at: string;
};

type Escrow = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_confirmed: boolean;
  lawyer_confirmed: boolean;
  lead_id: string | null;
  created_at: string;
};

export default function AdminBillingPage() {
  const [summary, setSummary] = useState<{
    gmv: number;
    paymentByStatus: Record<string, number>;
    escrowByStatus: Record<string, number>;
  } | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/v1/admin/billing");
        const json = await res.json();
        if (!json.ok) {
          setError(json.error?.message ?? "Failed to load");
          return;
        }
        setSummary(json.data.summary);
        setPayments(json.data.payments ?? []);
        setEscrows(json.data.escrows ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      }
    })();
  }, []);

  return (
    <AppShell role="admin" title="Billing">
      <p className="text-sm text-text-on-light-muted mb-6">
        Payments and escrow holds across the marketplace.
      </p>
      {error && (
        <p className="text-sm text-red-700 mb-4" role="alert">
          {error}
        </p>
      )}
      {summary && (
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="border border-black/10 bg-white p-4">
            <p className="text-xs uppercase text-text-on-light-muted">GMV</p>
            <p className="font-serif text-2xl mt-1">{summary.gmv.toLocaleString()}</p>
          </div>
          <div className="border border-black/10 bg-white p-4">
            <p className="text-xs uppercase text-text-on-light-muted mb-2">
              Payments by status
            </p>
            <ul className="text-sm space-y-1">
              {Object.entries(summary.paymentByStatus).map(([k, v]) => (
                <li key={k}>
                  {k}: {v}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-black/10 bg-white p-4">
            <p className="text-xs uppercase text-text-on-light-muted mb-2">
              Escrow by status
            </p>
            <ul className="text-sm space-y-1">
              {Object.entries(summary.escrowByStatus).map(([k, v]) => (
                <li key={k}>
                  {k}: {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <h2 className="font-serif text-lg mb-3">Recent payments</h2>
      <div className="border border-black/10 bg-white overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 text-left text-text-on-light-muted">
              <th className="p-3 font-medium">When</th>
              <th className="p-3 font-medium">Amount</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Lead</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-black/5">
                <td className="p-3 whitespace-nowrap">
                  {new Date(p.created_at).toLocaleString()}
                </td>
                <td className="p-3">
                  {p.amount} {p.currency}
                </td>
                <td className="p-3">{p.status}</td>
                <td className="p-3 font-mono text-xs">
                  {p.lead_id?.slice(0, 8) ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-serif text-lg mb-3">Escrow accounts</h2>
      <div className="border border-black/10 bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 text-left text-text-on-light-muted">
              <th className="p-3 font-medium">When</th>
              <th className="p-3 font-medium">Amount</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Confirmations</th>
            </tr>
          </thead>
          <tbody>
            {escrows.map((e) => (
              <tr key={e.id} className="border-b border-black/5">
                <td className="p-3 whitespace-nowrap">
                  {new Date(e.created_at).toLocaleString()}
                </td>
                <td className="p-3">
                  {e.amount} {e.currency}
                </td>
                <td className="p-3">{e.status}</td>
                <td className="p-3">
                  C:{e.client_confirmed ? "✓" : "·"} L:
                  {e.lawyer_confirmed ? "✓" : "·"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
