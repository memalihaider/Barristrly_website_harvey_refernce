import type { Metadata } from "next";
import GradientButton from "@/components/ui/gradient-button";
import {
  CertGrid,
  MarketingCtaBand,
  MarketingSection,
  PageHero,
  SectionIntro,
} from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Confidentiality | Barristrly",
  description:
    "How Barristrly looks after your information when you request matching, consultations, and other legal services.",
};

export default function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Confidentiality"
        title="Your matter stays confidential"
        description="Barristrly is a legal services company. We handle briefs, documents, and introductions with care — clear process, limited sharing, and vetted providers only."
      >
        <GradientButton href="/request-demo" size="lg">
          Contact us
        </GradientButton>
        <GradientButton href="/privacy" size="lg" variant="outline">
          Privacy policy
        </GradientButton>
      </PageHero>

      <MarketingSection tone="soft">
        <SectionIntro title="How we protect your matter" />
        <CertGrid
          items={[
            {
              title: "Need-to-know sharing",
              detail:
                "Provider details are shared only as required to deliver the service you requested — matching, consultation, drafting, or retainer work.",
            },
            {
              title: "Vetted network",
              detail:
                "Lawyers and specialists join through credential checks before receiving client briefs.",
            },
            {
              title: "Document handling",
              detail:
                "Uploads for drafting, wills, IP, and PRO services are used only to fulfill your request and quote.",
            },
            {
              title: "Clear commercial terms",
              detail:
                "Service fees are stated upfront in AED. Government and court fees are always separate and disclosed.",
            },
            {
              title: "Conflict awareness",
              detail:
                "Where a consultation or matching engagement requires it, we screen for obvious conflicts before introductions proceed.",
            },
            {
              title: "UAE data expectations",
              detail:
                "We operate with UAE PDPL-aligned practices for personal data collected through our service forms.",
            },
          ]}
        />
      </MarketingSection>

      <MarketingCtaBand
        title="Questions about confidentiality?"
        description="Contact our team before you submit sensitive documents — we will explain how your matter will be handled."
        primaryHref="/request-demo"
        primaryLabel="Contact us"
        secondaryHref="/services"
        secondaryLabel="Browse services"
      />
    </>
  );
}
