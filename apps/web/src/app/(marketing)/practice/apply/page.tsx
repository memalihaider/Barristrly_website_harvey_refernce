import type { Metadata } from "next";
import ProviderOnboardingForm from "@/components/providers/provider-onboarding-form";
import { MarketingSection, PageHero } from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Apply as a Lawyer or Legal Provider",
  description:
    "Apply to join the Barristrly network — for licensed Advocates, Law Firms, Legal Consultants, Arbitrators, Tax & VAT Advisors, AML Specialists, Notaries, and Legal Translators in the UAE.",
  alternates: { canonical: "/practice/apply" },
};

export default function ProviderApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Provider onboarding"
        title="Join the Barristrly Network"
        description="Access vetted corporate & individual client leads, fixed-fee consultation requests (AED 1,000 + VAT), and cross-border referrals. All providers must upload valid professional trade licenses and regulatory practicing certificates prior to activation."
      />

      <MarketingSection tight>
        <div className="max-w-3xl">
          <ProviderOnboardingForm />
        </div>
      </MarketingSection>
    </>
  );
}
