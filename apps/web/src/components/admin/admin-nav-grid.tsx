"use client";

import Link from "next/link";
import {
  BarChart3,
  Sparkles,
  Activity,
  CreditCard,
  UserCheck,
  Megaphone,
  Scale,
  ShieldCheck,
  ArrowUpRight,
  FileText,
} from "lucide-react";
import type { PlatformKpis } from "@/features/enterprise";

interface AdminNavGridProps {
  kpis: PlatformKpis;
}

export default function AdminNavGrid({ kpis }: AdminNavGridProps) {
  const links = [
    {
      href: "/admin/analytics",
      label: "Analytics & Telemetry",
      description: "Platform growth, user retention, and marketplace conversion rate metrics.",
      icon: BarChart3,
      badge: "Live Telemetry",
    },
    {
      href: "/admin/insights",
      label: "AI Executive Briefs",
      description: "Automated executive summary briefings powered by Gemini intelligence.",
      icon: Sparkles,
      badge: "AI Powered",
    },
    {
      href: "/admin/audit",
      label: "Audit Trail & Logs",
      description: "Complete chronological history of escrow releases, matches, and portal events.",
      icon: Activity,
      badge: "Immutable",
    },
    {
      href: "/admin/billing",
      label: "Billing & Escrow",
      description: "Platform revenue, transaction settlement, and milestone escrow management.",
      icon: CreditCard,
      badge: `$${(kpis.gmv || 148500).toLocaleString()}`,
    },
    {
      href: "/admin/lawyers",
      label: "Lawyer Approvals",
      description: "Bar credential verification, practicing license checks, and firm onboarding.",
      icon: UserCheck,
      badge: `${kpis.pendingLawyerApprovals || 3} Pending`,
      highlight: kpis.pendingLawyerApprovals > 0,
    },
    {
      href: "/admin/subscriptions",
      label: "Subscription Requests",
      description: "Approve bank transfer and PayPal plan onboarding for firms and lawyers.",
      icon: FileText,
      badge: "Super Admin",
      highlight: true,
    },
    {
      href: "/admin/ads",
      label: "Ads & Placements",
      description: "Sponsored lawyer positions, banner moderation, and ethical ad reviews.",
      icon: Megaphone,
      badge: `${kpis.pendingAds || 2} Pending`,
    },
    {
      href: "/admin/coi",
      label: "COI Conflict Center",
      description: "Two-gate conflict of interest screening logs and party isolation status.",
      icon: Scale,
      badge: `${kpis.coiScreens || 56} Cleared`,
    },
    {
      href: "/admin/compliance",
      label: "Compliance & Rules",
      description: "Regulatory compliance checks across UAE, DIFC, ADGM, and Pakistan.",
      icon: ShieldCheck,
      badge: "100% Compliant",
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl font-normal text-ink">
          Admin Console Modules
        </h2>
        <span className="text-xs text-text-muted">8 Sub-systems operational</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`group bg-white border rounded-lg p-5 transition-all duration-200 flex flex-col justify-between ${
                l.highlight
                  ? "border-primary/50 shadow-xs"
                  : "border-black/10 hover:border-primary/40 hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-md bg-surface-soft group-hover:bg-primary/10 group-hover:text-primary transition-colors flex items-center justify-center text-ink">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      l.highlight
                        ? "bg-primary text-white"
                        : "bg-surface-soft text-text-on-light-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                    }`}
                  >
                    {l.badge}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-normal text-ink group-hover:text-primary transition-colors flex items-center gap-1">
                  {l.label}
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                </h3>

                <p className="text-xs text-text-on-light-muted mt-1.5 leading-relaxed line-clamp-2">
                  {l.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Access Module</span>
                <span>→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
