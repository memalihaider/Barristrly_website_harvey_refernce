"use client";

import Link from "next/link";
import type { PlatformKpis } from "@/features/enterprise";
import {
  UserCheck,
  Megaphone,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Lock,
  Scale,
  FileCheck,
} from "lucide-react";

interface AdminActionCenterProps {
  kpis: PlatformKpis;
}

export default function AdminActionCenter({ kpis }: AdminActionCenterProps) {
  const pendingApprovalsCount = kpis.pendingLawyerApprovals || 3;
  const pendingAdsCount = kpis.pendingAds || 2;

  const mockApprovals = [
    {
      id: "lawyer-1",
      name: "Tariq Al-Mansoori",
      firm: "Al-Mansoori & Partners (Dubai)",
      jurisdiction: "UAE Federal Supreme Court",
      experience: "14 Years · Corporate & Arbitration",
      date: "Today, 08:30 AM",
    },
    {
      id: "lawyer-2",
      name: "Fatima Khan",
      firm: "Khan & Co Legal Consultants (Lahore)",
      jurisdiction: "Lahore High Court",
      experience: "9 Years · Commercial Litigation",
      date: "Yesterday",
    },
  ];

  const mockAds = [
    {
      id: "ad-1",
      title: "FinTech & DIFC Regulatory Advisory",
      lawyer: "Zayed Corporate Law Group",
      tier: "Featured Banner",
      date: "2 hours ago",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Moderation Queue (2 Cols) */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <h2 className="font-serif text-xl font-normal text-ink">
              Moderation & Verification Action Hub
            </h2>
          </div>
          <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full">
            {pendingApprovalsCount + pendingAdsCount} Items Pending
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pending Lawyer Approvals Card */}
          <div className="bg-white border border-black/10 rounded-lg p-5 flex flex-col justify-between hover:border-black/20 transition-all shadow-2xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded bg-primary/10 text-primary">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-lg font-normal text-ink">
                    Lawyer Approvals
                  </h3>
                </div>
                <span className="text-xs font-mono font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {pendingApprovalsCount} Gate Checks
                </span>
              </div>

              <p className="text-xs text-text-on-light-muted mb-4">
                Verify bar credentials, practicing licenses, and identity before granting match pool access.
              </p>

              <div className="space-y-3 mb-4">
                {mockApprovals.slice(0, 2).map((app) => (
                  <div
                    key={app.id}
                    className="p-3 bg-surface-soft rounded-md text-xs border border-black/5"
                  >
                    <div className="flex items-center justify-between font-semibold text-ink">
                      <span>{app.name}</span>
                      <span className="text-[10px] text-text-muted font-normal">
                        {app.date}
                      </span>
                    </div>
                    <div className="text-text-on-light-muted mt-0.5">{app.firm}</div>
                    <div className="text-[11px] text-primary font-medium mt-1">
                      {app.jurisdiction}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/admin/lawyers"
              className="inline-flex items-center justify-center gap-2 w-full py-2 bg-ink text-ivory text-xs font-medium rounded-md hover:bg-black transition-colors"
            >
              Review Verification Queue ({pendingApprovalsCount})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Pending Ads Moderation Card */}
          <div className="bg-white border border-black/10 rounded-lg p-5 flex flex-col justify-between hover:border-black/20 transition-all shadow-2xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded bg-primary/10 text-primary">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-lg font-normal text-ink">
                    Ads Moderation
                  </h3>
                </div>
                <span className="text-xs font-mono font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {pendingAdsCount} Pending
                </span>
              </div>

              <p className="text-xs text-text-on-light-muted mb-4">
                Review lawyer promotional placements to ensure compliance with legal advertising ethics.
              </p>

              <div className="space-y-3 mb-4">
                {mockAds.map((ad) => (
                  <div
                    key={ad.id}
                    className="p-3 bg-surface-soft rounded-md text-xs border border-black/5"
                  >
                    <div className="flex items-center justify-between font-semibold text-ink">
                      <span>{ad.title}</span>
                      <span className="text-[10px] text-text-muted font-normal">
                        {ad.date}
                      </span>
                    </div>
                    <div className="text-text-on-light-muted mt-0.5">{ad.lawyer}</div>
                    <div className="text-[11px] text-primary font-medium mt-1">
                      Tier: {ad.tier}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/admin/ads"
              className="inline-flex items-center justify-center gap-2 w-full py-2 bg-white border border-black/20 text-ink text-xs font-medium rounded-md hover:border-primary hover:text-primary transition-colors"
            >
              Manage Ads Placements ({pendingAdsCount})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Compliance & Governance Safeguards (1 Col) */}
      <div className="bg-white border border-black/10 rounded-lg p-5 flex flex-col justify-between shadow-2xs">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-normal text-ink">
              System Governance Controls
            </h3>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>

          <p className="text-xs text-text-on-light-muted mb-4">
            Automated compliance gates safeguarding two-party escrow and conflict isolation.
          </p>

          <div className="space-y-3">
            <div className="p-3 rounded-md bg-emerald-50/60 border border-emerald-200/60 flex items-start gap-3">
              <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-emerald-950">
                  Escrow Dual Confirmation
                </div>
                <div className="text-[11px] text-emerald-800 mt-0.5">
                  Milestone funds released strictly upon mutual client + lawyer digital consent.
                </div>
              </div>
            </div>

            <div className="p-3 rounded-md bg-surface-soft border border-black/5 flex items-start gap-3">
              <Scale className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-ink">
                  COI Screen Before Contact
                </div>
                <div className="text-[11px] text-text-on-light-muted mt-0.5">
                  Adverse party checks execute before identity parameters are disclosed.
                </div>
              </div>
            </div>

            <div className="p-3 rounded-md bg-surface-soft border border-black/5 flex items-start gap-3">
              <FileCheck className="w-4 h-4 text-ink shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-ink">
                  Tamper-Evident Audit Logs
                </div>
                <div className="text-[11px] text-text-on-light-muted mt-0.5">
                  All administrative actions and pipeline status transitions are logged.
                </div>
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/admin/compliance"
          className="mt-4 text-xs text-primary hover:text-primary-hover font-semibold inline-flex items-center gap-1"
        >
          View Full Compliance Dashboard & Audit Rules →
        </Link>
      </div>
    </div>
  );
}
