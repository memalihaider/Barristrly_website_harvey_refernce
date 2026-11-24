import { LEGAL_SERVICES } from "./seo-slugs";
import { serviceNavLinks } from "./service-catalog";

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

const SERVICE_LINKS = serviceNavLinks();
const PRACTICE_LINKS: NavLink[] = LEGAL_SERVICES.map((s) => ({
  name: s.label,
  href: `/legal-services/${s.slug}`,
  description: s.summary,
}));

export const PRIMARY_NAV: NavGroup[] = [
  {
    name: "Services",
    href: "/services",
    columns: [
      { title: "Dispute & documents", items: SERVICE_LINKS.slice(0, 3) },
      { title: "Family & ongoing support", items: SERVICE_LINKS.slice(3) },
    ],
    mobileItems: SERVICE_LINKS,
    featured: {
      href: "/services",
      badge: "Six services",
      title: "Legal services under one roof",
      description:
        "Arbitration connections, agreements & e-books, UAE company setup, wills, contract drafting, and flexible retainers.",
      media: "/bg-video.mp4",
    },
  },
  {
    name: "For Businesses",
    href: "/services/retainers",
    columns: [
      {
        title: "Business services",
        items: [
          {
            name: "Flexible Legal Retainers",
            href: "/services/retainers",
            description: "Ongoing vetted support · switch anytime · pro-rata billing",
          },
          {
            name: "Contract Drafting",
            href: "/services/contract-drafting",
            description: "Corporate, commercial & investment agreements",
          },
          {
            name: "UAE Company Formation & PRO",
            href: "/services/company-formation",
            description: "Licensing, Corporate Tax, VAT & PRO from anywhere",
          },
          {
            name: "Agreements & E-Books",
            href: "/services/agreements-ebooks",
            description: "Templates and guides for startups & mid-size teams",
          },
        ],
      },
      {
        title: "Practice areas",
        items: PRACTICE_LINKS.slice(0, 4),
      },
    ],
    mobileItems: [
      { name: "Legal Retainers", href: "/services/retainers" },
      { name: "Contract Drafting", href: "/services/contract-drafting" },
      { name: "Company Formation & PRO", href: "/services/company-formation" },
      { name: "Agreements & E-Books", href: "/services/agreements-ebooks" },
    ],
    featured: {
      href: "/services/retainers",
      badge: "For growing teams",
      title: "Legal continuity without rigid lock-ins",
      description:
        "Matched vetted professionals, clear scopes, and fair billing — built for startups and mid-size companies.",
      media: "/bg-video.mp4",
    },
  },
  {
    name: "For Lawyers",
    href: "/practice",
  },
  {
    name: "Resources",
    href: "/resources",
    columns: [
      {
        title: "Learn & explore",
        items: [
          {
            name: "Agreements & E-Books",
            href: "/services/agreements-ebooks",
            description: "Practical templates and business guides",
          },
          {
            name: "Resources",
            href: "/resources",
            description: "Helpful reading and service overviews",
          },
          {
            name: "How it works",
            href: "/how-it-works",
            description: "How Barristrly connects you with professionals",
          },
          {
            name: "Blog",
            href: "/blog",
            description: "Practical notes for clients and businesses",
          },
        ],
      },
    ],
    mobileItems: [
      { name: "Agreements & E-Books", href: "/services/agreements-ebooks" },
      { name: "Resources", href: "/resources" },
      { name: "How it works", href: "/how-it-works" },
      { name: "Blog", href: "/blog" },
    ],
    featured: {
      href: "/services/agreements-ebooks",
      badge: "Self-serve tools",
      title: "Templates and e-books that move with you",
      description:
        "Start with practical documents and guides — upgrade to vetted professionals when deals get complex.",
      media: "/bg-video.mp4",
    },
  },
  {
    name: "About",
    href: "/about",
  },
];

/** @deprecated Empty — kept so stale HMR bundles don't crash */
export const HOME_ANCHORS: NavLink[] = [];

export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: "Services",
    links: SERVICE_LINKS.map(({ name, href }) => ({ name, href })),
  },
  {
    title: "For Clients",
    links: [
      { name: "All services", href: "/services" },
      { name: "Wills & Estate", href: "/services/wills-estate" },
      { name: "Company Formation", href: "/services/company-formation" },
      { name: "Arbitration", href: "/services/arbitration" },
      { name: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "For Providers",
    links: [
      { name: "Join Provider Network", href: "/practice/apply" },
      { name: "For Lawyers", href: "/practice" },
      { name: "Response standards", href: "/practice#sla" },
      { name: "Contact", href: "/request-demo" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Barristrly", href: "/about" },
      { name: "How it works", href: "/how-it-works" },
      { name: "Terms & Conditions", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
    ],
  },
];
