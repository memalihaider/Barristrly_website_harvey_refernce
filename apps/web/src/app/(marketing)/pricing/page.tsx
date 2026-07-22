import type { Metadata } from "next";
import GradientButton from "@/components/ui/gradient-button";
import {
  FeatureList,
  MarketingCtaBand,
  MarketingSection,
  PageHero,
  SectionIntro,
} from "@/components/marketing/section";
import {
  INDIVIDUAL_HOOK,
  INDIVIDUAL_SESSIONS,
  PRICING_RULES,
  SUBSCRIPTION_PLANS,
} from "@/lib/marketing/pricing";

export const metadata: Metadata = {
  title: "Pricing | Barristrly",
  description:
    "Anonymous consult rates, corporate subscriptions, and digital escrow — fund capture, session validation, and anti-leakage disbursement in AED.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Matching workflow, capped subscriptions"
        description="Every unlocked booking runs the 5-node intake and conflict clearance loop. Consult fees lock in escrow before identity release — corporate plans use explicit meeting limits, not unlimited overhead."
      />

      <MarketingSection>
        <SectionIntro
          title="Individual booking rates"
          description={`${INDIVIDUAL_HOOK} On-demand anonymous VoIP sessions with capped time boxes — secured in escrow before the match loop finalizes.`}
        />
        <div className="mt-10 grid md:grid-cols-3 gap-x-10 gap-y-10">
          {INDIVIDUAL_SESSIONS.map((session) => (
            <div key={session.name} className="border-t-2 border-gray-200 pt-6">
              <h3 className="font-serif text-xl text-ink tracking-tight">
                {session.name}
              </h3>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-lg font-semibold text-primary">
                  {session.price}
                </span>
                <span className="text-sm text-gray-500">{session.period}</span>
              </div>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                {session.detail}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <GradientButton href="/ai/intake" size="sm">
            Start AI Intake
          </GradientButton>
        </div>
      </MarketingSection>

      <MarketingSection tone="soft">
        <SectionIntro
          title="Corporate & SME subscriptions"
          description="Anchored to explicit meeting thresholds and conflict-check cycle limits."
        />
        <div className="mt-12 grid md:grid-cols-3 gap-6 md:gap-8">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border bg-[#fafaf9] p-7 md:p-8 flex flex-col ${
                "highlight" in plan && plan.highlight
                  ? "border-primary shadow-[0_0_0_1px_var(--color-primary)]"
                  : "border-gray-200"
              }`}
            >
              {"highlight" in plan && plan.highlight ? (
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary mb-3">
                  Most popular
                </span>
              ) : (
                <span className="h-4 mb-3" aria-hidden />
              )}
              <h2 className="font-serif text-2xl text-ink tracking-tight">
                {plan.name}
              </h2>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="font-serif text-3xl text-ink tracking-tight">
                  {plan.price}
                </span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed flex-1">
                {plan.detail}
              </p>
              <ul className="mt-6 space-y-2.5 list-none p-0 m-0">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-ink/80 flex gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <GradientButton
                  href={plan.cta.href}
                  size="sm"
                  className="w-full justify-center"
                >
                  {plan.cta.label}
                </GradientButton>
              </div>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection>
        <SectionIntro
          title="Digital escrow & transaction routing"
          description="Anti-leakage settlement — all initial bookings and milestone retainers anchor in an automated escrow vault."
        />
        <FeatureList
          items={[
            {
              title: "Phase 1 — Upfront fund capture",
              body: "Before the matching and conflict workflow finalizes with selected professionals, the user funds the session via the platform payment gateway. Funds lock in an immutable milestone escrow vault.",
            },
            {
              title: "Phase 2 — Automated session validation",
              body: "The internal VoIP room monitors connection duration. When a 30-, 45-, or 60-minute session completes successfully, telemetry marks the milestone as Delivered.",
            },
            {
              title: "Phase 3 — Disbursement split & remittance",
              body: "On milestone confirmation, escrow deducts platform commissions or validates the subscription ledger, then remits the net payout to the provider’s corporate bank routing network.",
            },
            {
              title: "Session tiers in escrow",
              body: "Primary consults at 400 / 600 / 800 AED are secured upfront. Providers receive registry payout after successful timed completion, minus platform processing overhead.",
            },
          ]}
        />
      </MarketingSection>

      <MarketingSection tone="soft">
        <SectionIntro
          title="Anti-leakage retention controls"
          description="Keep high-value fees and identity release inside the platform transaction layer."
        />
        <FeatureList
          items={[
            {
              title: "Identity release lock",
              body: "Full legal names and corporate credentials stay behind platform encryption during conflict clearing. Records unmask between parties only once the escrow deposit is secured in the system ledger.",
            },
            {
              title: "Milestone escrow for full retainers",
              body: "After an anonymous call, counsel can generate a structured Platform Milestone Invoice in-app — keeping long-term processing fees inside the ecosystem.",
            },
            {
              title: "Automated arbitration for disputes",
              body: "If a call fails due to verified technical drops or a clear provider no-show, escrow routes funds to an internal review pool for friction-free client charge reversals or professional reapportionment.",
            },
            {
              title: "Corporate retention rules",
              body: "Top-up sessions after monthly caps, no unused balance rollover, and prepaid 6+2 hour blocks with 12-month expiry keep usage predictable.",
            },
          ]}
        />
        <div className="mt-12 grid md:grid-cols-3 gap-x-10 gap-y-10">
          {PRICING_RULES.map((rule) => (
            <div key={rule.title} className="border-t border-gray-200 pt-5">
              <h3 className="font-semibold text-ink tracking-tight">
                {rule.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {rule.detail}
              </p>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingCtaBand
        title="Not sure which allocation fits?"
        description="Tell us your monthly matter volume and we will recommend SME Shield, Corporate General, or Enterprise Max — with escrow-backed consults on every path."
        primaryHref="/request-demo"
        primaryLabel="Request a demo"
        secondaryHref="/ai/intake"
        secondaryLabel="Try AI Intake"
      />
    </>
  );
}
