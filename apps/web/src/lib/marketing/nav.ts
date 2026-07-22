import { PRODUCTS } from "./products";

export type NavLink = { name: string; href: string; description?: string };

export type NavFeatured = {
  href: string;
  title: string;
  description: string;
  /** Short label shown on the visual panel */
  badge: string;
  /** Optional image or video path under /public */
  media?: string;
};

export type NavGroup = {
  name: string;
  href?: string;
  /** Flat list split across columns in the mega panel */
  items?: NavLink[];
  columns?: { title?: string; items: NavLink[] }[];
  featured?: NavFeatured;
};

const PRODUCT_LINKS: NavLink[] = [
  {
    name: "Overview",
    href: "/marketplace",
    description:
      "Legal tech marketplace — directory, COI, anonymous meetings, escrow.",
  },
  {
    name: "Marketplace",
    href: "/marketplace",
    description: "Match clients to counsel, experts, and arbitrators globally.",
  },
  {
    name: "BARRI Intake",
    href: "/ai/intake",
    description: "AI assistant that classifies your matter and starts matching.",
  },
  {
    name: "BARRI Assist",
    href: "/ai",
    description: "Intake-led AI helpers for research and brief structuring.",
  },
  {
    name: "PracticeOS",
    href: "/practice",
    description:
      "Zero listing fees — pre-vetted leads, 12-hour COI SLA, escrow payouts.",
  },
  {
    name: "Enterprise",
    href: "/enterprise",
    description: "Corporate panels, capped subscriptions, and compliance ops.",
  },
  {
    name: "Legal Research",
    href: "/ai/research",
    description: "Grounded questions to support intake and matter briefs.",
  },
  {
    name: "Contract Review",
    href: "/ai/review",
    description: "Flag risk themes before you schedule counsel.",
  },
  {
    name: "Drafting",
    href: "/ai/draft",
    description: "First-pass notices and briefs for marketplace handoff.",
  },
  {
    name: "Agents",
    href: "/ai/agents",
    description: "Multi-step triage workflows that feed matching.",
  },
];

export const PRIMARY_NAV: NavGroup[] = [
  {
    name: "Products",
    columns: [
      { items: PRODUCT_LINKS.slice(0, 5) },
      { items: PRODUCT_LINKS.slice(5) },
    ],
    featured: {
      href: "/ai/intake",
      badge: "BARRI",
      title: "BARRI Intake",
      description:
        "Our AI intake assistant classifies your matter, runs privacy-safe triage, and routes you toward matched providers — directory, COI, and scheduled meetings.",
      media: "/bg-video.mp4",
    },
  },
  {
    name: "Solutions",
    columns: [
      {
        items: [
          {
            name: "Clients",
            href: "/ai/intake",
            description:
              "Anonymous directory, BARRI triage, COI, and escrow-backed meetings.",
          },
          {
            name: "In-House",
            href: "/enterprise",
            description: "Corporate panels, capped meetings, and conflict cycles.",
          },
          {
            name: "Transactional",
            href: "/legal-services/corporate",
            description: "Corporate, commercial, and contract work with precision.",
          },
        ],
      },
      {
        items: [
          {
            name: "Litigation",
            href: "/legal-services/litigation",
            description: "Dispute strategy, filings, and hearing preparation.",
          },
          {
            name: "Lawyers & Firms",
            href: "/practice",
            description:
              "Zero listing fees, 12-hour COI SLA, and escrow consult payouts.",
          },
          {
            name: "Find Lawyers",
            href: "/find-lawyers",
            description: "Browse by practice area and city across the corridor.",
          },
        ],
      },
    ],
    featured: {
      href: "/marketplace",
      badge: "Marketplace",
      title: "Marketplace matching",
      description:
        "From party registration to ranked counsel with two-gate COI — built for clients and the lawyers who serve them.",
      media: "/bg-video.mp4",
    },
  },
  {
    name: "Security",
    href: "/security",
  },
  {
    name: "Resources",
    columns: [
      {
        items: [
          {
            name: "Resources hub",
            href: "/resources",
            description: "Product guides, service pages, and AI tool overviews.",
          },
          {
            name: "Pricing",
            href: "/pricing",
            description:
              "Consult rates, corporate caps, and digital escrow routing.",
          },
          {
            name: "Request a demo",
            href: "/request-demo",
            description: "Walk through the full Barristrly system with our team.",
          },
        ],
      },
      {
        items: [
          {
            name: "Security",
            href: "/security",
            description: "Trust center — two-gate COI, escrow, and audit.",
          },
          {
            name: "Legal services",
            href: "/legal-services/corporate",
            description: "Service guides across corporate, litigation, and more.",
          },
        ],
      },
    ],
    featured: {
      href: "/ai",
      badge: "Barristrly AI",
      title: "Barristrly AI",
      description:
        "Professional-class legal AI inside the work — intake, research, draft, and review where matters already live.",
      media: "/bg-video.mp4",
    },
  },
  {
    name: "Company",
    columns: [
      {
        items: [
          {
            name: "About",
            href: "/about",
            description:
              "Founder Heena Mohammed — vision for precise, anonymous legal matchmaking.",
          },
          {
            name: "Terms",
            href: "/terms",
            description:
              "Master User Agreement — tech-only aggregator status and liability shield.",
          },
          {
            name: "Privacy",
            href: "/privacy",
            description:
              "Data protection master agreement — anonymity, COI data, and retention.",
          },
          {
            name: "Pricing",
            href: "/pricing",
            description:
              "Consult rates, corporate caps, and digital escrow routing.",
          },
          {
            name: "Request a demo",
            href: "/request-demo",
            description: "Talk to us about rollout for your firm or team.",
          },
        ],
      },
      {
        items: [
          {
            name: "Log In",
            href: "/login",
            description: "Client, lawyer, or admin portals.",
          },
          {
            name: "Register",
            href: "/register",
            description: "Create an account and start intake or PracticeOS.",
          },
        ],
      },
    ],
    featured: {
      href: "/about",
      badge: "Barristrly",
      title: "The mediating bridge of trust",
      description:
        "Strip inefficiency from legal procurement — match clients to exact counsel by specialty, jurisdiction, and budget.",
      media: "/bg-video.mp4",
    },
  },
];

/** @deprecated Empty — kept so stale HMR bundles don't crash */
export const HOME_ANCHORS: NavLink[] = [];

export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: "Products",
    links: [
      ...PRODUCTS.map((p) => ({ name: p.name, href: p.href })),
      { name: "BARRI Intake", href: "/ai/intake" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { name: "Find Lawyers", href: "/find-lawyers" },
      { name: "Legal Services", href: "/legal-services/corporate" },
      { name: "For Lawyers", href: "/practice" },
      { name: "Enterprise", href: "/enterprise" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Resources", href: "/resources" },
      { name: "Security", href: "/security" },
      { name: "Pricing", href: "/pricing" },
      { name: "Support", href: "/request-demo" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Pricing", href: "/pricing" },
      { name: "Terms", href: "/terms" },
      { name: "Privacy", href: "/privacy" },
      { name: "Request Demo", href: "/request-demo" },
      { name: "Log In", href: "/login" },
      { name: "Register", href: "/register" },
    ],
  },
];
