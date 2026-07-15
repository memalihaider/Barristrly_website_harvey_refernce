import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";
import TrustBar from "@/components/sections/trust-bar";
import PlatformOverview from "@/components/sections/platform-overview";
import FeatureScroll from "@/components/sections/feature-scroll";
import TestimonialHighlight from "@/components/sections/testimonial-highlight";
import CaseStudies from "@/components/sections/case-studies";
import StatsSection from "@/components/sections/stats-section";
import SecuritySection from "@/components/sections/security-section";
import CtaBanner from "@/components/sections/cta-banner";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <PlatformOverview />
        <FeatureScroll />
        <TestimonialHighlight />
        <CaseStudies />
        <StatsSection />
        <SecuritySection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
