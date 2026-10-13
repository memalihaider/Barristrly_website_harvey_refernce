import Hero from "@/components/sections/hero";
import HomePricing from "@/components/sections/home-pricing";
import ServicesGrid from "@/components/sections/services-grid";
import TrustBar from "@/components/sections/trust-bar";
import CtaBanner from "@/components/sections/cta-banner";

export default function Home() {
  return (
    <>
      <Hero />
      <HomePricing />
      <ServicesGrid />
      <div className="bg-[#f5f3ef] text-ink">
        <TrustBar />
        <CtaBanner />
      </div>
    </>
  );
}
