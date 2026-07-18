"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/app/app-shell";

type PipelineCard = {
  id: string;
  category: string;
  status: string;
  description: string;
  clientLabel: string;
  contactRevealed: boolean;
  isMatter: boolean;
  updatedAt: string;
};

const NEXT: Record<string, string[]> = {
  open: ["matched", "screening", "cancelled"],
  matched: ["screening", "consulting", "cancelled"],
  screening: ["consulting", "matched", "cancelled"],
  consulting: ["engaged", "completed", "cancelled"],
  engaged: ["completed", "consulting", "cancelled"],
  completed: [],
  cancelled: ["open", "matched"],
};

export default function LawyerLeadsPage() {
  const [statuses, setStatuses] = useState<string[]>([]);
  const [columns, setColumns] = useState<Record<string, PipelineCard[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/lawyer/pipeline");
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Failed to load pipeline");
        return;
      }
      setStatuses(json.data.statuses ?? []);
      setColumns(json.data.columns ?? {});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function move(leadId: string, status: string) {
    setBusy(leadId);
    try {
      const res = await fetch("/api/v1/lawyer/pipeline", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, status }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Move failed");
        return;
      }
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function grantConsent(leadId: string) {
    setBusy(leadId);
    try {
      const me = await fetch("/api/v1/auth/me");
      const meJson = await me.json();
      const lawyerId = meJson.data?.user?.id as string | undefined;
      if (!lawyerId) {
        setError("Sign in as a lawyer to grant consent");
        return;
      }
      const res = await fetch("/api/v1/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, lawyerId, as: "lawyer" }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Consent failed");
        return;
      }
      await load();
    } finally {
      setBusy(null);
    }
  }

  return (
    <AppShell role="lawyer" title="Pipeline">
      <p className="text-sm text-text-on-light-muted mb-6">
        Move leads across practice statuses. Consulting+ matters open in Matters.
      </p>
      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {statuses.map((status) => (
            <div
              key={status}
              className="min-w-[220px] w-[220px] shrink-0 border border-black/10 bg-white"
            >
              <div className="border-b border-black/10 px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  {status}
                </p>
                <p className="text-xs text-text-muted">
                  {(columns[status] ?? []).length}
                </p>
              </div>
              <ul className="p-2 space-y-2 max-h-[70vh] overflow-y-auto">
                {(columns[status] ?? []).map((card) => (
                  <li
                    key={card.id}
                    className="border border-black/10 p-2.5 space-y-2 bg-ivory/40"
                  >
                    <p className="text-xs text-text-muted">{card.clientLabel}</p>
                    <p className="text-sm font-medium line-clamp-3">
                      {card.category}: {card.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {(NEXT[status] ?? []).map((next) => (
                        <button
                          key={next}
                          type="button"
                          disabled={busy === card.id}
                          onClick={() => move(card.id, next)}
                          className="text-[10px] font-semibold border border-black/15 px-1.5 py-0.5 disabled:opacity-50"
                        >
                          → {next}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {!card.contactRevealed && (
                        <button
                          type="button"
                          disabled={busy === card.id}
                          onClick={() => grantConsent(card.id)}
                          className="font-semibold text-primary disabled:opacity-50"
                        >
                          Consent
                        </button>
                      )}
                      {card.isMatter && (
                        <Link
                          href={`/lawyer/matters/${card.id}`}
                          className="font-semibold text-primary"
                        >
                          Matter
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
