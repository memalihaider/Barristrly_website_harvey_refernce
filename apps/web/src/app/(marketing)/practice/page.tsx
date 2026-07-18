import type { Metadata } from "next";
import GradientButton from "@/components/ui/gradient-button";
import {
  FeatureList,
  MarketingCtaBand,
  MarketingSection,
  PageHero,
  ProductMock,
  SectionIntro,
  StatRow,
} from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "PracticeOS | Barristrly",
  description:
    "CRM, matters, calendar, documents, billing, and accounting for lawyers and firms.",
};

export default function PracticePage() {
  return (
    <>
      <PageHero
        eyebrow="PracticeOS"
        title="Run your practice as a system"
        description="Pipeline, clients, calendar, documents, billing, and accounting — connected to Marketplace leads and AI assistants."
        aside={
          <ProductMock
            title="PracticeOS"
            lines={[
              "Pipeline: 4 new Marketplace leads",
              "Matter: Al-Rashid · Employment · Hearing Tue",
              "Escrow cleared · Invoice draft ready",
            ]}
          />
        }
      >
        <GradientButton href="/register?role=lawyer" size="lg">
          Join as a lawyer
        </GradientButton>
        <GradientButton href="/login" size="lg" variant="outline">
          Open lawyer portal
        </GradientButton>
      </PageHero>

      <MarketingSection tone="soft" tight>
        <StatRow
          stats={[
            { value: "CRM", label: "Pipeline and clients" },
            { value: "Docs", label: "Matter document vault" },
            { value: "Bill", label: "Escrow and invoices" },
            { value: "AI", label: "Assistants in context" },
          ]}
        />
      </MarketingSection>

      <MarketingSection>
        <SectionIntro title="What PracticeOS covers" />
        <FeatureList
          items={[
            {
              title: "Lead to matter",
              body: "Marketplace matches land in your pipeline. Approve, consult, and convert without switching tools.",
            },
            {
              title: "Matter workspace",
              body: "Timeline, notes, messages, deadlines, and documents stay attached to the engagement.",
            },
            {
              title: "Profile and discovery",
              body: "Public practice profile with jurisdictions, rates, and verification status for matching.",
            },
            {
              title: "Firm-ready accounting",
              body: "Track fees, escrow events, and practice economics from one ledger view.",
            },
          ]}
        />
      </MarketingSection>

      <MarketingCtaBand
        dark
        title="Built for solos and growing firms"
        description="Start with Marketplace demand. Scale into PracticeOS when the firm needs structure."
        primaryHref="/request-demo"
        primaryLabel="Book a practice demo"
        secondaryHref="/pricing"
        secondaryLabel="See pricing"
      />
    </>
  );
}
