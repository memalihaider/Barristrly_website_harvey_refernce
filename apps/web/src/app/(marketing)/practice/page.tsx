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
    "Provider panel for Barristrly’s legal marketplace — zero listing fees, pre-vetted leads, 12-hour COI SLA, and escrow consult payouts.",
};

export default function PracticePage() {
  return (
    <>
      <PageHero
        eyebrow="PracticeOS · Provider panel"
        title="Join the marketplace panel at zero listing cost"
        description="List on Barristrly’s aggregator with no subscription overhead. Receive structured, conflict-ready intent briefs — clear opponents in 12 hours, consult on masked VoIP, and get paid from escrow when the session completes."
        aside={
          <ProductMock
            title="PracticeOS"
            lines={[
              "Marketplace lead · adverse parties · 12h COI SLA",
              "Conflict clear · anonymous meeting session",
              "Escrow delivered · payout to registry",
            ]}
          />
        }
      >
        <GradientButton href="/register?role=lawyer" size="lg">
          Join as a provider
        </GradientButton>
        <GradientButton href="/request-demo" size="lg" variant="outline">
          Schedule Meeting
        </GradientButton>
      </PageHero>

      <MarketingSection tone="soft" tight>
        <StatRow
          stats={[
            { value: "AED 0", label: "Listing / subscription fee" },
            { value: "12h", label: "Conflict clearance SLA" },
            { value: "Escrow", label: "Consult fees secured upfront" },
            { value: "VoIP", label: "Tokenized anonymous sessions" },
          ]}
        />
      </MarketingSection>

      <MarketingSection>
        <SectionIntro
          eyebrow="Supply-side"
          title="The provider value proposition"
          description="Build an elite, responsive panel by removing entry friction while enforcing platform-mediated conflict clearing and intake loops."
        />
        <FeatureList
          items={[
            {
              title: "Zero listing fees",
              body: "Lawyers, arbitrators, and experts register and list profiles with zero subscription overhead — eliminating initial supply-side friction so the panel can scale.",
            },
            {
              title: "Pre-vetted lead routing",
              body: "Instead of sorting raw inquiries, providers receive structured intent briefs that already cleared baseline parameter matching.",
            },
            {
              title: "Systemized conflict clearing",
              body: "The platform pushes target adverse-party names into your internal conflict workspace so compliance can check records instantly — without revealing client identity prematurely.",
            },
            {
              title: "PracticeOS workspace",
              body: "Marketplace leads land in your pipeline with matter workspace, documents, calendar, and ledger views for the full engagement.",
            },
          ]}
        />
      </MarketingSection>

      <MarketingSection tone="soft">
        <SectionIntro
          title="Provider SLA & engagement mandates"
          description="Strict rules that protect responsiveness, anonymity, and fee capture."
        />
        <FeatureList
          items={[
            {
              title: "12-hour conflict window",
              body: "When a client targets you in their top 2–3 selection, you have 12 hours to review opponent names and submit conflict clearance. Failure to respond auto-reverts the lead to the available pool.",
            },
            {
              title: "Tokenized identity compliance",
              body: "Initial consultations run in the metadata-masked anonymous VoIP chamber using rotating session token IDs. Harvesting client data off-platform before an executed retainer triggers algorithmic penalization.",
            },
            {
              title: "Fee structures & escrow payout",
              body: "Primary consultation fees (400 / 600 / 800 AED tiers) are secured in platform escrow upfront. Payouts clear to your registry balance on successful completion of the timed session, minus standard platform processing overhead.",
            },
            {
              title: "Lead to matter",
              body: "After consult, convert into a living matter with notes, documents, milestone invoices, and PracticeOS accounting — without switching tools.",
            },
          ]}
        />
      </MarketingSection>

      <MarketingCtaBand
        dark
        title="Built for solos and growing firms"
        description="List free. Clear conflicts fast. Get paid from escrow. Scale into PracticeOS when the firm needs structure."
        primaryHref="/register?role=lawyer"
        primaryLabel="Join as a lawyer"
        secondaryHref="/pricing"
        secondaryLabel="See escrow & pricing"
      />
    </>
  );
}
