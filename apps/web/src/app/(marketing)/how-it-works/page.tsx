import type { Metadata } from "next";
import { PageHero, MarketingSection, MarketingCtaBand } from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "How It Works | Barristrly",
  description:
    "Three simple steps to get legal help with Barristrly — tell us your need, choose a service, and get a clear next step within 24 hours.",
};

const STEPS = [
  {
    step: "1",
    title: "Tell us what you need",
    body: "Share a short summary of your situation — for example a contract, dispute, company issue, or family matter.",
  },
  {
    step: "2",
    title: "Choose how you want to proceed",
    body: "Start with free lawyer matching, book a paid consultation, or pick another service such as drafting, a retainer, or a will.",
  },
  {
    step: "3",
    title: "Get a clear next step",
    body: "We confirm within 24 hours with introductions, a meeting time, or a quote — so you always know what happens next.",
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
        description="Start with a free match, or book a consultation with a clear fee."
        primaryHref="/services/lawyer-matching#request"
        primaryLabel="Get matched for free"
        secondaryHref="/services/consultation#request"
        secondaryLabel="Book a consultation"
      />
    </>
  );
}
