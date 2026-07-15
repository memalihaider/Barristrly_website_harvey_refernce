"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/section-heading";
import PricingCard from "@/components/ui/pricing-card";

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      plan: "Intake Starter",
      price: "$0",
      period: "/forever",
      description: "Ideal for basic testing & discovery.",
      features: [
        "5 AI intakes per month",
        "Basic jurisdiction routing",
        "Standard COI screening",
        "Email support",
        "Community access",
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      plan: "Intake Pro",
      price: isYearly ? "$39" : "$49",
      period: "/month",
      description: "For practicing firms & legal teams.",
      features: [
        "Unlimited AI intakes",
        "Priority lawyer matching",
        "Advanced COI vetting",
        "Milestone escrow protection",
        "Encrypted sandbox consultations",
        "Priority 24/7 support",
        "API integrations & Slack",
      ],
      cta: "Get Pro Access",
      popular: true,
    },
    {
      plan: "Enterprise Elite",
      price: isYearly ? "$79" : "$99",
      period: "/month",
      description: "Custom compliance & white-label setups.",
      features: [
        "Everything in Pro plan",
        "Custom corridor rules",
        "Dedicated account manager",
        "White-label portal branding",
        "SLA match speed guarantees",
        "SSO & multi-tenant logs",
        "Full audit trails access",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="section-padding soft-section relative overflow-hidden">
      <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container-wide relative z-10">
        <div className="mb-12">
          <SectionHeading
            eyebrow="Pricing Plans"
            heading="Simple, transparent pricing"
            subtitle="Choose a plan tailored to your volume. All plans include core security protocols."
          />
        </div>

        {/* Monthly / Yearly Toggle */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span
            className={`text-sm font-semibold ${
              !isYearly ? "text-primary" : "text-text-muted"
            }`}
          >
            Monthly
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isYearly}
            aria-label="Toggle yearly billing"
            onClick={() => setIsYearly(!isYearly)}
            className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              isYearly ? "bg-primary" : "bg-black/15"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow transition duration-200 ${
                isYearly ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-semibold ${
                isYearly ? "text-primary" : "text-text-muted"
              }`}
            >
              Yearly
            </span>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary-active">
              Save 20%
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {plans.map((p, idx) => (
            <PricingCard
              key={p.plan}
              plan={p.plan}
              price={p.price}
              period={p.period}
              description={p.description}
              features={p.features}
              cta={p.cta}
              popular={p.popular}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
