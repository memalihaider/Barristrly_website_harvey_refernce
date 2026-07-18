"use client";

import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/app/app-shell";
import type { AdminInsightTip } from "@/features/intelligence";
import type { PlatformKpis } from "@/features/enterprise";

export default function AdminInsightsPage() {
  const [kpis, setKpis] = useState<PlatformKpis | null>(null);
  const [tips, setTips] = useState<AdminInsightTip[]>([]);
  const [bullets, setBullets] = useState<string[]>([]);
  const [brief, setBrief] = useState<string | null>(null);
  const [gated, setGated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/v1/admin/insights");
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Failed to load");
        return;
      }
      setKpis(json.data.kpis);
      setTips(json.data.tips ?? []);
      setBullets(json.data.briefBullets ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function generateBrief() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/admin/insights/brief", { method: "POST" });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Brief failed");
        return;
      }
      setBrief(json.data.brief);
      setGated(Boolean(json.data.gated));
      setKpis(json.data.kpis);
      setBullets(json.data.bullets ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Brief failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell role="admin" title="Insights">
      <p className="text-sm text-text-on-light-muted mb-6">
        Marketplace optimization tips and executive briefing from live KPIs.
      </p>
      {error && (
        <p className="text-sm text-red-700 mb-4" role="alert">
          {error}
        </p>
      )}

      {kpis && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <Metric label="Users" value={kpis.usersTotal} />
          <Metric label="Leads open" value={kpis.leadsOpen} />
          <Metric label="GMV" value={kpis.gmv} />
          <Metric label="Pending approvals" value={kpis.pendingLawyerApprovals} />
        </div>
      )}

      <h2 className="font-serif text-lg mb-3">Optimization tips</h2>
      <ul className="space-y-2 mb-10 max-w-2xl">
        {tips.map((t) => (
          <li key={t.id} className="border border-black/10 bg-white p-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-medium">{t.title}</p>
              <span className="text-xs uppercase text-text-on-light-muted">
                {t.priority}
              </span>
            </div>
            <p className="text-sm text-text-on-light-muted mt-1">{t.detail}</p>
          </li>
        ))}
      </ul>

      <h2 className="font-serif text-lg mb-3">Executive brief</h2>
      <ul className="text-sm text-text-on-light-muted space-y-1 mb-4 max-w-2xl">
        {bullets.map((b) => (
          <li key={b}>• {b}</li>
        ))}
      </ul>
      <button
        type="button"
        disabled={busy}
        onClick={() => void generateBrief()}
        className="px-4 py-2 bg-ink text-ivory text-sm disabled:opacity-50 mb-4"
      >
        {busy ? "Generating…" : "Generate brief"}
      </button>
      {brief && (
        <div className="border border-black/10 bg-white p-5 max-w-2xl">
          {gated && (
            <p className="text-xs uppercase tracking-wide text-amber-800 mb-2">
              Stub / gated — set GEMINI_API_KEY for live
            </p>
          )}
          <p className="text-sm whitespace-pre-wrap">{brief}</p>
        </div>
      )}
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-black/10 bg-white p-3">
      <p className="text-xs uppercase text-text-on-light-muted">{label}</p>
      <p className="font-serif text-xl mt-1">
        {label === "GMV" ? value.toLocaleString() : value}
      </p>
    </div>
  );
}
