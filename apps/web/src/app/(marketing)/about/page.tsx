import type { Metadata } from "next";
import {
  FeatureList,
  MarketingCtaBand,
  MarketingSection,
  PageHero,
  SectionIntro,
} from "@/components/marketing/section";
import FounderSection from "@/components/marketing/founder-section";
import { FOUNDER } from "@/lib/marketing/founder";

export const metadata: Metadata = {
  title: "About Barristrly — Legal Services Platform for the UAE & GCC",
  description:
    "Barristrly helps individuals and businesses in Dubai, Abu Dhabi and across the GCC find vetted lawyers and get clear, fairly priced legal support.",
  alternates: { canonical: "/about" },
};

const PILLARS = [
  {
    title: "The right specialist",
    body: "We match your need to lawyers who handle that kind of work every day — not a general inbox.",
  },
  {
    title: "Clear and careful",
    body: "Your details are shared only as needed to deliver the service you asked for.",
  },
  {
    title: "Fair, upfront pricing",
    body: "You see the scope and fee in AED before you proceed — so there are fewer surprises.",
  },
  {
    title: "UAE and GCC focus",
    body: "We support matters across mainland UAE, DIFC, ADGM, and related cross-border needs with India and the GCC.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Legal help made clearer for UAE & GCC"
        description="Barristrly is a legal services company. We help you find the right lawyer, book advice with clear fees, and access practical support for contracts, wills, company needs, and more."
      />

      <FounderSection />

      <MarketingSection>
        <SectionIntro
          eyebrow="Our purpose"
          title="Make finding legal help simpler"
          description="Built from real client frustration — and a belief that good legal support should be easier to reach."
        />
        <div className="max-w-3xl space-y-6 text-gray-600 leading-relaxed text-lg">
          <p>
            Too often, people rely on scattered referrals, pay for several first
            meetings, and still do not find the right fit. Barristrly exists to
            reduce that friction.
          </p>
          <p>
            We focus on clear requests, careful matching, transparent prices, and
            specialists who understand the UAE and GCC landscape.
          </p>
        </div>
      </MarketingSection>

      <MarketingSection tone="soft">
        <SectionIntro
          title="What we stand for"
          description="Four simple standards behind every Barristrly service."
        />
        <FeatureList items={PILLARS} />
      </MarketingSection>

      <MarketingSection>
        <SectionIntro
          title="Our motto"
          description="The belief that guides every Barristrly service."
        />
        <blockquote className="max-w-3xl border-l-4 border-primary pl-6">
          <p className="font-serif text-2xl md:text-3xl text-ink tracking-tight leading-snug">
            {FOUNDER.motto}
          </p>
        </blockquote>
      </MarketingSection>

      <MarketingCtaBand
        title="Ready for clear next steps?"
        description="Explore our seven services, or send a short note and we will point you to the simplest option."
        primaryHref="/services"
        primaryLabel="Explore services"
        secondaryHref="/request-demo"
        secondaryLabel="Contact us"
      />
    </>
  );
}
