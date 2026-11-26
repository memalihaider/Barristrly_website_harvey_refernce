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
  title: "Join Our UAE Lawyer Network — Get Qualified Client Leads",
  description:
    "Lawyers, law firms and legal consultants in the UAE: receive pre-screened client requests, respond within 48 hours, and grow your practice with no listing fee.",
  alternates: { canonical: "/practice" },
};

export default function PracticePage() {
  return (
    <>
      <PageHero
        eyebrow="For lawyers & legal providers"
        title="Join Barristrly at no listing fee"
        description="Receive carefully reviewed client requests matched to your practice area and location. Respond within 48 hours with a clear proposal."
        aside={
          <ProductMock
            title="How joining works"
            lines={[
              "Upload your licence and practising certificate",
              "Get matched to the right client requests",
              "Reply within 48 hours with your proposal",
            ]}
          />
        }
      >
        <GradientButton href="/practice/apply" size="lg">
          Apply to join
        </GradientButton>
        <GradientButton href="/request-demo" size="lg" variant="outline">
          Contact us
        </GradientButton>
      </PageHero>

      <MarketingSection tone="soft" tight>
        <StatRow
          stats={[
            { value: "AED 0", label: "Listing fee" },
            { value: "48h", label: "Time to reply with a proposal" },
            { value: "3", label: "Maximum lawyers per client request" },
            { value: "UAE", label: "Credentials reviewed with care" },
          ]}
        />
      </MarketingSection>

      <MarketingSection>
        <SectionIntro
          eyebrow="Joining"
          title="Checks before you join"
          description="Lawyers, firms, and specialists complete a short application and upload valid credentials before receiving client requests."
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
              title: "48-hour SLA commitment",
              body: "Acknowledge incoming lead briefs and provide a transparent, itemized fee proposal to the Client within 48 business hours.",
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
              title: "Paid consultation sessions",
              body: "When you opt into paid consultations, Barristrly schedules sessions at published client rates (from AED 299). You deliver the timed session; fees and scope are confirmed before each booking.",
            },
          ]}
        />
      </MarketingSection>

      <MarketingSection>
        <SectionIntro
          title="Documents & access"
          description="What happens to your uploads — and how you work with Barristrly after you apply."
        />
        <FeatureList
          items={[
            {
              title: "Where your documents are kept",
              body: "Licence and practising-certificate uploads are used only to verify your credentials for the Barristrly network. They are reviewed by our team, stored securely for onboarding and compliance checks, and are not published publicly or shared with clients as open downloads.",
            },
            {
              title: "No automatic login after applying",
              body: "Submitting an application does not create a public login account. After approval, client requests and updates are sent to the official email you provide. We do not issue website login credentials as part of joining the network.",
            },
          ]}
        />
      </MarketingSection>

      <MarketingCtaBand
        dark
        title="Built for solos and growing firms"
        description="List free. Get vetted, jurisdiction-matched briefs. Respond within 48 hours. Grow your practice through Barristrly."
        primaryHref="/practice/apply"
        primaryLabel="Join the Provider Network"
        secondaryHref="/pricing"
        secondaryLabel="See client pricing"
      />
    </>
  );
}
