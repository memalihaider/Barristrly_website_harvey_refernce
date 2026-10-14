import type { LucideIcon } from "lucide-react";
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
  Home,
  Briefcase,
  Landmark,
  Shield,
  Settings,
  Users,
  Search,
  Calendar,
  ClipboardList,
  UserCircle,
  Inbox,
  Newspaper,
  FilePlus2,
  ExternalLink,
} from "lucide-react";

export type PortalRole = "client" | "lawyer" | "admin";

export type ContextNavItem = {
  href: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  badge?: string;
  /** Live count fetched by the shell (e.g. new inquiries). */
  liveBadge?: "inquiries";
};

export type RailItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  sidebarTitle: string;
  sidebarSubtitle: string;
  items: ContextNavItem[];
};

export type PortalMeta = {
  role: PortalRole;
  brandLabel: string;
  badgeLabel: string;
  homeHref: string;
  storageKey: string;
  rails: RailItem[];
};

export const CLIENT_RAILS: RailItem[] = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    href: "/client",
    sidebarTitle: "Client workspace",
    sidebarSubtitle: "Overview and next steps",
    items: [
      {
        href: "/client",
        label: "Overview",
        description: "Status, matches, and bookings",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: "find",
    label: "Find",
    icon: Search,
    href: "/client/intake",
    sidebarTitle: "Find counsel",
    sidebarSubtitle: "Intake and anonymous matching",
    items: [
      {
        href: "/client/intake",
        label: "AI Intake",
        description: "Describe your matter privately",
        icon: Sparkles,
      },
      {
        href: "/client/matches",
        label: "Matches",
        description: "Anonymous lawyer shortlist",
        icon: Users,
      },
    ],
  },
  {
    id: "work",
    label: "Work",
    icon: Briefcase,
    href: "/client/bookings",
    sidebarTitle: "Active work",
    sidebarSubtitle: "Meetings and matters",
    items: [
      {
        href: "/client/bookings",
        label: "Bookings",
        description: "Confidential meetings",
        icon: Calendar,
      },
      {
        href: "/client/matters",
        label: "Matters",
        description: "Engaged files and next actions",
        icon: FileText,
      },
    ],
  },
  {
    id: "more",
    label: "More",
    icon: Settings,
    href: "/client",
    sidebarTitle: "Shortcuts",
    sidebarSubtitle: "Site and account",
    items: [
      {
        href: "/client",
        label: "Client home",
        description: "Back to overview",
        icon: LayoutDashboard,
      },
      {
        href: "/",
        label: "Marketing site",
        description: "Public Barristrly homepage",
        icon: Search,
      },
    ],
  },
];

export const LAWYER_RAILS: RailItem[] = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    href: "/lawyer",
    sidebarTitle: "Practice home",
    sidebarSubtitle: "Pipeline snapshot",
    items: [
      {
        href: "/lawyer",
        label: "Overview",
        description: "Leads, calendar, and revenue",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: "practice",
    label: "Practice",
    icon: Briefcase,
    href: "/lawyer/leads",
    sidebarTitle: "Practice",
    sidebarSubtitle: "Pipeline, clients & matters",
    items: [
      {
        href: "/lawyer/leads",
        label: "Pipeline",
        description: "Inbound leads and stages",
        icon: Activity,
      },
      {
        href: "/lawyer/clients",
        label: "Clients",
        description: "Active client relationships",
        icon: Users,
      },
      {
        href: "/lawyer/matters",
        label: "Matters",
        description: "Open files and work product",
        icon: FileText,
      },
    ],
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: Calendar,
    href: "/lawyer/calendar",
    sidebarTitle: "Schedule",
    sidebarSubtitle: "Meetings and deadlines",
    items: [
      {
        href: "/lawyer/calendar",
        label: "Calendar",
        description: "Bookings and availability",
        icon: Calendar,
      },
      {
        href: "/lawyer/deadlines",
        label: "Deadlines",
        description: "Filings and reminders",
        icon: ClipboardList,
      },
    ],
  },
  {
    id: "business",
    label: "Business",
    icon: Landmark,
    href: "/lawyer/accounting",
    sidebarTitle: "Business",
    sidebarSubtitle: "Profile and accounting",
    items: [
      {
        href: "/lawyer/accounting",
        label: "Accounting",
        description: "Fees, escrow, and payouts",
        icon: CreditCard,
      },
      {
        href: "/lawyer/profile",
        label: "Profile",
        description: "Practice card and visibility",
        icon: UserCircle,
      },
    ],
  },
  {
    id: "more",
    label: "More",
    icon: Settings,
    href: "/lawyer",
    sidebarTitle: "Shortcuts",
    sidebarSubtitle: "Site and account",
    items: [
      {
        href: "/lawyer",
        label: "Lawyer home",
        description: "Back to overview",
        icon: LayoutDashboard,
      },
      {
        href: "/",
        label: "Marketing site",
        description: "Public Barristrly homepage",
        icon: Search,
      },
    ],
  },
];

export const ADMIN_RAILS: RailItem[] = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    href: "/admin",
    sidebarTitle: "Control Tower",
    sidebarSubtitle: "Live platform overview",
    items: [
      {
        href: "/admin",
        label: "Overview",
        description: "Live KPIs and queues",
        icon: LayoutDashboard,
      },
      {
        href: "/admin/inquiries",
        label: "Inquiries",
        description: "Website form submissions",
        icon: Inbox,
        liveBadge: "inquiries",
      },
      {
        href: "/admin/users",
        label: "Users",
        description: "All registered accounts",
        icon: Users,
      },
    ],
  },
  {
    id: "inquiries",
    label: "Inquiries",
    icon: Inbox,
    href: "/admin/inquiries",
    sidebarTitle: "Inquiries",
    sidebarSubtitle: "Respond, assign and track",
    items: [
      {
        href: "/admin/inquiries",
        label: "All inquiries",
        description: "Filter, search and export",
        icon: Inbox,
        liveBadge: "inquiries",
      },
      {
        href: "/request-demo",
        label: "Inquiry form",
        description: "The public form visitors use",
        icon: ExternalLink,
      },
    ],
  },
  {
    id: "content",
    label: "Content",
    icon: Newspaper,
    href: "/admin/blog",
    sidebarTitle: "Website content",
    sidebarSubtitle: "Blog and legal pages",
    items: [
      {
        href: "/admin/blog/new",
        label: "Write article",
        description: "Open the rich editor",
        icon: FilePlus2,
      },
      {
        href: "/admin/blog",
        label: "Blog articles",
        description: "Drafts and published posts",
        icon: Newspaper,
      },
      {
        href: "/admin/content",
        label: "Legal pages",
        description: "Terms and Privacy Policy",
        icon: FileText,
      },
    ],
  },
  {
    id: "ops",
    label: "Ops",
    icon: Briefcase,
    href: "/admin/lawyers",
    sidebarTitle: "Operations",
    sidebarSubtitle: "Approvals and onboarding",
    items: [
      {
        href: "/admin/lawyers",
        label: "Lawyer Approvals",
        description: "Verify provider applications",
        icon: UserCheck,
      },
      {
        href: "/admin/subscriptions",
        label: "Plan requests",
        description: "Bank & PayPal onboarding",
        icon: CreditCard,
      },
      {
        href: "/admin/ads",
        label: "Ads Moderation",
        description: "Review sponsored listings",
        icon: Megaphone,
      },
      {
        href: "/admin/billing",
        label: "Billing",
        description: "Payments and escrow",
        icon: Landmark,
      },
    ],
  },
  {
    id: "insights",
    label: "Insights",
    icon: BarChart3,
    href: "/admin/analytics",
    sidebarTitle: "Insights",
    sidebarSubtitle: "Analytics & AI briefs",
    items: [
      {
        href: "/admin/analytics",
        label: "Analytics",
        description: "Platform event stream",
        icon: BarChart3,
      },
      {
        href: "/admin/insights",
        label: "AI Insights",
        description: "Optimization and briefs",
        icon: Sparkles,
      },
    ],
  },
  {
    id: "trust",
    label: "Trust",
    icon: Shield,
    href: "/admin/coi",
    sidebarTitle: "Trust & Compliance",
    sidebarSubtitle: "COI, audit & policy",
    items: [
      {
        href: "/admin/coi",
        label: "COI Flags",
        description: "Conflict screens in flight",
        icon: Scale,
      },
      {
        href: "/admin/compliance",
        label: "Compliance",
        description: "Checklist and live counts",
        icon: ShieldCheck,
      },
      {
        href: "/admin/audit",
        label: "Audit Center",
        description: "Sensitive action log",
        icon: Activity,
      },
    ],
  },
  {
    id: "settings",
    label: "More",
    icon: Settings,
    href: "/admin",
    sidebarTitle: "Workspace",
    sidebarSubtitle: "Shortcuts",
    items: [
      {
        href: "/admin",
        label: "Control Tower",
        description: "Back to overview",
        icon: LayoutDashboard,
      },
      {
        href: "/",
        label: "View website",
        description: "Open the public site",
        icon: ExternalLink,
      },
      {
        href: "/blog",
        label: "Public blog",
        description: "See published articles",
        icon: Newspaper,
      },
    ],
  },
];

export const PORTAL_META: Record<PortalRole, PortalMeta> = {
  client: {
    role: "client",
    brandLabel: "Client",
    badgeLabel: "Client",
    homeHref: "/client",
    storageKey: "barristrly.portal.client.shell",
    rails: CLIENT_RAILS,
  },
  lawyer: {
    role: "lawyer",
    brandLabel: "Lawyer",
    badgeLabel: "Lawyer",
    homeHref: "/lawyer",
    storageKey: "barristrly.portal.lawyer.shell",
    rails: LAWYER_RAILS,
  },
  admin: {
    role: "admin",
    brandLabel: "Super Admin",
    badgeLabel: "Super Admin",
    homeHref: "/admin",
    storageKey: "barristrly.portal.admin.shell",
    rails: ADMIN_RAILS,
  },
};

function portalRoot(role: PortalRole): string {
  return `/${role}`;
}

export function railForPath(role: PortalRole, pathname: string): RailItem {
  const rails = PORTAL_META[role].rails;
  const root = portalRoot(role);
  let best: RailItem = rails[0];
  let bestScore = -1;

  for (const rail of rails) {
    for (const item of rail.items) {
      const exact = pathname === item.href;
      const nested =
        item.href !== root && pathname.startsWith(item.href + "/");
      if (!exact && !nested) continue;
      const base = exact ? 100 : 50 + item.href.length;
      const score = base + (rail.id === "home" ? 0 : 25);
      if (score > bestScore) {
        bestScore = score;
        best = rail;
      }
    }
    if (pathname === rail.href) {
      const score = 40 + (rail.id === "home" ? 0 : 25);
      if (score > bestScore) {
        best = rail;
        bestScore = score;
      }
    }
  }

  return best;
}

export function titleForPath(role: PortalRole, pathname: string): string {
  const rails = PORTAL_META[role].rails;
  const root = portalRoot(role);

  for (const rail of rails) {
    for (const item of rail.items) {
      if (pathname === item.href || pathname.startsWith(item.href + "/")) {
        if (item.href === root && pathname !== root) continue;
        return item.label;
      }
    }
  }

  return PORTAL_META[role].brandLabel;
}
