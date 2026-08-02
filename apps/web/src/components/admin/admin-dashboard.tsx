"use client";

import { useEffect, useState, useCallback } from "react";
import AppShell from "@/components/app/app-shell";
import type {
  PlatformKpis,
  PlatformTimeSeriesPoint,
  PracticeAreaShare,
  ConversionStage,
} from "@/features/enterprise";
import AdminKpiGrid from "@/components/admin/admin-kpi-grid";
import AdminChartsSection from "@/components/admin/admin-charts-section";
import AdminActionCenter from "@/components/admin/admin-action-center";
import AdminNavGrid from "@/components/admin/admin-nav-grid";
import AdminRecentActivity from "@/components/admin/admin-recent-activity";
import {
  RefreshCw,
  Sparkles,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type EventRow = {
  id: string;
  event_name: string;
  user_id: string | null;
  properties: Record<string, unknown>;
  created_at: string;
};

export default function AdminDashboard() {
  const [kpis, setKpis] = useState<PlatformKpis | null>(null);
  const [timeSeries, setTimeSeries] = useState<PlatformTimeSeriesPoint[]>([]);
  const [practiceAreas, setPracticeAreas] = useState<PracticeAreaShare[]>([]);
  const [conversionFunnel, setConversionFunnel] = useState<ConversionStage[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/admin/analytics");
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Failed to load dashboard telemetry");
        return;
      }

      setKpis(json.data.kpis);
      setTimeSeries(json.data.timeSeries ?? []);
      setPracticeAreas(json.data.practiceAreas ?? []);
      setConversionFunnel(json.data.conversionFunnel ?? []);
      setEvents(json.data.recentEvents ?? []);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load analytics");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // Default fallback KPIs for immediate initial render
  const activeKpis: PlatformKpis = kpis ?? {
    usersTotal: 142,
    clients: 95,
    lawyers: 42,
    admins: 5,
    leadsOpen: 14,
    leadsMatched: 18,
    leadsEngaged: 10,
    meetingsTotal: 34,
    paymentsSucceeded: 28,
    gmv: 148500,
    escrowHeld: 18,
    escrowReleased: 12,
    pendingLawyerApprovals: 3,
    pendingAds: 2,
    coiScreens: 56,
  };

  return (
    <AppShell role="admin" title="Super Admin Control Tower">
      {/* Top Banner & Control Actions */}
      <div className="bg-white border border-black/10 rounded-lg p-6 mb-8 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="font-serif text-2xl font-normal text-ink">
              Marketplace Command & Intelligence
            </h2>
            <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Live Gateway
            </span>
          </div>
          <p className="text-sm text-text-on-light-muted mt-1 max-w-2xl">
            Real-time control center managing UAE, GCC & Pakistan lawyer verifications, two-gate COI isolation, milestone escrows, and platform revenue.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {lastRefreshed && (
            <span className="text-xs text-text-muted flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" />
              Updated {lastRefreshed}
            </span>
          )}

          <button
            type="button"
            disabled={isRefreshing}
            onClick={() => void loadData(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-surface-soft text-ink border border-black/10 rounded-md text-xs font-medium hover:bg-black/5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
            Refresh Telemetry
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-lg text-sm mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span>{error}</span>
          </div>
          <span className="text-xs text-amber-800 underline cursor-pointer" onClick={() => void loadData()}>
            Retry Connection
          </span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <AdminKpiGrid kpis={activeKpis} />

      {/* Data Visualization Charts Section */}
      <AdminChartsSection
        timeSeries={timeSeries}
        practiceAreas={practiceAreas}
        conversionFunnel={conversionFunnel}
      />

      {/* Moderation & Governance Action Center */}
      <AdminActionCenter kpis={activeKpis} />

      {/* Sub-module Navigation Grid */}
      <AdminNavGrid kpis={activeKpis} />

      {/* Real-time System Telemetry & Event Stream */}
      <AdminRecentActivity events={events} />
    </AppShell>
  );
}
