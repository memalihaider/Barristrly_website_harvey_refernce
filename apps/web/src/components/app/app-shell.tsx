import Link from "next/link";
import type { ReactNode } from "react";

const navByRole = {
  client: [
    { href: "/client", label: "Overview" },
    { href: "/client/intake", label: "AI Intake" },
    { href: "/client/matches", label: "Matches" },
    { href: "/client/bookings", label: "Bookings" },
    { href: "/client/matters", label: "Matters" },
  ],
  lawyer: [
    { href: "/lawyer", label: "Overview" },
    { href: "/lawyer/leads", label: "Pipeline" },
    { href: "/lawyer/clients", label: "Clients" },
    { href: "/lawyer/calendar", label: "Calendar" },
    { href: "/lawyer/deadlines", label: "Deadlines" },
    { href: "/lawyer/matters", label: "Matters" },
    { href: "/lawyer/profile", label: "Profile" },
    { href: "/lawyer/accounting", label: "Accounting" },
  ],
  admin: [
    { href: "/admin", label: "Overview" },
    { href: "/admin/analytics", label: "Analytics" },
    { href: "/admin/insights", label: "Insights" },
    { href: "/admin/audit", label: "Audit" },
    { href: "/admin/billing", label: "Billing" },
    { href: "/admin/lawyers", label: "Lawyer Approvals" },
    { href: "/admin/ads", label: "Ads" },
    { href: "/admin/coi", label: "COI Flags" },
    { href: "/admin/compliance", label: "Compliance" },
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
  const links = navByRole[role];

  return (
    <div className="min-h-dvh bg-ivory text-ink flex">
      <aside className="w-56 shrink-0 border-r border-black/10 bg-white p-5 hidden md:flex flex-col gap-6">
        <Link href="/" className="font-serif text-xl tracking-tight">
          Layers
        </Link>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-sm px-3 py-2 text-sm text-text-on-light-muted hover:bg-surface-soft hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto text-xs text-text-muted capitalize">{role} portal</div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-black/10 bg-white px-6 py-4 flex items-center justify-between">
          <h1 className="font-serif text-2xl tracking-tight">{title}</h1>
          <Link
            href="/login"
            className="text-sm font-semibold text-primary hover:text-primary-hover"
          >
            Sign in
          </Link>
        </header>
        <main className="p-6 md:p-8 max-w-5xl w-full">{children}</main>
      </div>
    </div>
  );
}
