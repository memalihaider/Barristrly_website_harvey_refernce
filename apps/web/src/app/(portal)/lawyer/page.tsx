"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/app/app-shell";
import Link from "next/link";
import NextBestActionBanner from "@/components/portal/next-best-action";
import type { LawyerInsights, NextBestAction } from "@/features/intelligence";

export default function LawyerHome() {
  const [stats, setStats] = useState({
    clients: 0,
    pipeline: 0,
    meetings: 0,
    upcomingDeadlines: 0,
  });
  const [insights, setInsights] = useState<LawyerInsights | null>(null);
  const [primary, setPrimary] = useState<NextBestAction | null>(null);
  const [secondary, setSecondary] = useState<NextBestAction[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/v1/lawyer/clients").then((r) => r.json()),
      fetch("/api/v1/lawyer/pipeline").then((r) => r.json()),
      fetch("/api/v1/bookings").then((r) => r.json()),
      fetch("/api/v1/lawyer/deadlines").then((r) => r.json()),
      fetch("/api/v1/lawyer/insights").then((r) => r.json()),
    ]).then(([c, p, b, d, i]) => {
      setStats({
        clients: c.ok ? c.data.count ?? 0 : 0,
        pipeline: p.ok ? p.data.total ?? 0 : 0,
        meetings: b.ok ? (b.data.bookings ?? []).length : 0,
        upcomingDeadlines: d.ok ? d.data.upcomingCount ?? 0 : 0,
      });
      if (i.ok) {
        setInsights(i.data.insights);
        setPrimary(i.data.primary ?? null);
        setSecondary(i.data.secondary ?? []);
      }
    });
  }, []);

  return (
    <AppShell role="lawyer" title="Lawyer overview">
      <p className="text-text-on-light-muted mb-8">
        Practice core plus litigation deadlines and contract lifecycle.
      </p>

      <NextBestActionBanner
        primary={primary}
        secondary={secondary}
        title="Recommended next step"
      />

      {insights && (
        <section className="mb-10">
          <h2 className="font-serif text-lg mb-3">Insights</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <Metric
              label="Match→meeting"
              value={`${(insights.conversionMatchToMeeting * 100).toFixed(0)}%`}
            />
            <Metric label="Matches" value={String(insights.matchesSuggested)} />
            <Metric label="Meetings" value={String(insights.meetingsBooked)} />
            <Metric label="Escrow held" value={String(insights.escrowHeld)} />
          </div>
        </section>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/lawyer/leads" className="border border-black/10 bg-white p-5">
          <h2 className="font-serif text-xl">Pipeline</h2>
          <p className="text-sm text-text-muted mt-1">{stats.pipeline} leads</p>
        </Link>
        <Link href="/lawyer/clients" className="border border-black/10 bg-white p-5">
          <h2 className="font-serif text-xl">Clients</h2>
          <p className="text-sm text-text-muted mt-1">{stats.clients} contacts</p>
        </Link>
        <Link href="/lawyer/calendar" className="border border-black/10 bg-white p-5">
          <h2 className="font-serif text-xl">Calendar</h2>
          <p className="text-sm text-text-muted mt-1">{stats.meetings} meetings</p>
        </Link>
        <Link
          href="/lawyer/deadlines"
          className="border border-black/10 bg-white p-5"
        >
          <h2 className="font-serif text-xl">Deadlines</h2>
          <p className="text-sm text-text-muted mt-1">
            {stats.upcomingDeadlines} due in 14d
          </p>
        </Link>
        <Link href="/lawyer/matters" className="border border-black/10 bg-white p-5">
          <h2 className="font-serif text-xl">Matters</h2>
          <p className="text-sm text-text-muted mt-1">Engaged work</p>
        </Link>
        <Link href="/lawyer/profile" className="border border-black/10 bg-white p-5">
          <h2 className="font-serif text-xl">Profile</h2>
          <p className="text-sm text-text-muted mt-1">Match-pool fields</p>
        </Link>
        <Link
          href="/lawyer/accounting"
          className="border border-black/10 bg-white p-5"
        >
          <h2 className="font-serif text-xl">Accounting</h2>
          <p className="text-sm text-text-muted mt-1">Ledger & audit</p>
        </Link>
      </div>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-black/10 bg-white p-3">
      <p className="text-xs uppercase text-text-on-light-muted">{label}</p>
      <p className="font-serif text-xl mt-1">{value}</p>
    </div>
  );
}
