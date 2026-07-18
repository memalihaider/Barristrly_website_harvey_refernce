"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/app/app-shell";

type Screen = {
  id: string;
  client_id: string;
  opponent_name: string | null;
  status: string;
  created_at: string;
};

export default function AdminCoiPage() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/v1/admin/coi");
        const json = await res.json();
        if (!json.ok) {
          setError(json.error?.message ?? "Failed to load");
          return;
        }
        setScreens(json.data.screens ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AppShell role="admin" title="COI flags">
      <p className="text-sm text-text-on-light-muted mb-6">
        Double-blind screens from <code>coi_screens</code> — conflicted results
        surface here.
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
              <th className="p-3 font-medium">Opponent</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Client</th>
            </tr>
          </thead>
          <tbody>
            {screens.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="p-3 text-text-on-light-muted">
                  No COI screens yet — created during match.
                </td>
              </tr>
            )}
            {screens.map((s) => (
              <tr key={s.id} className="border-b border-black/5">
                <td className="p-3 whitespace-nowrap">
                  {new Date(s.created_at).toLocaleString()}
                </td>
                <td className="p-3">{s.opponent_name ?? "—"}</td>
                <td className="p-3">{s.status}</td>
                <td className="p-3 font-mono text-xs">
                  {s.client_id.slice(0, 8)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
