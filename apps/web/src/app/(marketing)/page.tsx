import Hero from "@/components/sections/hero";
import PlatformOverview from "@/components/sections/platform-overview";
import FeatureScroll from "@/components/sections/feature-scroll";
import VettedProviders from "@/components/sections/vetted-providers";
import FeaturesProcess from "@/components/sections/features-process";
import DirectoryMarquee from "@/components/sections/directory-marquee";
import FeatureDepth from "@/components/sections/feature-depth";
import TestimonialsSlider from "@/components/sections/testimonials-slider";
import HomePricing from "@/components/sections/home-pricing";
import TrustBar from "@/components/sections/trust-bar";
import SecuritySection from "@/components/sections/security-section";
import CtaBanner from "@/components/sections/cta-banner";

export default function Home() {
  return (
    <>
      <Hero />
      <PlatformOverview />
      <FeatureScroll />
      <VettedProviders />
      <FeaturesProcess />
      <DirectoryMarquee />
      <FeatureDepth />
      <TestimonialsSlider />
      <HomePricing />
      <TrustBar />
      <SecuritySection />
      <CtaBanner />
    </>
  );
}
