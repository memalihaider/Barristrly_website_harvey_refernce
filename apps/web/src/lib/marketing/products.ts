export type ProductId = "marketplace" | "ai" | "practice" | "enterprise";

export const PRODUCTS: {
  id: ProductId;
  name: string;
  href: string;
  tagline: string;
  description: string;
}[] = [
  {
    id: "marketplace",
    name: "Marketplace",
    href: "/marketplace",
    tagline: "Hire counsel with confidence",
    description:
      "AI intake, COI-aware matching, escrow-protected consults, and encrypted meetings.",
  },
  {
    id: "ai",
    name: "AI",
    href: "/ai",
    tagline: "Research, draft, review",
    description:
      "Legal research, drafting, contract review, and agent workflows grounded in your matters.",
  },
  {
    id: "practice",
    name: "PracticeOS",
    href: "/practice",
    tagline: "Run your practice",
    description:
      "Pipeline, clients, calendar, documents, billing, and accounting for lawyers and firms.",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    href: "/enterprise",
    tagline: "Legal ops at scale",
    description:
      "CLM, compliance, analytics, and enterprise controls for in-house and large firms.",
  },
];
