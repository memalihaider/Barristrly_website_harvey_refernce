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
      badge: "Master catalog",
      title: "Ten services. One operations desk.",
      description:
        "From free lawyer matching to VLO, IP, PRO, and banking facilitation — Phase 1 forms feed Phase 2 automation.",
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
            description: "From AED 5,999/mo · 10–15 hour allocations",
          },
          {
            name: "Virtual Legal Officer",
            href: "/services/vlo-fractional-gc",
            description: "Fractional GC · AED 12,500/mo · 25 hours",
          },
          {
            name: "Contract Drafting",
            href: "/services/contract-drafting",
            description: "Fixed-fee tiers AED 799–1,999",
          },
          {
            name: "Banking & Capital Desk",
            href: "/services/banking-capital",
            description: "Mortgage, working capital, equity leads",
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
      title: "Fractional General Counsel for scaling companies",
      description:
        "Senior legal management without full-time GC overhead — book a founder discovery call.",
      media: "/bg-video.mp4",
    },
  },
  {
    name: "For Lawyers",
    href: "/practice",
  },
  {
    name: "E-Books & Resources",
    href: "/services/ebooks-pro",
    columns: [
      {
        title: "Digital & PRO",
        items: [
          {
            name: "E-Books & Bundles",
            href: "/services/ebooks-pro",
            description: "Guides from AED 99 · Master package AED 199",
          },
          {
            name: "PRO Clearing Services",
            href: "/services/ebooks-pro#request",
            description: "Visa, license, attestation, formation",
          },
          {
            name: "Journal & Resources",
            href: "/resources",
            description: "Guides, FAQs, and market notes",
          },
          {
            name: "Blog",
            href: "/blog",
            description: "Legal ops insights",
          },
        ],
      },
    ],
    mobileItems: [
      { name: "E-Books & PRO", href: "/services/ebooks-pro" },
      { name: "Resources", href: "/resources" },
      { name: "Blog", href: "/blog" },
    ],
    featured: {
      href: "/services/ebooks-pro",
      badge: "Digital store",
      title: "Instant guides + boots-on-ground PRO support",
      description:
        "Download compliance toolkits or request visa, trade license, and attestation support.",
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
      { name: "SLA Requirements", href: "/practice#sla" },
      { name: "Partner Portal", href: "/login" },
    ],
  },
  {
    title: "Legal & Compliance",
    links: [
      { name: "Terms & Conditions", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "About Barristrly", href: "/about" },
      { name: "Regulatory Disclaimer", href: "/terms#section-2" },
    ],
  },
];
