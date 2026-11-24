import type { Metadata } from "next";
import { PageHero, MarketingSection, MarketingCtaBand } from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "How to Find the Right Lawyer in Dubai in 3 Steps",
  description:
    "Tell us what you need, choose a service, and get matched with a vetted UAE lawyer or specialist — with a clear quote and next step within 48 hours.",
  alternates: { canonical: "/how-it-works" },
};

const STEPS = [
  {
    step: "1",
    title: "Tell us what you need",
    body: "Share a short summary — arbitration support, a contract, UAE company setup, a will, or ongoing legal cover.",
  },
  {
    step: "2",
    title: "Choose a service",
    body: "Pick from our six services: arbitration, agreements & e-books, company formation & PRO, wills, contract drafting, or a flexible retainer.",
  },
  {
    step: "3",
    title: "Get a clear next step",
    body: "We confirm within 48 hours with introductions, a quote, or matched professionals — so you always know what happens next.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Three simple steps"
        description="No complicated process. Tell us your need, choose a service, and receive a clear next step."
      />

      <MarketingSection>
        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {STEPS.map((s) => (
            <div key={s.step} className="border-t border-gray-200 pt-6">
              <p className="font-serif text-3xl text-primary tracking-tight">{s.step}</p>
              <h3 className="mt-3 font-serif text-xl text-ink tracking-tight">{s.title}</h3>
              <p className="mt-2.5 text-gray-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingCtaBand
        title="Ready to begin?"
        description="Browse our six services, or send a short message and we will guide you."
        primaryHref="/services"
        primaryLabel="Explore services"
        secondaryHref="/request-demo"
        secondaryLabel="Contact us"
      />
    </>
  );
}
