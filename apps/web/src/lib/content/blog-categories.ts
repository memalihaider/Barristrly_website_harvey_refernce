import type { ServiceId } from "@/lib/marketing/service-catalog";

/** Article categories. Each maps to the service promoted beside the article. */
export const BLOG_CATEGORIES = [
  { slug: "company-setup", label: "Company Setup & PRO", service: "company-formation" },
  { slug: "tax", label: "Corporate Tax & VAT", service: "company-formation" },
  { slug: "contracts", label: "Contracts & Agreements", service: "contract-drafting" },
  { slug: "wills", label: "Wills & Estate Planning", service: "wills-estate" },
  { slug: "arbitration", label: "Arbitration & Disputes", service: "lawyer-matching" },
  { slug: "consultations", label: "Legal Consultations", service: "consultation" },
  { slug: "business-legal", label: "Business Legal Support", service: "retainers" },
  { slug: "templates", label: "Templates & Guides", service: "agreements-ebooks" },
  { slug: "guides", label: "General Legal Guides", service: null },
] as const satisfies readonly { slug: string; label: string; service: ServiceId | null }[];

export type BlogCategorySlug = (typeof BLOG_CATEGORIES)[number]["slug"];

export const BLOG_CATEGORY_SLUGS = BLOG_CATEGORIES.map((c) => c.slug) as [
  BlogCategorySlug,
  ...BlogCategorySlug[],
];

export function blogCategory(slug: string | null | undefined) {
  return BLOG_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function categoriesForService(id: ServiceId): BlogCategorySlug[] {
  return BLOG_CATEGORIES.filter((c) => c.service === id).map((c) => c.slug);
}
