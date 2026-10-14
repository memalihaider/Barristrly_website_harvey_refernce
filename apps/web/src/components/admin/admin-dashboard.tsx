"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  FilePlus2,
  FileText,
  Inbox,
  Newspaper,
  Radio,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { usePolling } from "@/lib/hooks/use-polling";
import { timeAgo } from "@/lib/time";
import { STATUS_LABEL, STATUS_STYLE, type InquiryStatus } from "@/lib/inquiries/model";

type Daily = { date: string; count: number };
type Overview = {
  inquiries: {
    total: number;
    new: number;
    open: number;
    lastWeek: number;
    urgent: number;
    daily: Daily[];
    recent: { id: string; name: string; email: string; organization: string | null; status: InquiryStatus; created_at: string }[];
  };
  users: {
    total: number;
    byRole: Record<string, number>;
    lastWeek: number;
    daily: Daily[];
    recent: { id: string; name: string; email: string; role: string; created_at: string | null }[];
  };
  content: { published: number; drafts: number };
  queues: { lawyerApprovals: number; subscriptionRequests: number };
  generatedAt: string;
};

const ROLE_LABEL: Record<string, string> = {
  client: "Clients",
  lawyer: "Lawyers",
  firm_admin: "Firm admins",
  platform_admin: "Super admins",
  mediator: "Mediators",
};

function DailyBars({ data, label }: { data: Daily[]; label: string }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="text-xs text-gray-500">{total} in 14 days</p>
      </div>
      <div className="mt-4 flex h-28 items-end gap-1.5" role="img" aria-label={`${label}: ${total} in the last 14 days`}>
        {data.map((d) => (
          <div key={d.date} className="group relative flex h-full flex-1 items-end">
            <div
              className={`w-full rounded-t ${d.count ? "bg-primary" : "bg-black/5"}`}
              style={{ height: d.count ? `${Math.max(8, (d.count / max) * 100)}%` : "4px" }}
            />
            <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-1.5 py-0.5 text-[10px] text-ivory opacity-0 group-hover:opacity-100">
              {new Date(d.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}: {d.count}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-gray-400">
        <span>{data[0] ? new Date(data[0].date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : ""}</span>
        <span>Today</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const json = await fetch("/api/v1/admin/overview", { cache: "no-store" }).then((r) => r.json()).catch(() => null);
    if (!json?.ok) {
      setError(json?.error?.message ?? "Failed to load overview");
      return;
    }
    setError(null);
    setData(json.data);
  }, []);

  usePolling(load, 30_000);

  const v = (n: number | undefined) => (data ? n ?? 0 : "—");

  const kpis = [
    { label: "New inquiries", value: v(data?.inquiries.new), sub: `${v(data?.inquiries.open)} open in total`, icon: Inbox, href: "/admin/inquiries", accent: true },
    { label: "Inquiries this week", value: v(data?.inquiries.lastWeek), sub: `${v(data?.inquiries.total)} all time`, icon: Radio, href: "/admin/inquiries" },
    { label: "Registered users", value: v(data?.users.total), sub: `${v(data?.users.lastWeek)} joined this week`, icon: Users, href: "/admin/users" },
    { label: "Published articles", value: v(data?.content.published), sub: `${v(data?.content.drafts)} drafts`, icon: Newspaper, href: "/admin/blog" },
  ];

  const queues = [
    { label: "High / urgent inquiries", value: data?.inquiries.urgent ?? 0, href: "/admin/inquiries", icon: AlertCircle },
    { label: "Lawyer approvals pending", value: data?.queues.lawyerApprovals ?? 0, href: "/admin/lawyers", icon: UserCheck },
    { label: "Plan requests pending", value: data?.queues.subscriptionRequests ?? 0, href: "/admin/subscriptions", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-on-light-muted">
          Live numbers from the website and platform. Refreshes every 30 seconds.
        </p>
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
          <Radio className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
          {data ? `Updated ${timeAgo(data.generatedAt)}` : "Loading…"}
        </span>
      </div>

      {error ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="alert">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Link
            key={k.label}
            href={k.href}
            className={`group rounded-2xl border bg-white p-5 transition-colors hover:border-primary ${k.accent ? "border-primary/40" : "border-[#e5e3dc]"}`}
          >
            <div className="flex items-center justify-between text-xs text-gray-500">
              {k.label}
              <k.icon className={`h-4 w-4 ${k.accent ? "text-primary" : "text-gray-400"}`} />
            </div>
            <p className="mt-3 font-serif text-4xl text-ink">{k.value}</p>
            <p className="mt-1 text-xs text-gray-500">{k.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#e5e3dc] bg-white p-5">
          {data ? <DailyBars data={data.inquiries.daily} label="Inquiries per day" /> : <div className="h-40" />}
        </section>
        <section className="rounded-2xl border border-[#e5e3dc] bg-white p-5">
          {data ? <DailyBars data={data.users.daily} label="New sign-ups per day" /> : <div className="h-40" />}
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-[#e5e3dc] bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg text-ink">Latest inquiries</h2>
            <Link href="/admin/inquiries" className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {data && data.inquiries.recent.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">No inquiries yet.</p>
          ) : (
            <ul className="mt-3 m-0 list-none divide-y divide-[#e5e3dc] p-0">
              {(data?.inquiries.recent ?? []).map((q) => (
                <li key={q.id}>
                  <Link href={`/admin/inquiries/${q.id}`} className="flex items-center justify-between gap-3 py-3 hover:text-primary">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink">{q.name}</span>
                      <span className="block truncate text-xs text-gray-500">
                        {q.organization || q.email}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLE[q.status] ?? ""}`}>
                        {STATUS_LABEL[q.status] ?? q.status}
                      </span>
                      <span className="w-14 text-right text-[11px] text-gray-500">{timeAgo(q.created_at)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-4">
          <section className="rounded-2xl border border-[#e5e3dc] bg-white p-5">
            <h2 className="font-serif text-lg text-ink">Needs attention</h2>
            <ul className="mt-3 m-0 list-none space-y-2 p-0">
              {queues.map((q) => (
                <li key={q.label}>
                  <Link href={q.href} className="flex items-center justify-between rounded-xl bg-[#faf9f6] px-3.5 py-2.5 text-sm hover:bg-primary/5">
                    <span className="flex items-center gap-2 text-ink">
                      <q.icon className="h-4 w-4 text-gray-400" /> {q.label}
                    </span>
                    <span className={`font-semibold ${q.value ? "text-primary" : "text-gray-400"}`}>{data ? q.value : "—"}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-[#e5e3dc] bg-white p-5">
            <h2 className="font-serif text-lg text-ink">Users by role</h2>
            <ul className="mt-3 m-0 list-none space-y-2 p-0 text-sm">
              {Object.entries(data?.users.byRole ?? {}).sort((a, b) => b[1] - a[1]).map(([role, n]) => (
                <li key={role} className="flex justify-between">
                  <span className="text-gray-600">{ROLE_LABEL[role] ?? role}</span>
                  <span className="font-semibold text-ink">{n}</span>
                </li>
              ))}
              {data && data.users.total === 0 ? <li className="text-gray-500">No users yet.</li> : null}
            </ul>
          </section>

          <section className="rounded-2xl border border-[#e5e3dc] bg-white p-5">
            <h2 className="font-serif text-lg text-ink">Quick actions</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { href: "/admin/blog/new", label: "Write article", icon: FilePlus2 },
                { href: "/admin/content/terms", label: "Edit Terms", icon: FileText },
                { href: "/admin/content/privacy", label: "Edit Privacy", icon: FileText },
                { href: "/admin/users", label: "View users", icon: Users },
              ].map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex items-center gap-2 rounded-xl border border-[#e5e3dc] px-3 py-2.5 text-xs font-semibold text-ink hover:border-primary hover:text-primary"
                >
                  <a.icon className="h-4 w-4" /> {a.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
