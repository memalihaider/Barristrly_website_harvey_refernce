/** @deprecated Prefer SERVICE_CATALOG in service-catalog.ts — kept for legacy imports. */

export const INDIVIDUAL_SESSIONS = [
  {
    name: "Express Advisory",
    price: "599 AED",
    period: "15–20 mins",
    detail: "Quick legal query, single document check, urgent verbal advice.",
  },
  {
    name: "Standard Strategy",
    price: "799 AED",
    period: "30 mins",
    detail: "In-depth consultation on contract disputes and corporate setup.",
  },
  {
    name: "Comprehensive Advisory",
    price: "999 AED",
    period: "45 mins",
    detail: "Multi-issue consultation and pre-litigation analysis.",
  },
  {
    name: "Executive Legal Audit",
    price: "1,299 AED",
    period: "60 mins",
    detail: "Complex matter review with written post-session notes.",
  },
] as const;

export const INDIVIDUAL_HOOK =
  "Book a consultation from AED 599 — Express through Executive Audit.";

export const SUBSCRIPTION_PLANS = [
  {
    name: "Startup Retainer",
    price: "5,999 AED",
    period: "/month",
    detail: "10 hours legal allocation with flexible drafting options.",
    features: [
      "10 hours / month",
      "Simple to heavy contract options",
      "Priority drafting queue",
      "Hours tracked in Phase 2 dashboard",
    ],
    cta: { href: "/services/retainers#request", label: "Start Startup Retainer" },
  },
  {
    name: "Corporate Retainer",
    price: "7,999 AED",
    period: "/month",
    detail:
      "15 hours for governance, employment compliance, trademarks, and unlimited phone Q&A.",
    features: [
      "15 hours / month",
      "Corporate governance",
      "Employment compliance",
      "Unlimited legal phone Q&A",
    ],
    highlight: true,
    cta: { href: "/services/retainers#request", label: "Start Corporate Retainer" },
  },
  {
    name: "Virtual Legal Officer",
    price: "12,500 AED",
    period: "/month",
    detail: "25 hours of senior fractional General Counsel coverage.",
    features: [
      "25 hours senior legal management",
      "Fractional GC without FTE cost",
      "Founder discovery call",
      "Sample retainer available",
    ],
    cta: { href: "/services/vlo-fractional-gc#request", label: "Book discovery call" },
  },
] as const;

export const PRICING_RULES = [
  {
    title: "VAT",
    detail:
      "A 5% VAT applies to taxable services and is itemized at checkout under UAE Federal Decree-Law No. 8 of 2017.",
  },
  {
    title: "Government fees",
    detail:
      "Court, DIFC/ADGM registry, and Ministry of Economy fees are always charged separately from Barristrly service fees.",
  },
  {
    title: "Phase 1 checkout",
    detail:
      "Forms capture structured requests; founder issues Stripe/Tap payment links until Phase 2 self-serve checkout is live.",
  },
] as const;
