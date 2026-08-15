"use client";

import { useEffect, useState } from "react";

type SubRequest = {
  id: string;
  user_id: string;
  role: string;
  plan_id: string;
  plan_snapshot: { name?: string; price?: string; period?: string };
  payment_method: string;
  status: string;
  profile_snapshot: Record<string, unknown>;
  admin_notes: string | null;
  created_at: string;
};

export default function AdminSubscriptionsPage() {
  const [requests, setRequests] = useState<SubRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/v1/admin/subscription-requests");
    const json = await res.json();
    if (!json.ok) {
      setError(json.error?.message ?? "Failed to load");
      return;
    }
    setRequests(json.data.requests ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function act(id: string, action: "approve" | "reject") {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch("/api/v1/admin/subscription-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message ?? "Update failed");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  const pending = requests.filter((r) => r.status === "pending_approval");

  return (
    <>
      <p className="text-sm text-text-on-light-muted mb-6">
        Approve bank transfer and PayPal onboarding payments after invoice
        clearance. Approving unlocks the user&apos;s portal.
      </p>
      {error ? (
        <p className="text-sm text-red-700 mb-4" role="alert">
          {error}
        </p>
      ) : null}

      <h2 className="font-serif text-xl mb-4">
        Pending approval ({pending.length})
      </h2>
      {pending.length === 0 ? (
        <p className="text-sm text-gray-600 mb-10">No pending requests.</p>
      ) : (
        <ul className="space-y-4 mb-10 list-none p-0 m-0">
          {pending.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-[#e5e3dc] bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {r.payment_method.replace("_", " ")} · {r.role}
                  </p>
                  <p className="mt-1 font-serif text-lg text-ink">
                    {r.plan_snapshot?.name ?? r.plan_id}
                  </p>
                  <p className="text-sm text-gray-600">
                    {r.plan_snapshot?.price} {r.plan_snapshot?.period}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    User: {r.user_id.slice(0, 8)}… ·{" "}
                    {new Date(r.created_at).toLocaleString()}
                  </p>
                  <pre className="mt-3 max-w-lg overflow-auto rounded-lg bg-[#faf9f6] p-3 text-[11px] text-gray-600">
                    {JSON.stringify(r.profile_snapshot, null, 2)}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busyId === r.id}
                    onClick={() => void act(r.id, "approve")}
                    className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={busyId === r.id}
                    onClick={() => void act(r.id, "reject")}
                    className="rounded-full border border-ink/20 px-4 py-2 text-xs font-semibold text-ink hover:border-red-400 hover:text-red-600 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 className="font-serif text-xl mb-4">All recent</h2>
      <div className="overflow-x-auto border border-[#e5e3dc] rounded-xl bg-white">
        <table className="w-full text-sm text-left">
          <thead className="border-b border-[#e5e3dc] text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-b border-[#e5e3dc]/70">
                <td className="px-4 py-3">
                  {r.plan_snapshot?.name ?? r.plan_id}
                </td>
                <td className="px-4 py-3">{r.payment_method}</td>
                <td className="px-4 py-3">{r.status}</td>
                <td className="px-4 py-3">{r.role}</td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {new Date(r.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
