import { MARKETPLACE_FEATURES, PRODUCTS } from "./products";

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

const PRODUCT_LINKS: NavLink[] = PRODUCTS.map((p) => ({
  name: p.name,
  href: p.href,
  description: p.navDescription,
}));

export const PRIMARY_NAV: NavGroup[] = [
  {
    name: "Products",
    columns: [
      { title: "Match & hire", items: PRODUCT_LINKS.slice(0, 4) },
      { title: "Run the practice", items: PRODUCT_LINKS.slice(4) },
    ],
    featured: {
      href: "/marketplace",
      badge: "Marketplace",
      title: "Legal Marketplace",
      description:
        "Anonymous directory, two-gate COI, confidential meetings, and a corridor so India, Pakistan, the UAE, and the world can evaluate, meet, and hire without travelling.",
      media: "/bg-video.mp4",
    },
  },
  {
    name: "Solutions",
    columns: [
      {
        title: "Who it’s for",
        items: [
          {
            name: "Clients",
            href: "/ai/intake",
            description:
              "Anonymous directory, BARRI triage, COI, and escrow-backed meetings.",
          },
          {
            name: "Lawyers & Firms",
            href: "/practice",
            description:
              "Zero listing fees, 12-hour COI SLA, and escrow consult payouts.",
          },
          {
            name: "In-House / Enterprise",
            href: "/enterprise",
            description: "Corporate panels, capped meetings, and conflict cycles.",
          },
        ],
      },
      {
        title: "Marketplace features",
        items: MARKETPLACE_FEATURES,
      },
    ],
    featured: {
      href: "/#why-features",
      badge: "Corridor",
      title: "Hire without the flight",
      description:
        "Clients in India, Pakistan, and elsewhere find UAE counsel on-platform. UAE clients do the same worldwide — evaluate, meet, hire. No wasted travel.",
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
      { name: "All products", href: "/products" },
      ...PRODUCTS.map((p) => ({ name: p.name, href: p.href })),
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
