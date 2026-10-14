"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Download, Inbox, Radio, Search, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { usePolling } from "@/lib/hooks/use-polling";
import { timeAgo } from "@/lib/time";
import {
  INQUIRY_PRIORITIES,
  INQUIRY_STATUSES,
  OPEN_STATUSES,
  PRIORITY_STYLE,
  STATUS_LABEL,
  STATUS_STYLE,
  type Inquiry,
  type InquiryStatus,
} from "@/lib/inquiries/model";

type Filter = "open" | "all" | InquiryStatus;

const REFRESH_MS = 15_000;

function csvCell(v: unknown) {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function exportCsv(rows: Inquiry[]) {
  const cols: (keyof Inquiry)[] = [
    "created_at", "status", "priority", "name", "email", "organization",
    "role", "country", "message", "assigned_name", "source",
  ];
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `barristrly-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<Filter>("open");
  const [priority, setPriority] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<number | null>(null);
  // Rows that arrived after the page was opened get highlighted.
  const seenAt = useRef<string | null>(null);
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    const res = await fetch("/api/v1/admin/inquiries", { cache: "no-store" });
    const json = await res.json().catch(() => null);
    setLoading(false);
    if (!json?.ok) {
      setError(json?.error?.message ?? "Failed to load inquiries");
      return;
    }
    const rows = (json.data.inquiries ?? []) as Inquiry[];
    if (seenAt.current) {
      const since = seenAt.current;
      const fresh = rows.filter((r) => r.created_at > since).map((r) => r.id);
      if (fresh.length) setFreshIds((prev) => new Set([...prev, ...fresh]));
    } else {
      seenAt.current = json.data.serverTime;
    }
    setError(null);
    setInquiries(rows);
    setLastSync(Date.now());
  }, []);

  usePolling(load, REFRESH_MS);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: inquiries.length, open: 0 };
    for (const s of INQUIRY_STATUSES) c[s] = 0;
    for (const q of inquiries) {
      c[q.status] = (c[q.status] ?? 0) + 1;
      if (OPEN_STATUSES.includes(q.status)) c.open++;
    }
    return c;
  }, [inquiries]);

  const weekCount = useMemo(
    () =>
      lastSync
        ? inquiries.filter((q) => Date.parse(q.created_at) > lastSync - 7 * 864e5).length
        : 0,
    [inquiries, lastSync]
  );
  const urgentCount = useMemo(
    () =>
      inquiries.filter(
        (q) => OPEN_STATUSES.includes(q.status) && (q.priority === "urgent" || q.priority === "high")
      ).length,
    [inquiries]
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return inquiries.filter((q) => {
      if (filter === "open" && !OPEN_STATUSES.includes(q.status)) return false;
      if (filter !== "open" && filter !== "all" && q.status !== filter) return false;
      if (priority !== "all" && (q.priority ?? "normal") !== priority) return false;
      if (!needle) return true;
      return [q.name, q.email, q.organization, q.country, q.message, q.assigned_name]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(needle));
    });
  }, [inquiries, filter, priority, query]);

  const stats = [
    { label: "New", value: counts.new, icon: Inbox, tone: "text-primary" },
    { label: "Open (needs action)", value: counts.open, icon: Clock, tone: "text-sky-700" },
    { label: "High / urgent", value: urgentCount, icon: AlertTriangle, tone: "text-red-700" },
    { label: "Last 7 days", value: weekCount, icon: CheckCircle2, tone: "text-emerald-700" },
  ];

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-on-light-muted max-w-2xl">
          Every submission from the website&apos;s inquiry forms. Open one to
          reply, assign it, set priority and keep internal notes.
        </p>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
            <Radio className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
            Live · {lastSync ? `synced ${timeAgo(new Date(lastSync).toISOString())}` : "connecting…"}
          </span>
          <button
            type="button"
            onClick={() => exportCsv(visible)}
            disabled={!visible.length}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3.5 py-1.5 text-xs font-semibold text-ink hover:border-primary hover:text-primary disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#e5e3dc] bg-white p-4">
            <div className="flex items-center justify-between text-xs text-gray-500">
              {s.label}
              <s.icon className={`h-4 w-4 ${s.tone}`} />
            </div>
            <p className="mt-2 font-serif text-3xl text-ink">{loading ? "—" : s.value}</p>
          </div>
        ))}
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["open", "all", ...INQUIRY_STATUSES] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
              filter === f
                ? "border-primary bg-primary text-on-primary"
                : "border-ink/15 text-ink hover:border-primary"
            }`}
          >
            {f === "open" ? "Open" : f === "all" ? "All" : STATUS_LABEL[f]} ({counts[f] ?? 0})
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <label className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, company, message…"
            className="w-full rounded-xl border border-[#e5e3dc] bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="rounded-xl border border-[#e5e3dc] bg-white px-3 py-2.5 text-sm capitalize"
          aria-label="Filter by priority"
        >
          <option value="all">All priorities</option>
          {INQUIRY_PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-gray-600">Loading inquiries…</p>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e5e3dc] bg-white p-10 text-center text-sm text-gray-600">
          {inquiries.length === 0
            ? "No inquiries yet. Submissions from the Request Demo form will appear here automatically."
            : "No inquiries match these filters."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e5e3dc] bg-white">
          <ul className="m-0 list-none divide-y divide-[#e5e3dc] p-0">
            {visible.map((q) => (
              <li key={q.id}>
                <Link
                  href={`/admin/inquiries/${q.id}`}
                  className={`grid gap-2 px-5 py-4 transition-colors hover:bg-[#faf9f6] md:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)_auto] md:items-center ${
                    freshIds.has(q.id) ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 truncate font-semibold text-ink">
                      {q.status === "new" ? (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
                      ) : null}
                      <span className="truncate">{q.name}</span>
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {q.email}
                      {q.organization ? ` · ${q.organization}` : ""}
                    </p>
                  </div>
                  <p className="line-clamp-2 text-sm text-gray-600">
                    {q.message || <span className="italic text-gray-400">No message</span>}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    <span className={`text-xs capitalize ${PRIORITY_STYLE[q.priority ?? "normal"]}`}>
                      {q.priority ?? "normal"}
                    </span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[q.status]}`}>
                      {STATUS_LABEL[q.status] ?? q.status}
                    </span>
                    <span className="w-16 text-right text-xs text-gray-500">{timeAgo(q.created_at)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
