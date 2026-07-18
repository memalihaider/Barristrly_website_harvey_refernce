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
      "How Marketplace, AI, PracticeOS, and Enterprise work together as one system.",
  },
  {
    name: "Marketplace",
    href: "/marketplace",
    description: "Hire counsel with AI intake, COI-aware matching, and escrow.",
  },
  {
    name: "AI Intake",
    href: "/ai/intake",
    description: "Describe your case, structure the matter, and match lawyers.",
  },
  {
    name: "AI Assistant",
    href: "/ai",
    description: "Research, draft, review, and agents grounded in your matters.",
  },
  {
    name: "PracticeOS",
    href: "/practice",
    description: "Pipeline, clients, documents, billing, and accounting for counsel.",
  },
  {
    name: "Enterprise",
    href: "/enterprise",
    description: "CLM, compliance, analytics, and controls for legal ops at scale.",
  },
  {
    name: "Legal Research",
    href: "/ai/research",
    description: "Ask grounded questions across statutes, cases, and matter files.",
  },
  {
    name: "Contract Review",
    href: "/ai/review",
    description: "Flag risk, missing clauses, and negotiation points faster.",
  },
  {
    name: "Drafting",
    href: "/ai/draft",
    description: "Generate memos, letters, and first-draft agreements with controls.",
  },
  {
    name: "Agents",
    href: "/ai/agents",
    description: "Multi-step workflows for diligence, summarization, and follow-ups.",
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
      badge: "AI Intake",
      title: "AI Intake",
      description:
        "Barristrly’s intake agent understands the case, completes the brief, and suggests matched lawyers — so you can focus on counsel that fits.",
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
            description: "Intake, matching, and escrow-protected consults.",
          },
          {
            name: "In-House",
            href: "/enterprise",
            description: "Route work, manage panel counsel, and see spend clearly.",
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
            description: "PracticeOS for solos and growing firms.",
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
        "From intake to ranked counsel with COI-aware matching — built for clients and the lawyers who serve them.",
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
            description: "Plans for clients, lawyers, firms, and enterprise.",
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
            description: "Trust center — access, escrow, COI, and audit.",
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
            description: "Who we are and what we’re building.",
          },
          {
            name: "Pricing",
            href: "/pricing",
            description: "Plans for clients, lawyers, firms, and enterprise.",
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
      title: "The legal operating system",
      description:
        "Marketplace, AI, PracticeOS, and Enterprise — one system for hiring counsel and running the work.",
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
      { name: "AI Intake", href: "/ai/intake" },
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
      { name: "Request Demo", href: "/request-demo" },
      { name: "Log In", href: "/login" },
      { name: "Register", href: "/register" },
    ],
  },
];
