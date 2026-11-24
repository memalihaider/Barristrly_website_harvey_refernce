import type { Metadata } from "next";
import Hero from "@/components/sections/hero";
import HomePricing from "@/components/sections/home-pricing";
import ServicesGrid from "@/components/sections/services-grid";
import HomeHowItWorks from "@/components/sections/home-how-it-works";
import TrustBar from "@/components/sections/trust-bar";
import HomeFaq from "@/components/sections/home-faq";
import CtaBanner from "@/components/sections/cta-banner";
import JsonLd from "@/components/seo/json-ld";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, faqJsonLd } from "@/lib/seo";
import { HOME_FAQ } from "@/lib/marketing/home-faq";

export const metadata: Metadata = {
  title: { absolute: DEFAULT_TITLE },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
};

export default function Home() {
  return (
    <>
      <JsonLd data={faqJsonLd(HOME_FAQ)} />
      <Hero />
      <HomePricing />
      <HomeHowItWorks />
      <ServicesGrid />
      <div className="bg-[#f5f3ef] text-ink">
        <TrustBar />
      </div>
      <HomeFaq />
      <div className="bg-[#f5f3ef] text-ink">
        <CtaBanner />
      </div>
    </>
  );
}
