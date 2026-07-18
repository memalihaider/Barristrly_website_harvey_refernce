"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/app/app-shell";
import type { AppShellRole } from "@/components/app/app-shell";

type MatterRow = {
  id: string;
  title: string;
  status: string;
  counterpartLabel: string;
  nextAction?: string;
};

export default function MattersListPage({
  role,
  detailBase,
}: {
  role: Extract<AppShellRole, "client" | "lawyer">;
  detailBase: string;
}) {
  const [matters, setMatters] = useState<MatterRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/matters")
      .then((r) => r.json())
      .then((json) => {
        if (!json.ok) {
          setError(json.error?.message ?? "Failed to load matters");
          return;
        }
        setMatters(json.data.matters ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell role={role} title="Matters">
      <p className="text-sm text-text-on-light-muted mb-6">
        Collaboration workspace for consulting and engaged leads (matter = lead).
      </p>
      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : matters.length === 0 ? (
        <div className="border border-black/10 bg-white p-6 space-y-2">
          <h2 className="font-serif text-xl">No active matters yet</h2>
          <p className="text-sm text-text-muted">
            Matters appear after you book a consult (lead status consulting /
            engaged).
          </p>
          <Link
            href={role === "client" ? "/client/intake" : "/lawyer/leads"}
            className="inline-block text-sm font-semibold text-primary mt-2"
          >
            {role === "client" ? "Start intake →" : "View leads →"}
          </Link>
        </div>
      ) : (
        <ul className="space-y-3 max-w-2xl">
          {matters.map((m) => (
            <li key={m.id}>
              <Link
                href={`${detailBase}/${m.id}`}
                className="block border border-black/10 bg-white p-5 hover:border-primary transition-colors"
              >
                <p className="text-xs uppercase tracking-wide text-text-muted capitalize">
                  {m.status}
                </p>
                <h2 className="font-serif text-xl mt-1">{m.title}</h2>
                <p className="text-sm text-text-muted mt-1">
                  With {m.counterpartLabel}
                </p>
                {m.nextAction && (
                  <p className="text-xs text-text-muted mt-2">{m.nextAction}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
