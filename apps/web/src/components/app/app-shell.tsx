"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Sparkles,
  ShieldCheck,
  CreditCard,
  UserCheck,
  Megaphone,
  Scale,
  FileText,
  Activity,
  Layers as LayersIcon,
  ChevronRight,
  Shield,
  Briefcase,
  Users,
} from "lucide-react";

const navByRole = {
  client: [
    { href: "/client", label: "Overview", icon: LayoutDashboard },
    { href: "/client/intake", label: "AI Intake", icon: Sparkles },
    { href: "/client/matches", label: "Matches", icon: Users },
    { href: "/client/bookings", label: "Bookings", icon: Briefcase },
    { href: "/client/matters", label: "Matters", icon: FileText },
  ],
  lawyer: [
    { href: "/lawyer", label: "Overview", icon: LayoutDashboard },
    { href: "/lawyer/leads", label: "Pipeline", icon: Activity },
    { href: "/lawyer/clients", label: "Clients", icon: Users },
    { href: "/lawyer/calendar", label: "Calendar", icon: Briefcase },
    { href: "/lawyer/deadlines", label: "Deadlines", icon: ShieldCheck },
    { href: "/lawyer/matters", label: "Matters", icon: FileText },
    { href: "/lawyer/profile", label: "Profile", icon: Scale },
    { href: "/lawyer/accounting", label: "Accounting", icon: CreditCard },
  ],
  admin: [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/insights", label: "Insights", icon: Sparkles },
    { href: "/admin/audit", label: "Audit Center", icon: Activity },
    { href: "/admin/billing", label: "Billing", icon: CreditCard },
    { href: "/admin/subscriptions", label: "Subscriptions", icon: FileText },
    { href: "/admin/lawyers", label: "Lawyer Approvals", icon: UserCheck },
    { href: "/admin/ads", label: "Ads Moderation", icon: Megaphone },
    { href: "/admin/coi", label: "COI Flags", icon: Scale },
    { href: "/admin/compliance", label: "Compliance", icon: ShieldCheck },
  ],
} as const;

export type AppShellRole = keyof typeof navByRole;

export default function AppShell({
  role,
  title,
  children,
}: {
  role: AppShellRole;
  title: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const links = navByRole[role];

  return (
    <div className="min-h-dvh bg-ivory text-ink flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-black/10 bg-white p-5 hidden md:flex flex-col gap-6 shadow-sm">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white shadow-sm">
            <LayersIcon className="w-4 h-4" />
          </div>
          <Link href="/" className="font-serif text-2xl tracking-tight font-normal text-ink hover:text-primary transition-colors">
            Layers
          </Link>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          {links.map((l) => {
            const Icon = l.icon;
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium border-l-3 border-primary shadow-2xs"
                    : "text-text-on-light-muted hover:bg-surface-soft hover:text-ink"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-text-muted"}`} />
                <span>{l.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-primary" />}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-black/10 flex items-center justify-between px-2 text-xs text-text-muted">
          <span className="flex items-center gap-1.5 capitalize font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {role} Console
          </span>
          <span className="bg-surface-soft px-2 py-0.5 rounded text-[10px] font-mono text-text-on-light-muted">v2.4</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-black/10 bg-white px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md bg-white/95">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl md:text-3xl tracking-tight text-ink">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
              <Shield className="w-3.5 h-3.5" />
              Super Admin Mode
            </span>
            <Link
              href="/login"
              className="text-xs font-medium px-4 py-2 rounded-md bg-ink text-ivory hover:bg-black transition-colors"
            >
              Sign out
            </Link>
          </div>
        </header>

        <main className="p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto flex-1">{children}</main>
      </div>
    </div>
  );
}

