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
    slug: "corporate",
    label: "Corporate counsel",
    summary: "Entity setup, governance, and commercial contracting.",
  },
  {
    slug: "litigation",
    label: "Litigation support",
    summary: "Dispute strategy, filings, and hearing preparation.",
  },
  {
    slug: "employment",
    label: "Employment law",
    summary: "Contracts, disputes, and workforce compliance.",
  },
  {
    slug: "real-estate",
    label: "Real estate",
    summary: "Transactions, leases, and property disputes.",
  },
  {
    slug: "immigration",
    label: "Immigration",
    summary: "Visas, residency, and mobility advice.",
  },
  {
    slug: "ip",
    label: "Intellectual property",
    summary: "Trademarks, copyrights, and brand protection.",
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
