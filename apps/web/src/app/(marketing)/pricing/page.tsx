import type { Metadata } from "next";
import GradientButton from "@/components/ui/gradient-button";
import {
  MarketingCtaBand,
  MarketingSection,
  PageHero,
} from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Pricing | Barristrly",
  description:
    "Plans for clients, lawyers, firms, and enterprise legal teams.",
};

const PLANS = [
  {
    name: "Client",
    price: "Free to start",
    detail:
      "AI Intake, post matters, review matches, book consults. Escrow fees apply per engagement.",
    cta: { href: "/ai/intake", label: "Start AI Intake" },
  },
  {
    name: "Lawyer",
    price: "Subscription tiers",
    detail:
      "Profile, Marketplace leads, PracticeOS CRM, documents, and AI assistants.",
    cta: { href: "/register?role=lawyer", label: "Join as lawyer" },
    highlight: true,
  },
  {
    name: "Firm",
    price: "Custom",
    detail:
      "Multi-lawyer seats, admin roles, shared pipeline, and accounting views.",
    cta: { href: "/request-demo", label: "Talk to us" },
  },
  {
    name: "Enterprise",
    price: "Custom",
    detail:
      "CLM, compliance, analytics, SSO/API roadmap, and dedicated support.",
    cta: { href: "/request-demo", label: "Contact sales" },
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Clear plans for every side of the market"
        description="Start free as a client with AI Intake. Grow with lawyer subscriptions. Scale firms and enterprise with guided rollout."
      />

      <MarketingSection>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-14">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`border-t-2 pt-6 ${
                plan.highlight ? "border-primary" : "border-gray-200"
              }`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-serif text-2xl text-ink tracking-tight">
                  {plan.name}
                </h2>
                <span className="text-sm font-semibold text-primary">
                  {plan.price}
                </span>
              </div>
              <p className="mt-3 text-gray-600 leading-relaxed">{plan.detail}</p>
              <div className="mt-6">
                <GradientButton href={plan.cta.href} size="sm">
                  {plan.cta.label}
                </GradientButton>
              </div>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingCtaBand
        title="Not sure which plan fits?"
        description="Tell us your role, jurisdiction, and volume — we will recommend a path."
        primaryHref="/request-demo"
        primaryLabel="Request a demo"
        secondaryHref="/ai/intake"
        secondaryLabel="Try AI Intake"
      />
    </>
  );
}
