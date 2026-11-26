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
        description="Access vetted corporate and individual client leads, optional paid consultation bookings, and cross-border referrals. Upload valid trade licences and practising certificates for review. Applying does not create a website login — approved providers receive requests by email."
      />

      <MarketingSection tight>
        <div className="max-w-3xl">
          <ProviderOnboardingForm />
        </div>
      </MarketingSection>
    </>
  );
}
