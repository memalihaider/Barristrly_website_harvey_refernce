import type { Metadata } from "next";
import GradientButton from "@/components/ui/gradient-button";
import {
  CertGrid,
  FeatureList,
  MarketingCtaBand,
  MarketingSection,
  PageHero,
  ProductMock,
  SectionIntro,
} from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Enterprise | Barristrly",
  description:
    "CLM, compliance, analytics, and enterprise controls for in-house and large firms.",
};

export default function EnterprisePage() {
  return (
    <>
      <PageHero
        eyebrow="Enterprise"
        title="Legal operations with audit-grade control"
        description="Contract lifecycle, compliance workflows, analytics, and admin controls for in-house teams and multi-office firms."
        aside={
          <ProductMock
            title="Enterprise"
            lines={[
              "CLM: 12 renewals due this quarter",
              "Compliance: COI queue · 2 pending",
              "Analytics: Marketplace → engagement conversion",
            ]}
          />
        }
      >
        <GradientButton href="/request-demo" size="lg">
          Talk to sales
        </GradientButton>
        <GradientButton href="/security" size="lg" variant="outline">
          Security overview
        </GradientButton>
      </PageHero>

      <MarketingSection>
        <SectionIntro title="Enterprise modules" />
        <FeatureList
          items={[
            {
              title: "Contract lifecycle",
              body: "Track obligations, renewals, and review cycles alongside matter work — not in a disconnected CLM silo.",
            },
            {
              title: "Compliance and COI",
              body: "Conflict workflows, policy checks, and admin oversight for regulated practices.",
            },
            {
              title: "Analytics and briefs",
              body: "Executive insights across marketplace, practice, and engagement health.",
            },
            {
              title: "Roadmap controls",
              body: "SSO, API, and deeper identity integrations planned — engage sales for timeline fit.",
            },
          ]}
        />
      </MarketingSection>

      <MarketingSection tone="soft">
        <SectionIntro title="Who it’s for" />
        <CertGrid
          items={[
            {
              title: "In-house counsel",
              detail: "Intake routing, panel counsel, and spend visibility.",
            },
            {
              title: "Large firms",
              detail: "Multi-lawyer pipelines, admin roles, and matter controls.",
            },
            {
              title: "Platform admins",
              detail: "Approvals, audit, billing, ads, and compliance dashboards.",
            },
          ]}
        />
      </MarketingSection>

      <MarketingCtaBand
        title="Design the rollout with us"
        description="We scope Marketplace, PracticeOS, and Enterprise modules to your corridor."
        primaryHref="/request-demo"
        primaryLabel="Request a demo"
      />
    </>
  );
}
