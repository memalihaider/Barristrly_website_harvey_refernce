import { LEGAL_SERVICES } from "./seo-slugs";

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
  /** Overrides the column links in the mobile menu, rendered as bullets */
  mobileItems?: NavLink[];
  featured?: NavFeatured;
};

const PRACTICE_LINKS: NavLink[] = LEGAL_SERVICES.map((s) => ({
  name: s.label,
  href: `/legal-services/${s.slug}`,
  description: s.summary,
}));

export const PRIMARY_NAV: NavGroup[] = [
  {
    name: "Services & Practice Areas",
    columns: [
      { title: "Practice pillars", items: PRACTICE_LINKS.slice(0, 4) },
      { title: "More practice pillars", items: PRACTICE_LINKS.slice(4) },
    ],
    mobileItems: [
      { name: "Legal Matching", href: "/ai/intake" },
      { name: "Legal Retainers", href: "/pricing#retainers" },
      { name: "Legal Consultation", href: "/pricing" },
    ],
    featured: {
      href: "/services",
      badge: "All services",
      title: "Find & hire the right UAE-licensed lawyer",
      description:
        "Browse all 7 dedicated practice pillars, then submit a brief for a free match or book a dedicated consultation.",
      media: "/bg-video.mp4",
    },
  },
  {
    name: "How It Works",
    href: "/how-it-works",
  },
  {
    name: "For Legal Providers",
    href: "/practice",
  },
  {
    name: "Resources / Journal",
    href: "/resources",
  },
];

/** @deprecated Empty — kept so stale HMR bundles don't crash */
export const HOME_ANCHORS: NavLink[] = [];

export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: "For Clients",
    links: [
      { name: "Submit Brief", href: "/ai/intake" },
      { name: "Book Consultation", href: "/pricing" },
      { name: "Pricing Overview", href: "/pricing" },
      { name: "FAQs", href: "/resources" },
      { name: "Blog", href: "/blog" },
    ],
  },
  {
    title: "For Providers",
    links: [
      { name: "Join Provider Network", href: "/practice/apply" },
      { name: "SLA Requirements", href: "/practice#sla" },
      { name: "Partner Verification Portal", href: "/login" },
    ],
  },
  {
    title: "Legal & Compliance",
    links: [
      { name: "Terms & Conditions", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Regulatory Disclaimer", href: "/terms#section-2" },
    ],
  },
];
