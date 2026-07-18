"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AppShell from "@/components/app/app-shell";

type MatchCard = {
  lawyerId: string;
  score: number;
  rank: number;
  displayName: string;
  contactRevealed: boolean;
  practiceAreas: string[];
  rating: number;
  explanation?: {
    practiceFit: number;
    jurisdictionFit: number;
    availability: number;
    reputation: number;
    outcomeFit: number;
  };
};

function MatchesInner() {
  const search = useSearchParams();
  const router = useRouter();
  const leadId = search.get("leadId");
  const practiceArea = search.get("practiceArea") ?? undefined;
  const jurisdiction = search.get("jurisdiction") ?? undefined;

  const [matches, setMatches] = useState<MatchCard[]>([]);
  const [source, setSource] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: leadId || undefined,
          practiceArea: practiceArea || "commercial",
          jurisdiction: jurisdiction || "AE-DIFC",
        }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Match failed");
        return;
      }
      setMatches(json.data.matches ?? []);
      setSource(json.data.source ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Match failed");
    } finally {
      setLoading(false);
    }
  }, [leadId, practiceArea, jurisdiction]);

  useEffect(() => {
    void load();
  }, [load]);

  async function grantConsent(lawyerId: string) {
    if (!leadId) {
      setError("Complete intake first so we have a leadId.");
      return;
    }
    setBusyId(lawyerId);
    try {
      const res = await fetch("/api/v1/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, lawyerId, as: "client" }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Consent failed");
        return;
      }
      await load();
    } finally {
      setBusyId(null);
    }
  }

  function requestConsult(lawyerId: string) {
    if (!leadId) {
      setError("Complete intake first so we have a leadId.");
      return;
    }
    const params = new URLSearchParams({ leadId, lawyerId });
    router.push(`/client/bookings?${params.toString()}`);
  }

  return (
    <>
      <p className="text-sm text-text-on-light-muted mb-6">
        Ranked after conflict screening. Identities stay masked until dual consent.
        {leadId ? (
          <span className="block mt-1 text-xs">Lead: {leadId}</span>
        ) : (
          <span className="block mt-1 text-xs text-amber-700">
            No leadId — run intake to persist matches.
          </span>
        )}
        {source && (
          <span className="block mt-1 text-xs">Source: {source}</span>
        )}
      </p>
      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="text-sm text-text-muted">Finding matches…</p>
      ) : matches.length === 0 ? (
        <p className="text-sm text-text-muted">
          No verified public lawyers yet. Approve a lawyer in admin first.
        </p>
      ) : (
        <ul className="space-y-4 max-w-2xl">
          {matches.map((m) => (
            <li
              key={m.lawyerId}
              className="border border-black/10 bg-white p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-text-muted">
                    Rank #{m.rank}
                  </p>
                  <h2 className="font-serif text-xl mt-1">{m.displayName}</h2>
                  <p className="text-sm text-text-muted mt-1">
                    Score {(m.score * 100).toFixed(0)}% · Rating {m.rating.toFixed(1)}
                  </p>
                  {m.explanation && (
                    <p className="text-xs text-text-muted mt-1">
                      Fit: practice {(m.explanation.practiceFit * 100).toFixed(0)}% ·
                      jurisdiction {(m.explanation.jurisdictionFit * 100).toFixed(0)}% ·
                      outcome {(m.explanation.outcomeFit * 100).toFixed(0)}%
                    </p>
                  )}
                  {m.practiceAreas.length > 0 && (
                    <p className="text-xs text-text-muted mt-1">
                      {m.practiceAreas.join(", ")}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busyId === m.lawyerId}
                  onClick={() => grantConsent(m.lawyerId)}
                  className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold disabled:opacity-50"
                >
                  {m.contactRevealed ? "Identity revealed" : "Grant consent"}
                </button>
                <button
                  type="button"
                  onClick={() => requestConsult(m.lawyerId)}
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
                >
                  Request consult
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function ClientMatchesPage() {
  return (
    <AppShell role="client" title="Matches">
      <Suspense fallback={<p className="text-sm text-text-muted">Loading…</p>}>
        <MatchesInner />
      </Suspense>
    </AppShell>
  );
}
