import type { Metadata } from "next";
import { PageHero, MarketingSection, MarketingCtaBand } from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "How It Works | Barristrly",
  description:
    "A 3-step guided intake: classify your issue, choose your jurisdiction and service option, and get matched with up to three vetted UAE-licensed legal providers.",
};

const STEPS = [
  {
    step: "1",
    title: "Classify your issue",
    body: "Tell us what's happening — pick the practice area that fits your matter, from mainland litigation to AML compliance.",
  },
  {
    step: "2",
    title: "Choose your jurisdiction & service option",
    body: "Select Mainland (Dubai/Abu Dhabi Courts), DIFC, ADGM, or RDC, then pick Free Lawyer Sourcing & Matching or a Dedicated Legal Consultation.",
  },
  {
    step: "3",
    title: "Upload documents & submit",
    body: "Attach any supporting documents. We route your brief to up to three vetted Service Providers, who respond within a 24-hour SLA.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="A guided 3-step intake"
        description="Classify your issue, choose your jurisdiction and service option, and get matched with the right UAE-licensed legal provider."
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
        title="Ready to get started?"
        description="Submit your brief for a free match, or book a dedicated consultation directly."
        primaryHref="/ai/intake"
        primaryLabel="Submit Your Legal Brief — Free Match"
        secondaryHref="/pricing"
        secondaryLabel="Book a Consultation"
      />
    </>
  );
}
