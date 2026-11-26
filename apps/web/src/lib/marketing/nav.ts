import { LEGAL_SERVICES } from "./seo-slugs";
import { serviceNavLinks } from "./service-catalog";

export type NavLink = { name: string; href: string; description?: string };

export type NavFeatured = {
  href: string;
  title: string;
  description: string;
  badge: string;
  media?: string;
};

export type NavGroup = {
  name: string;
  href?: string;
  items?: NavLink[];
  columns?: { title?: string; items: NavLink[] }[];
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
      { title: "Start here", items: SERVICE_LINKS.slice(0, 4) },
      { title: "Documents & setup", items: SERVICE_LINKS.slice(4) },
    ],
    mobileItems: SERVICE_LINKS,
    featured: {
      href: "/services",
      badge: "Seven services",
      title: "Match with vetted Legal Professionals in UAE",
      description:
        "Free lawyer matching, fixed-fee consultations, retainers, drafting, wills, company formation & PRO, and e-books with templates.",
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
            name: "Legal Retainers",
            href: "/services/retainers",
            description: "Affordable monthly plans for ongoing legal needs",
          },
          {
            name: "Contract Drafting",
            href: "/services/contract-drafting",
            description: "Documentation at reasonable charges",
          },
          {
            name: "Company Formation & PRO",
            href: "/services/company-formation",
            description: "Licensing, Corporate Tax, VAT & PRO from anywhere",
          },
          {
            name: "E-Books & Templates",
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
      { name: "E-Books & Templates", href: "/services/agreements-ebooks" },
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
            name: "E-Books & Templates",
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
      { name: "E-Books & Templates", href: "/services/agreements-ebooks" },
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
      { name: "Lawyer Matching (Free)", href: "/services/lawyer-matching" },
      { name: "Legal Consultation", href: "/services/consultation" },
      { name: "All services", href: "/services" },
      { name: "Pricing", href: "/pricing" },
      { name: "Wills & Estate", href: "/services/wills-estate" },
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
