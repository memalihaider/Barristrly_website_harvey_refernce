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
    tagline: "Match counsel with confidence",
    description:
      "Anonymous directory, automated COI, escrow-protected consults, and global provider matching.",
  },
  {
    id: "ai",
    name: "BARRI",
    href: "/ai",
    tagline: "Intake & triage",
    description:
      "BARRI classifies matters and prepares matching — research and draft helpers support the aggregator flow.",
  },
  {
    id: "practice",
    name: "PracticeOS",
    href: "/practice",
    tagline: "Provider panel",
    description:
      "Zero listing fees, pre-vetted leads, 12-hour conflict SLA, and escrow-protected consult payouts.",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    href: "/enterprise",
    tagline: "Corporate panels",
    description:
      "Capped subscriptions, conflict-check cycles, and controls for in-house legal teams.",
  },
];
