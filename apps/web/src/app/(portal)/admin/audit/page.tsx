"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/app/app-shell";

type Log = {
  id: string;
  action: string;
  performed_by: string | null;
  details: string | null;
  created_at: string;
};

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/v1/admin/audit");
        const json = await res.json();
        if (!json.ok) {
          setError(json.error?.message ?? "Failed to load");
          return;
        }
        setLogs(json.data.logs ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AppShell role="admin" title="Audit center">
      <p className="text-sm text-text-on-light-muted mb-6">
        Chronological <code>audit_logs</code> across escrow, pipeline, and ads.
      </p>
      {error && (
        <p className="text-sm text-red-700 mb-4" role="alert">
          {error}
        </p>
      )}
      {loading && <p className="text-sm text-text-on-light-muted">Loading…</p>}
      <div className="border border-black/10 bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 text-left text-text-on-light-muted">
              <th className="p-3 font-medium">When</th>
              <th className="p-3 font-medium">Action</th>
              <th className="p-3 font-medium">Actor</th>
              <th className="p-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="p-3 text-text-on-light-muted">
                  No audit entries yet.
                </td>
              </tr>
            )}
            {logs.map((l) => (
              <tr key={l.id} className="border-b border-black/5 align-top">
                <td className="p-3 whitespace-nowrap">
                  {new Date(l.created_at).toLocaleString()}
                </td>
                <td className="p-3 font-medium">{l.action}</td>
                <td className="p-3 font-mono text-xs">
                  {l.performed_by?.slice(0, 8) ?? "—"}
                </td>
                <td className="p-3 text-text-on-light-muted">{l.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
