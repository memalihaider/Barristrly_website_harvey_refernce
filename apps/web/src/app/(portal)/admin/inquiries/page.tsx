"use client";

import { useCallback, useEffect, useState } from "react";

type Inquiry = {
  id: string;
  source: string;
  name: string;
  email: string;
  organization: string | null;
  role: string | null;
  country: string | null;
  message: string | null;
  status: "new" | "contacted" | "closed" | "spam";
  admin_notes: string | null;
  created_at: string;
};

const STATUSES = ["new", "contacted", "closed", "spam"] as const;
type Filter = "all" | Inquiry["status"];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/v1/admin/inquiries");
    const json = await res.json();
    setLoading(false);
    if (!json.ok) {
      setError(json.error?.message ?? "Failed to load");
      return;
    }
    setInquiries(json.data.inquiries ?? []);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => void load(), 0);
    return () => clearTimeout(t);
  }, [load]);

  async function setStatus(id: string, status: Inquiry["status"]) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch("/api/v1/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
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

  const counts = Object.fromEntries(
    STATUSES.map((s) => [s, inquiries.filter((i) => i.status === s).length])
  ) as Record<Inquiry["status"], number>;
  const visible =
    filter === "all" ? inquiries : inquiries.filter((i) => i.status === filter);

  return (
    <>
      <p className="text-sm text-text-on-light-muted mb-6">
        Every submission from the website&apos;s inquiry forms lands here.
        Mark each one as contacted or closed once it has been handled.
      </p>
      {error ? (
        <p className="text-sm text-red-700 mb-4" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", ...STATUSES] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize border ${
              filter === f
                ? "bg-primary text-on-primary border-primary"
                : "border-ink/20 text-ink hover:border-primary"
            }`}
          >
            {f} ({f === "all" ? inquiries.length : counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-gray-600">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-gray-600">No inquiries yet.</p>
      ) : (
        <ul className="space-y-4 list-none p-0 m-0">
          {visible.map((q) => (
            <li
              key={q.id}
              className="rounded-2xl border border-[#e5e3dc] bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {q.source.replace("_", " ")} · {q.role ?? "—"} · {q.status}
                  </p>
                  <p className="mt-1 font-serif text-lg text-ink">{q.name}</p>
                  <p className="text-sm text-gray-700 break-all">
                    <a
                      href={`mailto:${q.email}`}
                      className="text-primary hover:text-primary-hover"
                    >
                      {q.email}
                    </a>
                    {q.organization ? ` · ${q.organization}` : ""}
                    {q.country ? ` · ${q.country}` : ""}
                  </p>
                  {q.message ? (
                    <p className="mt-3 whitespace-pre-wrap rounded-lg bg-[#faf9f6] p-3 text-sm text-gray-700">
                      {q.message}
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(q.created_at).toLocaleString()}
                  </p>
                </div>
                <label className="text-xs text-gray-600">
                  Status
                  <select
                    value={q.status}
                    disabled={busyId === q.id}
                    onChange={(e) =>
                      void setStatus(q.id, e.target.value as Inquiry["status"])
                    }
                    className="mt-1 block rounded-lg border border-[#e5e3dc] bg-[#faf9f6] px-3 py-2 text-sm text-ink capitalize disabled:opacity-50"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
