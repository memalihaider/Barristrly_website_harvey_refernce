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
    "Premier legal tech marketplace — anonymous directory, COI clearance, escrow consults, and global provider matching.",
};

export default function MarketplacePage() {
  return (
    <>
      <PageHero
        eyebrow="Marketplace"
        title="The legal aggregator for precise matches"
        description="Connect with lawyers, consultants, arbitrators, and legal service providers through an anonymous directory — every engagement runs automated conflict checks before consultation."
        aside={
          <ProductMock
            title="Marketplace"
            lines={[
              "Anonymous directory · practice + forum tags",
              "COI clearance · adverse parties screened",
              "Escrow funded · masked VoIP consult ready",
            ]}
          />
        }
      >
        <GradientButton href="/find-lawyers" size="lg">
          Legal Direction
        </GradientButton>
        <GradientButton href="/request-demo" size="lg" variant="outline">
          Schedule Meeting
        </GradientButton>
      </PageHero>

      <MarketingSection tone="soft" tight>
        <StatRow
          stats={[
            { value: "Gate 1", label: "Party data before narrative" },
            { value: "COI", label: "Blind firm affirmation" },
            { value: "Escrow", label: "Unlock after payment" },
            { value: "Meet", label: "Encrypted video consults" },
          ]}
        />
      </MarketingSection>

      <MarketingSection>
        <SectionIntro
          title="From parties to matched counsel"
          description="Marketplace runs a two-gate conflict workflow — not a static directory dump."
        />
        <FeatureList
          items={[
            {
              title: "Registration gate",
              body: "Clients profile themselves and list adverse parties first. Case narrative and document upload stay locked so privileged facts never enter before COI runs.",
            },
            {
              title: "Blind match & affirmation",
              body: "Firms receive only Case ID, practice area, claim value, and opposing-party nodes. Accept Lead requires a mandatory conflict certification before any client reveal.",
            },
            {
              title: "Payment-gated unblind",
              body: "Client name and documents unlock only when affirmation and payment succeed. Escrow holds fees until milestones clear.",
            },
            {
              title: "Post-unlock quarantine",
              body: "If a conflict surfaces after reveal, firms can report within 24 hours — access is revoked, credits issued, and the matter rematches to the next clear firm.",
            },
          ]}
        />
      </MarketingSection>

      <MarketingCtaBand
        dark
        title="Built for clients and providers"
        description="Clients get directory clarity, COI, and protected spend. Providers get qualified leads into PracticeOS."
        primaryHref="/find-lawyers"
        primaryLabel="Legal Direction"
        secondaryHref="/request-demo"
        secondaryLabel="Schedule Meeting"
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
