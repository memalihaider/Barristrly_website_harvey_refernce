"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/app/app-shell";

type ClientRow = {
  clientId: string;
  displayLabel: string;
  contactRevealed: boolean;
  leadCount: number;
  matterCount: number;
  latestStatus: string | null;
  latestLeadId: string | null;
};

export default function LawyerClientsPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/lawyer/clients")
      .then((r) => r.json())
      .then((json) => {
        if (!json.ok) {
          setError(json.error?.message ?? "Failed to load clients");
          return;
        }
        setClients(json.data.clients ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell role="lawyer" title="Clients">
      <p className="text-sm text-text-on-light-muted mb-6">
        Contacts derived from your matched and assigned leads. Names stay masked
        until dual consent.
      </p>
      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : clients.length === 0 ? (
        <p className="text-sm text-text-muted">
          No clients yet. Accept matches from the pipeline to build your book.
        </p>
      ) : (
        <ul className="space-y-3 max-w-2xl">
          {clients.map((c) => (
            <li
              key={c.clientId}
              className="border border-black/10 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <h2 className="font-serif text-xl">{c.displayLabel}</h2>
                <p className="text-xs text-text-muted mt-1">
                  {c.leadCount} lead{c.leadCount === 1 ? "" : "s"} · {c.matterCount}{" "}
                  matter{c.matterCount === 1 ? "" : "s"}
                  {c.latestStatus ? ` · latest ${c.latestStatus}` : ""}
                </p>
              </div>
              {c.latestLeadId &&
                ["consulting", "engaged", "completed"].includes(
                  c.latestStatus ?? ""
                ) && (
                  <Link
                    href={`/lawyer/matters/${c.latestLeadId}`}
                    className="text-sm font-semibold text-primary"
                  >
                    Open matter →
                  </Link>
                )}
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
