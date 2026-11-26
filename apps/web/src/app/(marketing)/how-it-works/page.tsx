import type { Metadata } from "next";
import { PageHero, MarketingSection, MarketingCtaBand } from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "How It Works | Barristrly",
  description:
    "Three simple steps to get legal help with Barristrly — tell us your need, choose a service, and get a clear next step within 48 hours.",
};

const STEPS = [
  {
    step: "1",
    title: "Tell us what you need",
    body: "Share a short summary — matching a lawyer, a consultation, a contract, UAE company setup, a will, or ongoing legal cover.",
  },
  {
    step: "2",
    title: "Choose a service",
    body: "Pick from seven services: free lawyer matching, legal consultation, retainers, contract drafting, wills & estate, company formation & PRO, or e-books & templates.",
  },
  {
    step: "3",
    title: "Get a clear next step",
    body: "We confirm within 48 hours with introductions, a booked session, a quote, or matched professionals — so you always know what happens next.",
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
        description="Start with free matching, or book a consultation from AED 299."
        primaryHref="/services/lawyer-matching#request"
        primaryLabel="Get matched — free"
        secondaryHref="/services/consultation#request"
        secondaryLabel="Book a consultation"
      />
    </>
  );
}
