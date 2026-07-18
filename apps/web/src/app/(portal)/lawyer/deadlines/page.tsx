"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/app/app-shell";

type DeadlineRow = {
  id: string;
  lead_id: string;
  title: string;
  due_at: string;
  status: string;
  kind: string;
  daysRemaining: number;
  category: string | null;
};

export default function LawyerDeadlinesPage() {
  const [deadlines, setDeadlines] = useState<DeadlineRow[]>([]);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/lawyer/deadlines")
      .then((r) => r.json())
      .then((json) => {
        if (!json.ok) {
          setError(json.error?.message ?? "Failed to load");
          return;
        }
        setDeadlines(json.data.deadlines ?? []);
        setUpcomingCount(json.data.upcomingCount ?? 0);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell role="lawyer" title="Deadlines">
      <p className="text-sm text-text-on-light-muted mb-6">
        Open litigation and obligation deadlines across your matters.
        {upcomingCount > 0 && (
          <span className="block mt-1 text-xs">
            {upcomingCount} due within 14 days
          </span>
        )}
      </p>
      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : deadlines.length === 0 ? (
        <p className="text-sm text-text-muted">
          No open deadlines. Add them from a matter detail page.
        </p>
      ) : (
        <ul className="space-y-3 max-w-2xl">
          {deadlines.map((d) => (
            <li
              key={d.id}
              className="border border-black/10 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p className="font-medium">{d.title}</p>
                <p className="text-xs text-text-muted mt-1 capitalize">
                  {d.kind} · due {new Date(d.due_at).toLocaleString()} ·{" "}
                  {d.daysRemaining}d
                  {d.category ? ` · ${d.category}` : ""}
                </p>
              </div>
              <Link
                href={`/lawyer/matters/${d.lead_id}`}
                className="text-sm font-semibold text-primary"
              >
                Matter →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
