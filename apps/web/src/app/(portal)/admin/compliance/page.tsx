"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/app/app-shell";
import type { ComplianceCheck } from "@/features/enterprise";

export default function AdminCompliancePage() {
  const [checks, setChecks] = useState<ComplianceCheck[]>([]);
  const [counts, setCounts] = useState<{
    openEscrow: number;
    pendingApprovals: number;
    coiCount: number;
    auditCount: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/v1/admin/compliance");
        const json = await res.json();
        if (!json.ok) {
          setError(json.error?.message ?? "Failed to load");
          return;
        }
        setChecks(json.data.checks ?? []);
        setCounts(json.data.counts);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      }
    })();
  }, []);

  return (
    <AppShell role="admin" title="Compliance">
      <p className="text-sm text-text-on-light-muted mb-6">
        Control checklist plus live counts for escrow, approvals, COI, and audit.
      </p>
      {error && (
        <p className="text-sm text-red-700 mb-4" role="alert">
          {error}
        </p>
      )}
      {counts && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <Stat label="Open escrow" value={counts.openEscrow} />
          <Stat label="Pending approvals" value={counts.pendingApprovals} />
          <Stat label="COI screens" value={counts.coiCount} />
          <Stat label="Audit entries" value={counts.auditCount} />
        </div>
      )}
      <ul className="space-y-3">
        {checks.map((c) => (
          <li key={c.id} className="border border-black/10 bg-white p-4">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-serif text-lg">{c.title}</h2>
              <span className="text-xs uppercase tracking-wide text-text-on-light-muted">
                {c.status}
                {typeof c.metric === "number" ? ` · ${c.metric}` : ""}
              </span>
            </div>
            <p className="text-sm text-text-on-light-muted mt-1">
              {c.description}
            </p>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-black/10 bg-white p-4">
      <p className="text-xs uppercase text-text-on-light-muted">{label}</p>
      <p className="font-serif text-2xl mt-1">{value}</p>
    </div>
  );
}
