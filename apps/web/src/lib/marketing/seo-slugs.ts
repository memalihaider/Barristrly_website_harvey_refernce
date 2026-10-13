import {
  PRACTICE_AREAS,
  PRACTICE_AREA_LABELS,
  type PracticeArea,
} from "@/lib/ontology";

export const SEO_CITIES = [
  { slug: "dubai", label: "Dubai" },
  { slug: "abu-dhabi", label: "Abu Dhabi" },
  { slug: "riyadh", label: "Riyadh" },
  { slug: "london", label: "London" },
  { slug: "karachi", label: "Karachi" },
] as const;

export type SeoCitySlug = (typeof SEO_CITIES)[number]["slug"];

export const LEGAL_SERVICES = [
  {
    slug: "mainland-litigation",
    label: "Mainland Litigation & Court Advocacy",
    summary: "Criminal defense, commercial lawsuits, debt recovery litigation, bounced cheques, and Rental Dispute Center (RDC) filings.",
    forum: "Dubai Courts, Abu Dhabi Judicial Dept, MOJ Advocates",
  },
  {
    slug: "corporate-structuring",
    label: "Corporate, Commercial & Business Structuring",
    summary: "Drafting commercial agreements, JV structures, founder vesting, corporate governance, and UAE Corporate Tax compliance.",
    forum: "Mainland DED, Free Zone Setup (DIFC, ADGM, DMCC), M&A",
  },
  {
    slug: "real-estate",
    label: "Real Estate, Construction & Property Law",
    summary: "Developer delay claims, SPA legal audits, cancellation of purchase agreements, lease drafting, and contractor arbitrations.",
    forum: "Property Transactions, Developer Disputes, Off-Plan",
  },
  {
    slug: "labor-employment",
    label: "Employment, Labor & Executive Mobility",
    summary: "Unfair dismissal disputes, end-of-service gratuity calculation, non-compete enforcement, and executive employment contract vetting.",
    forum: "UAE Labor Law (Law No. 33/2021), MOHRE, Free Zones",
  },
  {
    slug: "tech-ip-digital-assets",
    label: "Tech, IP, E-Commerce & Digital Assets",
    summary: "Trademark filings, software licensing, website terms & privacy policies, DIFC/ADGM Data Protection, and Web3 regulatory guidance.",
    forum: "Startups, Intellectual Property, Fintech, Data Privacy",
  },
  {
    slug: "arbitration-debt-collection",
    label: "Cross-Border Debt Recovery & Arbitration",
    summary: "International commercial arbitration, enforcement of foreign judgments, corporate asset tracing, and out-of-court settlements.",
    forum: "DIAC, ICC, DIFC-LCIA, ADGM Arbitration Centre",
  },
  {
    slug: "private-client-estate",
    label: "Private Client, Family Law & Estate Planning",
    summary: "Non-Muslim wills registration, probate proceedings, asset protection, guardianship, and family trust structuring.",
    forum: "Expat Personal Status, DIFC/ADGM Wills, HNW Assets",
  },
] as const;

export const AI_TOOLS = [
  {
    slug: "research",
    label: "Legal research",
    summary: "Ask grounded questions across statutes, cases, and your matter files.",
  },
  {
    slug: "draft",
    label: "Drafting",
    summary: "Generate memos, letters, and first-draft agreements with controls.",
  },
  {
    slug: "review",
    label: "Contract review",
    summary: "Flag risk, missing clauses, and negotiation points in seconds.",
  },
  {
    slug: "intake",
    label: "AI intake",
    summary: "Structure client facts into practice area, jurisdiction, and urgency.",
  },
  {
    slug: "agents",
    label: "Legal agents",
    summary: "Multi-step workflows for diligence, summarization, and follow-ups.",
  },
] as const;

export function practiceSlug(area: PracticeArea): string {
  return area.replace(/_/g, "-");
}

export function practiceFromSlug(slug: string): PracticeArea | null {
  const normalized = slug.replace(/-/g, "_") as PracticeArea;
  return (PRACTICE_AREAS as readonly string[]).includes(normalized)
    ? normalized
    : null;
}

export function practiceLabel(area: PracticeArea): string {
  return PRACTICE_AREA_LABELS[area];
}

export function allPracticeSlugs(): { slug: string; label: string; area: PracticeArea }[] {
  return PRACTICE_AREAS.map((area) => ({
    area,
    slug: practiceSlug(area),
    label: PRACTICE_AREA_LABELS[area],
  }));
}

export function cityFromSlug(slug: string): (typeof SEO_CITIES)[number] | null {
  return SEO_CITIES.find((c) => c.slug === slug) ?? null;
}

export function serviceFromSlug(slug: string): (typeof LEGAL_SERVICES)[number] | null {
  return LEGAL_SERVICES.find((s) => s.slug === slug) ?? null;
}

export function aiToolFromSlug(slug: string): (typeof AI_TOOLS)[number] | null {
  return AI_TOOLS.find((t) => t.slug === slug) ?? null;
}
