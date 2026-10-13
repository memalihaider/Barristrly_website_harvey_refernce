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
  title: "For Legal Providers | Barristrly",
  description:
    "Join the Barristrly network — Advocates, Law Firms, Arbitrators, Tax Agents, AML Consultants, Notaries, and Sworn Translators. Vetted leads, 24-hour SLA, zero listing cost.",
};

export default function PracticePage() {
  return (
    <>
      <PageHero
        eyebrow="Service Provider Onboarding Hub"
        title="Join the Barristrly network at zero listing cost"
        description="A dedicated portal for Advocates, Law Firms, Arbitrators, Tax Agents, AML Consultants, Notaries, and Sworn Translators to receive vetted, jurisdiction-matched client briefs."
        aside={
          <ProductMock
            title="Provider onboarding"
            lines={[
              "Upload trade license & practicing certificate",
              "Get matched by jurisdiction & practice area",
              "Respond within the 24-hour SLA",
            ]}
          />
        }
      >
        <GradientButton href="/practice/apply" size="lg">
          Join the Provider Network
        </GradientButton>
        <GradientButton href="/request-demo" size="lg" variant="outline">
          Schedule a Call
        </GradientButton>
      </PageHero>

      <MarketingSection tone="soft" tight>
        <StatRow
          stats={[
            { value: "AED 0", label: "Listing fee" },
            { value: "24h", label: "SLA to acknowledge a lead & send a proposal" },
            { value: "3", label: "Max providers a brief is sent to" },
            { value: "PDPL", label: "UAE data protection compliant" },
          ]}
        />
      </MarketingSection>

      <MarketingSection>
        <SectionIntro
          eyebrow="Onboarding"
          title="Vetting & licensing"
          description="All Advocates, Law Firms, Legal Consultants, Tax Agents, AML Consultants, Notaries, and Sworn Translators seeking to join the network must complete our Provider Onboarding Form and upload valid credentials."
        />
        <FeatureList
          items={[
            {
              title: "Active UAE Trade License",
              body: "Upload a current trade license for your firm or practice.",
            },
            {
              title: "Practicing certificate",
              body: "From the Ministry of Justice (MOJ), Dubai Legal Affairs Department, ADJD, DIFC Courts, ADGM Courts, or the Federal Tax Authority (FTA), as applicable to your practice.",
            },
            {
              title: "Jurisdiction & practice area tagging",
              body: "Tell us the forums you cover — Mainland Dubai/Abu Dhabi Courts, DIFC, ADGM, RDC, MOHRE — and the practice areas you take, so briefs reach the right providers.",
            },
            {
              title: "Confidentiality obligations",
              body: "Providers sign confidentiality obligations before receiving client intake briefs, consistent with our Privacy Policy.",
            },
          ]}
        />
      </MarketingSection>

      <MarketingSection tone="soft" id="sla">
        <SectionIntro
          title="Your obligations once onboarded"
          description="Clear, predictable rules that keep response times fast and fees transparent."
        />
        <FeatureList
          items={[
            {
              title: "24-hour SLA commitment",
              body: "Acknowledge incoming lead briefs and provide a transparent, itemized fee proposal to the Client within 24 business hours.",
            },
            {
              title: "Administrative fee structure",
              body: "Marketing, origination, and administrative platform fees payable to Barristrly are structured strictly in compliance with UAE legal practice frameworks — as administrative technology, marketing, and lead generation charges, not fee-splitting.",
            },
            {
              title: "Direct client engagement",
              body: "Once matched, the attorney-client relationship and fee arrangement are formed directly between you and the Client — Barristrly is not a party to that engagement.",
            },
            {
              title: "Dedicated Consultation bookings",
              body: "For AED 1,000 + 5% VAT Dedicated Consultations, Barristrly handles scheduling and payment; you deliver the 45–60 minute session, pre-meeting document review, and post-meeting roadmap.",
            },
          ]}
        />
      </MarketingSection>

      <MarketingCtaBand
        dark
        title="Built for solos and growing firms"
        description="List free. Get vetted, jurisdiction-matched briefs. Respond within 24 hours. Grow your practice through Barristrly."
        primaryHref="/practice/apply"
        primaryLabel="Join the Provider Network"
        secondaryHref="/pricing"
        secondaryLabel="See client pricing"
      />
    </>
  );
}
