/** Placeholder onboarding plans — prices subject to update. */

export type OnboardingRole = "firm_admin" | "lawyer" | "client";

export type OnboardingPlan = {
  id: string;
  name: string;
  price: string;
  period: string;
  detail: string;
  features: string[];
  highlight?: boolean;
  kind: "subscription" | "meeting";
};

export const AGENCY_PLANS: OnboardingPlan[] = [
  {
    id: "agency-starter",
    name: "Agency Starter",
    price: "2,500 AED",
    period: "/month",
    detail: "For small agencies onboarding a lean lawyer panel. Pricing subject to update.",
    features: [
      "Up to 5 lawyer seats",
      "Lead routing & COI workspace",
      "Escrow-backed consults",
      "Basic analytics",
    ],
    kind: "subscription",
  },
  {
    id: "agency-growth",
    name: "Agency Growth",
    price: "5,500 AED",
    period: "/month",
    detail: "For growing firms managing multi-lawyer intake. Pricing subject to update.",
    features: [
      "Up to 15 lawyer seats",
      "Priority matching",
      "Conflict SLA tooling",
      "Team billing controls",
    ],
    highlight: true,
    kind: "subscription",
  },
  {
    id: "agency-scale",
    name: "Agency Scale",
    price: "12,000 AED",
    period: "/month",
    detail: "For large agencies and multi-office panels. Pricing subject to update.",
    features: [
      "Unlimited lawyer seats*",
      "Dedicated success support",
      "Advanced reporting",
      "Custom onboarding",
    ],
    kind: "subscription",
  },
];

export const SOLO_LAWYER_PLANS: OnboardingPlan[] = [
  {
    id: "solo-starter",
    name: "Solo Starter",
    price: "499 AED",
    period: "/month",
    detail: "Essential listing and lead access for independent practitioners.",
    features: [
      "Zero listing fee directory presence",
      "Up to 8 matched leads / month",
      "12-hour COI SLA",
      "Masked VoIP consults",
    ],
    kind: "subscription",
  },
  {
    id: "solo-pro",
    name: "Solo Pro",
    price: "999 AED",
    period: "/month",
    detail: "Higher lead volume and profile boost for busy solos.",
    features: [
      "Up to 20 matched leads / month",
      "Featured profile badge",
      "Escrow payout priority",
      "Practice analytics",
    ],
    highlight: true,
    kind: "subscription",
  },
  {
    id: "solo-elite",
    name: "Solo Elite",
    price: "1,799 AED",
    period: "/month",
    detail: "Maximum visibility and intake capacity for top independents.",
    features: [
      "Up to 40 matched leads / month",
      "Priority corridor placement",
      "Dedicated support channel",
      "Milestone invoice tools",
    ],
    kind: "subscription",
  },
];

export const CUSTOMER_PLANS: OnboardingPlan[] = [
  {
    id: "customer-essential",
    name: "Essential Access",
    price: "0 AED",
    period: "to start",
    detail: "Create your account and pay per anonymous session when you book.",
    features: [
      "Anonymous directory browse",
      "BARRI intake",
      "Pay-per-session consults",
      "Escrow-protected meetings",
    ],
    kind: "subscription",
  },
  {
    id: "customer-plus",
    name: "Client Plus",
    price: "299 AED",
    period: "/month",
    detail: "Light monthly access with one included consult credit.",
    features: [
      "1× 30-min session credit / month",
      "Faster match priority",
      "Saved counsel shortlist",
      "Pay-per-session top-ups",
    ],
    highlight: true,
    kind: "subscription",
  },
  {
    id: "customer-premium",
    name: "Client Premium",
    price: "799 AED",
    period: "/month",
    detail: "For individuals with recurring legal needs across the corridor.",
    features: [
      "3× session credits / month",
      "Priority BARRI triage",
      "Multi-matter tracking",
      "Concierge scheduling",
    ],
    kind: "subscription",
  },
  {
    id: "meeting-30",
    name: "30-Minute Meeting Pack",
    price: "400 AED",
    period: "per session",
    detail: "On-demand encrypted consult with capped time box.",
    features: ["Anonymous VoIP", "COI before consult", "Escrow held until done"],
    kind: "meeting",
  },
  {
    id: "meeting-45",
    name: "45-Minute Meeting Pack",
    price: "600 AED",
    period: "per session",
    detail: "Extended anonymous VoIP session with conflict-cleared counsel.",
    features: ["Anonymous VoIP", "COI before consult", "Escrow held until done"],
    kind: "meeting",
  },
  {
    id: "meeting-60",
    name: "60-Minute Meeting Pack",
    price: "800 AED",
    period: "per session",
    detail: "Full-hour secure consult for complex matter scoping.",
    features: ["Anonymous VoIP", "COI before consult", "Escrow held until done"],
    kind: "meeting",
  },
];

export function plansForRole(role: OnboardingRole): OnboardingPlan[] {
  if (role === "firm_admin") return AGENCY_PLANS;
  if (role === "lawyer") return SOLO_LAWYER_PLANS;
  return CUSTOMER_PLANS;
}

export function findPlan(planId: string): OnboardingPlan | undefined {
  return [...AGENCY_PLANS, ...SOLO_LAWYER_PLANS, ...CUSTOMER_PLANS].find(
    (p) => p.id === planId
  );
}

export const ROLE_OPTIONS = [
  {
    id: "firm_admin" as const,
    title: "I am an Agency Owner",
    description: "Business owner or agency managing multiple lawyers on Barristrly.",
  },
  {
    id: "lawyer" as const,
    title: "I am a Solo Lawyer",
    description: "Independent practitioner looking for qualified clients via the platform.",
  },
  {
    id: "client" as const,
    title: "I need a Lawyer",
    description: "Customer seeking counsel through anonymous matching and consults.",
  },
];
