import type { Metadata } from "next";
import {
  FeatureList,
  MarketingCtaBand,
  MarketingSection,
  PageHero,
  SectionIntro,
} from "@/components/marketing/section";
import FounderSection from "@/components/marketing/founder-section";

export const metadata: Metadata = {
  title: "About | Barristrly",
  description:
    "Barristrly is a legal services company helping people and businesses in the UAE and GCC find the right lawyer and get clear, priced support.",
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

const ENTERPRISES = [
  {
    title: "Shezz Signature Properties",
    body: "Real estate and mortgage advisory for private and institutional buyers in the UAE.",
  },
  {
    title: "Shezz Management and Consultancy LLC",
    body: "Business advisory for strategy, compliance, and restructuring.",
  },
  {
    title: "Shezz One LLC",
    body: "Trading focused on bringing quality consumer products into the market.",
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

      <MarketingSection tone="soft">
        <SectionIntro
          title="Business leadership"
          description="Alongside legal practice, Heena is Co-Founder of the Shezz Group of Companies."
        />
        <FeatureList items={ENTERPRISES} />
      </MarketingSection>

      <MarketingSection>
        <SectionIntro
          title="Beyond work"
          description="Interests that shape a wider view of culture, markets, and responsibility."
        />
        <ul className="max-w-3xl space-y-4 text-gray-600 leading-relaxed list-none p-0 m-0">
          <li className="border-t border-gray-200 pt-4">
            <span className="font-semibold text-ink">Art and culture</span> —
            engaging with contemporary art and cultural institutions across the
            Middle East and South Asia.
          </li>
          <li className="border-t border-gray-200 pt-4">
            <span className="font-semibold text-ink">Environment</span> —
            supporting responsible business and sustainability.
          </li>
          <li className="border-t border-gray-200 pt-4">
            <span className="font-semibold text-ink">Reading and research</span>{" "}
            — following law, business history, and cross-border policy.
          </li>
          <li className="border-t border-gray-200 pt-4">
            <span className="font-semibold text-ink">Travel and markets</span> —
            learning from how people live, build, and trade across regions.
          </li>
        </ul>
      </MarketingSection>

      <MarketingCtaBand
        title="Ready for clear next steps?"
        description="Get matched with a lawyer for free, or book a fixed-fee consultation."
        primaryHref="/services/consultation#request"
        primaryLabel="Book a consultation"
        secondaryHref="/services/lawyer-matching#request"
        secondaryLabel="Get matched for free"
      />
    </>
  );
}
