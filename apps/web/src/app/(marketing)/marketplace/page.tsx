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
          Legal Directory
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

      <MarketingSection tone="soft">
        <SectionIntro
          title="Marketplace features"
          description="The capabilities behind Legal Marketplace — also listed under Solutions in the menu."
        />
        <FeatureList
          items={[
            {
              title: "Anonymous directory",
              body: "Evaluate credentials on merit. Personal data stays hidden until both sides opt in. Practitioners judge facts and fit — not financial capability.",
            },
            {
              title: "Anonymous meetings",
              body: "Timed, escrow-protected audio/video. Contacts stay on the platform. Unmask only after you accept counsel.",
            },
            {
              title: "Two-gate COI",
              body: "Parties first. Narrative and documents locked until clearance. Conflict checks protected with cryptographic hashing.",
            },
            {
              title: "Global corridor",
              body: "Clients in India, Pakistan, and other countries hire UAE counsel without travelling. UAE clients do the same worldwide — evaluate, meet, and retain on-platform.",
            },
            {
              title: "Milestone escrow",
              body: "Session and engagement funds held until the meeting or milestone is verified — so cross-border hires are not blocked by informal wires.",
            },
            {
              title: "BARRI intake",
              body: "Classify practice area, forum, and urgency in minutes, then route into matching without exposing identity.",
            },
          ]}
        />
      </MarketingSection>

      <MarketingCtaBand
        dark
        title="Built for clients and providers"
        description="Clients get directory clarity, COI, and protected spend. Providers get qualified leads into the practice stack."
        primaryHref="/find-lawyers"
        primaryLabel="Legal Directory"
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
