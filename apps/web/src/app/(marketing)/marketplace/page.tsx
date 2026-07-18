import type { Metadata } from "next";
import Link from "next/link";
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
  title: "Marketplace | Barristrly",
  description:
    "Hire lawyers with AI intake, COI-aware matching, escrow, and encrypted consults.",
};

export default function MarketplacePage() {
  return (
    <>
      <PageHero
        eyebrow="Marketplace"
        title="Hire counsel without the blind handoff"
        description="Post a matter, get matched to verified lawyers, book an escrow-protected consult, and move into engagement — all in one flow."
        aside={
          <ProductMock
            title="Marketplace"
            lines={[
              "AI Intake structured your employment matter · Dubai DIFC",
              "3 matched lawyers · COI screening in progress",
              "Escrow hold ready · Consult slot available Thu 14:00",
            ]}
          />
        }
      >
        <GradientButton href="/ai/intake" size="lg">
          Start AI Intake
        </GradientButton>
        <GradientButton href="/find-lawyers" size="lg" variant="outline">
          Find lawyers
        </GradientButton>
      </PageHero>

      <MarketingSection tone="soft" tight>
        <StatRow
          stats={[
            { value: "AI", label: "Intake that structures facts" },
            { value: "COI", label: "Double-blind conflict checks" },
            { value: "Escrow", label: "Milestone-protected fees" },
            { value: "Meet", label: "Encrypted video consults" },
          ]}
        />
      </MarketingSection>

      <MarketingSection>
        <SectionIntro
          title="From story to matched counsel"
          description="Marketplace is built around intake — not a static directory dump."
        />
        <FeatureList
          items={[
            {
              title: "Conversational intake",
              body: "Clients describe their situation in plain language. Barristrly extracts practice area, jurisdiction, urgency, and a clean brief for counsel.",
            },
            {
              title: "Match with intent",
              body: "Ranking considers practice fit, jurisdiction, availability, and outcome signals — not just directory keywords.",
            },
            {
              title: "Consent and escrow",
              body: "Before a consult, both sides confirm scope. Funds sit in escrow until milestones clear.",
            },
            {
              title: "From lead to matter",
              body: "When you engage, the thread becomes a living matter with notes, documents, billing, and next actions.",
            },
          ]}
        />
      </MarketingSection>

      <MarketingCtaBand
        dark
        title="Built for clients and counsel"
        description="Clients get clarity and protected spend. Lawyers get qualified leads into PracticeOS."
        primaryHref="/ai/intake"
        primaryLabel="Start AI Intake"
        secondaryHref="/lawyer"
        secondaryLabel="Lawyer portal"
      />

      <MarketingSection>
        <div className="flex flex-wrap gap-6 text-sm">
          <Link href="/client" className="font-semibold text-primary hover:text-primary-hover">
            Client portal →
          </Link>
          <Link href="/request-demo" className="font-semibold text-ink hover:text-primary">
            Request a demo →
          </Link>
        </div>
      </MarketingSection>
    </>
  );
}
