"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/app/app-shell";

type Entry = {
  id: string;
  amount: number;
  currency: string;
  type: string;
  description: string;
  created_at: string;
};

type Audit = {
  id: string;
  action: string;
  details: string;
  created_at: string;
};

export default function LawyerAccountingPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [logs, setLogs] = useState<Audit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/v1/lawyer/accounting").then((r) => r.json()),
      fetch("/api/v1/lawyer/audit").then((r) => r.json()),
    ])
      .then(([acc, aud]) => {
        if (!acc.ok) setError(acc.error?.message ?? "Accounting failed");
        else setEntries(acc.data.entries ?? []);
        if (aud.ok) setLogs(aud.data.logs ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell role="lawyer" title="Accounting">
      <p className="text-sm text-text-on-light-muted mb-6">
        Practice ledger from escrow releases, plus your recent audit trail.
      </p>
      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : (
        <div className="space-y-10 max-w-2xl">
          <section>
            <h2 className="font-serif text-xl mb-3">Ledger</h2>
            {entries.length === 0 ? (
              <p className="text-sm text-text-muted">
                No entries yet. Dual-confirm escrow release creates a ledger row.
              </p>
            ) : (
              <ul className="space-y-2">
                {entries.map((e) => (
                  <li
                    key={e.id}
                    className="border border-black/10 bg-white p-3 text-sm"
                  >
                    <p className="font-medium">
                      {e.amount} {String(e.currency).toUpperCase()} · {e.type}
                    </p>
                    <p className="text-xs text-text-muted mt-1">{e.description}</p>
                    <p className="text-xs text-text-muted">
                      {new Date(e.created_at).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2 className="font-serif text-xl mb-3">Audit</h2>
            {logs.length === 0 ? (
              <p className="text-sm text-text-muted">No audit events yet.</p>
            ) : (
              <ul className="space-y-2">
                {logs.map((l) => (
                  <li
                    key={l.id}
                    className="border border-black/10 bg-white p-3 text-sm"
                  >
                    <p className="font-medium">{l.action}</p>
                    <p className="text-xs text-text-muted mt-1">{l.details}</p>
                    <p className="text-xs text-text-muted">
                      {new Date(l.created_at).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </AppShell>
  );
}
