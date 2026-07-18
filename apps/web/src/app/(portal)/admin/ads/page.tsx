"use client";

import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/app/app-shell";

type Ad = {
  id: string;
  lawyer_id: string;
  status: string;
  headline: string | null;
  practice_area: string | null;
  jurisdiction: string | null;
  budget: number | null;
  clicks: number | null;
  impressions: number | null;
  rejection_reason: string | null;
  created_at: string;
};

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/admin/ads");
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Failed to load");
        return;
      }
      setAds(json.data.ads ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function act(adId: string, action: "approve" | "reject") {
    const res = await fetch("/api/v1/admin/ads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        adId,
        action,
        rejectionReason: action === "reject" ? "Does not meet guidelines" : undefined,
      }),
    });
    const json = await res.json();
    if (!json.ok) {
      setError(json.error?.message ?? "Action failed");
      return;
    }
    await load();
  }

  return (
    <AppShell role="admin" title="Ads moderation">
      <p className="text-sm text-text-on-light-muted mb-6">
        Review lawyer promotional ads before they go live.
      </p>
      {error && (
        <p className="text-sm text-red-700 mb-4" role="alert">
          {error}
        </p>
      )}
      {loading && <p className="text-sm text-text-on-light-muted">Loading…</p>}
      <ul className="space-y-3">
        {ads.length === 0 && !loading && (
          <li className="text-sm text-text-on-light-muted">No ads submitted yet.</li>
        )}
        {ads.map((ad) => (
          <li
            key={ad.id}
            className="border border-black/10 bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div>
              <p className="font-serif text-lg">
                {ad.headline || "(no headline)"}
              </p>
              <p className="text-sm text-text-on-light-muted mt-1">
                {ad.status} · {ad.practice_area ?? "—"} ·{" "}
                {ad.jurisdiction ?? "—"} · lawyer {ad.lawyer_id.slice(0, 8)}
              </p>
              {ad.rejection_reason && (
                <p className="text-sm text-red-700 mt-1">{ad.rejection_reason}</p>
              )}
            </div>
            {(ad.status === "pending" || ad.status === "paused") && (
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => void act(ad.id, "approve")}
                  className="px-3 py-1.5 bg-ink text-ivory text-sm"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => void act(ad.id, "reject")}
                  className="px-3 py-1.5 border border-black/20 text-sm"
                >
                  Reject
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
