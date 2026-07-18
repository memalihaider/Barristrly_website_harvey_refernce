import Hero from "@/components/sections/hero";
import TrustBar from "@/components/sections/trust-bar";
import PlatformOverview from "@/components/sections/platform-overview";
import FeatureScroll from "@/components/sections/feature-scroll";
import CaseStudies from "@/components/sections/case-studies";
import StatsSection from "@/components/sections/stats-section";
import HomePricing from "@/components/sections/home-pricing";
import SecuritySection from "@/components/sections/security-section";
import TestimonialsSlider from "@/components/sections/testimonials-slider";
import CtaBanner from "@/components/sections/cta-banner";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <PlatformOverview />
      <FeatureScroll />
      <CaseStudies />
      <StatsSection />
      <HomePricing />
      <SecuritySection />
      <TestimonialsSlider />
      <CtaBanner />
    </>
  );
}
