import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/section";
import GradientButton from "@/components/ui/gradient-button";
import ServicesGrid from "@/components/sections/services-grid";
import HomePricing from "@/components/sections/home-pricing";

export const metadata: Metadata = {
  title: "Services & Pricing | Barristrly",
  description:
    "Find & hire the right UAE-licensed lawyer in 24 hours — free lawyer sourcing & matching, or a dedicated 45-60 minute legal consultation, across 7 dedicated practice pillars.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Find & Hire the Right UAE-Licensed Lawyer in 24 Hours"
        description="Submit a brief for a free match with up to three vetted advocates, or book a dedicated consultation with a senior practitioner."
      >
        <GradientButton href="/ai/intake" size="lg">
          Submit Your Legal Brief — Free Match
        </GradientButton>
        <GradientButton href="/pricing" size="lg" variant="outline">
          Book a 45-Min Fixed-Fee Consultation
        </GradientButton>
      </PageHero>

      <HomePricing />
      <ServicesGrid />
    </>
  );
}
