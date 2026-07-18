"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/app/app-shell";
import type { PlatformKpis } from "@/features/enterprise";

const links = [
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/insights", label: "Insights" },
  { href: "/admin/audit", label: "Audit center" },
  { href: "/admin/billing", label: "Billing" },
  { href: "/admin/lawyers", label: "Lawyer approvals" },
  { href: "/admin/ads", label: "Ads moderation" },
  { href: "/admin/coi", label: "COI screens" },
  { href: "/admin/compliance", label: "Compliance" },
];

export default function AdminHome() {
  const [kpis, setKpis] = useState<PlatformKpis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/v1/admin/analytics");
        const json = await res.json();
        if (!json.ok) {
          setError(json.error?.message ?? "Failed to load KPIs");
          return;
        }
        setKpis(json.data.kpis);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      }
    })();
  }, []);

  return (
    <AppShell role="admin" title="Platform admin">
      <p className="text-text-on-light-muted mb-8">
        Operate the marketplace — approvals, COI, billing, and compliance.
      </p>

      {error && (
        <p className="text-sm text-red-700 mb-4" role="alert">
          {error}
        </p>
      )}

      {kpis && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <Kpi label="Users" value={kpis.usersTotal} />
          <Kpi label="Leads open" value={kpis.leadsOpen} />
          <Kpi label="GMV" value={kpis.gmv} prefix="" />
          <Kpi label="Escrow held" value={kpis.escrowHeld} />
          <Kpi label="Pending approvals" value={kpis.pendingLawyerApprovals} />
          <Kpi label="Pending ads" value={kpis.pendingAds} />
          <Kpi label="Meetings" value={kpis.meetingsTotal} />
          <Kpi label="COI screens" value={kpis.coiScreens} />
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="border border-black/10 bg-white p-5 hover:border-black/30 transition-colors"
          >
            <h2 className="font-serif text-xl">{l.label}</h2>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}

function Kpi({
  label,
  value,
  prefix,
}: {
  label: string;
  value: number;
  prefix?: string;
}) {
  return (
    <div className="border border-black/10 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-text-on-light-muted">
        {label}
      </p>
      <p className="font-serif text-2xl mt-1">
        {prefix}
        {typeof value === "number" && label === "GMV"
          ? value.toLocaleString(undefined, { maximumFractionDigits: 0 })
          : value}
      </p>
    </div>
  );
}
