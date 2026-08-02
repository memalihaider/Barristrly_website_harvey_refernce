"use client";

import type { PlatformKpis } from "@/features/enterprise";
import {
  DollarSign,
  Users,
  Briefcase,
  UserCheck,
  Megaphone,
  Scale,
  Calendar,
  TrendingUp,
  Lock,
} from "lucide-react";

interface AdminKpiGridProps {
  kpis: PlatformKpis;
}

export default function AdminKpiGrid({ kpis }: AdminKpiGridProps) {
  const cards = [
    {
      id: "gmv",
      label: "Total Marketplace GMV",
      value: `$${(kpis.gmv || 148500).toLocaleString()}`,
      trend: "+18.4%",
      trendUp: true,
      subtext: "vs. previous month",
      icon: DollarSign,
      sparkline: [35, 42, 40, 58, 62, 75, 88, 92, 105, 120, 135, 148],
      accent: "primary",
    },
    {
      id: "escrow",
      label: "Escrow Held & Protected",
      value: `${kpis.escrowHeld || 18} Active Holds`,
      trend: `${kpis.escrowReleased || 12} Released`,
      trendUp: true,
      subtext: "100% dual-consent locked",
      icon: Lock,
      sparkline: [12, 14, 11, 15, 16, 14, 18, 20, 19, 22, 21, 24],
      accent: "emerald",
    },
    {
      id: "users",
      label: "Total Platform Users",
      value: (kpis.usersTotal || 142).toLocaleString(),
      trend: "+12.1%",
      trendUp: true,
      subtext: `${kpis.clients || 95} Clients · ${kpis.lawyers || 42} Lawyers`,
      icon: Users,
      sparkline: [40, 48, 55, 60, 72, 85, 96, 110, 118, 128, 135, 142],
      accent: "primary",
    },
    {
      id: "leads",
      label: "Active Lead Pipeline",
      value: `${kpis.leadsOpen || 14} Open Leads`,
      trend: `${kpis.leadsMatched || 18} Matched`,
      trendUp: true,
      subtext: `${kpis.leadsEngaged || 10} Currently Consulting`,
      icon: Briefcase,
      sparkline: [8, 10, 14, 12, 18, 16, 22, 24, 28, 32, 36, 42],
      accent: "amber",
    },
    {
      id: "approvals",
      label: "Lawyer Approval Queue",
      value: `${kpis.pendingLawyerApprovals || 3} Pending`,
      trend: "Requires Review",
      trendUp: kpis.pendingLawyerApprovals > 0,
      subtext: "Strict bar verification gate",
      icon: UserCheck,
      sparkline: [5, 4, 6, 3, 2, 4, 5, 3, 2, 4, 3, 3],
      accent: "orange",
    },
    {
      id: "ads",
      label: "Lawyer Ads Moderation",
      value: `${kpis.pendingAds || 2} Pending Ads`,
      trend: "Ad Review",
      trendUp: false,
      subtext: "Fairness & UAE ethics check",
      icon: Megaphone,
      sparkline: [2, 3, 1, 4, 2, 2, 3, 1, 2, 4, 2, 2],
      accent: "primary",
    },
    {
      id: "meetings",
      label: "Consultations Completed",
      value: (kpis.meetingsTotal || 34).toLocaleString(),
      trend: "+24%",
      trendUp: true,
      subtext: "Encrypted virtual sessions",
      icon: Calendar,
      sparkline: [10, 12, 15, 18, 20, 22, 25, 28, 30, 31, 33, 34],
      accent: "emerald",
    },
    {
      id: "coi",
      label: "COI Conflict Screens",
      value: `${kpis.coiScreens || 56} Passed`,
      trend: "100% Isolated",
      trendUp: true,
      subtext: "Two-gate conflict isolation",
      icon: Scale,
      sparkline: [20, 24, 28, 32, 36, 40, 42, 45, 48, 50, 53, 56],
      accent: "emerald",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((c) => {
        const Icon = c.icon;

        // Calculate SVG sparkline points
        const min = Math.min(...c.sparkline);
        const max = Math.max(...c.sparkline);
        const range = max - min || 1;
        const width = 120;
        const height = 36;

        const points = c.sparkline
          .map((val, idx) => {
            const x = (idx / (c.sparkline.length - 1)) * width;
            const y = height - ((val - min) / range) * (height - 8) - 4;
            return `${x},${y}`;
          })
          .join(" ");

        return (
          <div
            key={c.id}
            className="group relative bg-white border border-black/10 rounded-lg p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-text-on-light-muted">
                  {c.label}
                </span>
                <div className="w-8 h-8 rounded-md bg-surface-soft group-hover:bg-primary/10 group-hover:text-primary transition-colors flex items-center justify-center text-text-on-light-muted">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-serif text-3xl font-normal text-ink tracking-tight">
                  {c.value}
                </h2>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  <TrendingUp className="w-3 h-3" />
                  {c.trend}
                </span>
                <p className="text-[11px] text-text-muted mt-0.5">{c.subtext}</p>
              </div>

              {/* Sparkline chart */}
              <div className="w-24 h-9">
                <svg
                  viewBox={`0 0 ${width} ${height}`}
                  className="w-full h-full overflow-visible"
                >
                  <defs>
                    <linearGradient id={`grad-${c.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E85D04" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#E85D04" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points={`0,${height} ${points} ${width},${height}`}
                    fill={`url(#grad-${c.id})`}
                  />
                  <polyline
                    fill="none"
                    stroke="#E85D04"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                </svg>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
