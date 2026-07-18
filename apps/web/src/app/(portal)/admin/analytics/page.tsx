"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/app/app-shell";
import type { PlatformKpis } from "@/features/enterprise";

type EventRow = {
  id: string;
  event_name: string;
  user_id: string | null;
  properties: Record<string, unknown>;
  created_at: string;
};

export default function AdminAnalyticsPage() {
  const [kpis, setKpis] = useState<PlatformKpis | null>(null);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/v1/admin/analytics");
        const json = await res.json();
        if (!json.ok) {
          setError(json.error?.message ?? "Failed to load");
          return;
        }
        setKpis(json.data.kpis);
        setEvents(json.data.recentEvents ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AppShell role="admin" title="Analytics">
      <p className="text-sm text-text-on-light-muted mb-6">
        Platform KPIs from live marketplace tables plus recent analytics events.
      </p>
      {error && (
        <p className="text-sm text-red-700 mb-4" role="alert">
          {error}
        </p>
      )}
      {loading && <p className="text-sm text-text-on-light-muted">Loading…</p>}
      {kpis && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {(
            [
              ["Clients", kpis.clients],
              ["Lawyers", kpis.lawyers],
              ["Leads matched", kpis.leadsMatched],
              ["Leads engaged+", kpis.leadsEngaged],
              ["Payments OK", kpis.paymentsSucceeded],
              ["GMV", kpis.gmv],
              ["Escrow released", kpis.escrowReleased],
              ["Admins", kpis.admins],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="border border-black/10 bg-white p-4">
              <p className="text-xs text-text-on-light-muted uppercase tracking-wide">
                {label}
              </p>
              <p className="font-serif text-xl mt-1">
                {label === "GMV" ? value.toLocaleString() : value}
              </p>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-serif text-lg mb-3">Recent events</h2>
      <div className="border border-black/10 bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 text-left text-text-on-light-muted">
              <th className="p-3 font-medium">When</th>
              <th className="p-3 font-medium">Event</th>
              <th className="p-3 font-medium">User</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && (
              <tr>
                <td colSpan={3} className="p-3 text-text-on-light-muted">
                  No events yet — intake, match, and payment will record here.
                </td>
              </tr>
            )}
            {events.map((e) => (
              <tr key={e.id} className="border-b border-black/5">
                <td className="p-3 whitespace-nowrap">
                  {new Date(e.created_at).toLocaleString()}
                </td>
                <td className="p-3">{e.event_name}</td>
                <td className="p-3 font-mono text-xs">
                  {e.user_id?.slice(0, 8) ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
