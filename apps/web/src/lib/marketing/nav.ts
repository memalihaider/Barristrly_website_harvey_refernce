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
    columns: [
      { title: "Core legal", items: SERVICE_LINKS.slice(0, 5) },
      { title: "Business & ops", items: SERVICE_LINKS.slice(5) },
    ],
    mobileItems: SERVICE_LINKS,
    featured: {
      href: "/services",
      badge: "Our services",
      title: "Ten clear services. One trusted desk.",
      description:
        "From free lawyer matching to retainers, contracts, wills, and brand protection — with plain AED pricing.",
      media: "/bg-video.mp4",
    },
  },
  {
    name: "For Businesses & Startups",
    href: "/services/retainers",
    columns: [
      {
        title: "Business packages",
        items: [
          {
            name: "Startup & Corporate Retainers",
            href: "/services/retainers",
            description: "From AED 5,999/month · 10–15 hours of support",
          },
          {
            name: "Virtual Legal Officer",
            href: "/services/vlo-fractional-gc",
            description: "Senior legal support · AED 12,500/month · 25 hours",
          },
          {
            name: "Contract Drafting",
            href: "/services/contract-drafting",
            description: "Fixed fees from AED 799 to AED 1,999",
          },
          {
            name: "Banking & Capital",
            href: "/services/banking-capital",
            description: "Mortgages, business loans, and growth capital",
          },
        ],
      },
      {
        title: "Practice areas",
        items: PRACTICE_LINKS.slice(0, 4),
      },
    ],
    mobileItems: [
      { name: "Retainers", href: "/services/retainers" },
      { name: "VLO / Fractional GC", href: "/services/vlo-fractional-gc" },
      { name: "Contract Drafting", href: "/services/contract-drafting" },
    ],
    featured: {
      href: "/services/vlo-fractional-gc",
      badge: "New",
      title: "Senior legal support for growing companies",
      description:
        "Get experienced legal guidance each month — without hiring a full-time in-house lawyer.",
      media: "/bg-video.mp4",
    },
  },
  {
    name: "For Lawyers",
    href: "/practice",
  },
  {
    name: "Guides & Resources",
    href: "/services/ebooks-pro",
    columns: [
      {
        title: "Guides & help",
        items: [
          {
            name: "Guides & PRO",
            href: "/services/ebooks-pro",
            description: "Guides from AED 99 · PRO help for visas and licences",
          },
          {
            name: "PRO Support",
            href: "/services/ebooks-pro#request",
            description: "Visas, licences, attestation, company setup",
          },
          {
            name: "Resources",
            href: "/resources",
            description: "Helpful reading and service guides",
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
      { name: "Guides & PRO", href: "/services/ebooks-pro" },
      { name: "Resources", href: "/resources" },
      { name: "Blog", href: "/blog" },
    ],
    featured: {
      href: "/services/ebooks-pro",
      badge: "Guides & PRO",
      title: "Ready guides and on-ground support",
      description:
        "Download a practical guide, or ask for help with visas, trade licences, and paperwork.",
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
    links: SERVICE_LINKS.slice(0, 6).map(({ name, href }) => ({ name, href })),
  },
  {
    title: "For Clients",
    links: [
      { name: "Free Lawyer Matching", href: "/services/lawyer-matching" },
      { name: "Book Consultation", href: "/services/consultation" },
      { name: "Pricing Overview", href: "/pricing" },
      { name: "Wills & Estate", href: "/services/wills-estate" },
      { name: "IP & Brand", href: "/services/ip-brand" },
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
