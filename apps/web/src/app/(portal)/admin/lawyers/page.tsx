"use client";

import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/app/app-shell";

type Approval = {
  id: string;
  email: string;
  display_name: string;
  status: string;
  submitted_at: string;
};

export default function AdminLawyersPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/admin/lawyer-approvals");
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Failed to load");
        return;
      }
      setApprovals(json.data.approvals ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function act(approvalId: string, action: "approve" | "reject") {
    const res = await fetch("/api/v1/admin/lawyer-approvals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approvalId, action }),
    });
    const json = await res.json();
    if (!json.ok) {
      setError(json.error?.message ?? "Action failed");
      return;
    }
    await load();
  }

  return (
    <AppShell role="admin" title="Lawyer approvals">
      <p className="text-sm text-text-on-light-muted mb-6">
        Approve lawyers to set <code>is_verified</code> and <code>is_public</code> so
        they enter the match pool.
      </p>
      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : approvals.length === 0 ? (
        <p className="text-sm text-text-muted">No approval requests yet.</p>
      ) : (
        <ul className="divide-y divide-black/10 border border-black/10 bg-white">
          {approvals.map((a) => (
            <li
              key={a.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4"
            >
              <div>
                <p className="font-medium text-ink">{a.display_name || "Lawyer"}</p>
                <p className="text-sm text-text-muted">{a.email}</p>
                <p className="text-xs text-text-muted mt-1 capitalize">
                  Status: {a.status}
                </p>
              </div>
              {a.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => act(a.id, "approve")}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => act(a.id, "reject")}
                    className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold"
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
