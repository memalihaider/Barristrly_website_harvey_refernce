import type { Metadata } from "next";
import {
  FeatureList,
  MarketingCtaBand,
  MarketingSection,
  PageHero,
  SectionIntro,
} from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "About | Barristrly",
  description:
    "Barristrly is a premier legal tech marketplace — anonymous directory, COI, and confidential meetings connecting clients with counsel across India and the GCC.",
};

const PILLARS = [
  {
    title: "High-precision specialization",
    body: "Map legal needs to micro-specialties — so a DIFC dispute, MoHRE arbitration, or GDRFA travel-ban matter reaches a practitioner who handles that arena daily.",
  },
  {
    title: "Absolute client anonymity",
    body: "Contact details, identities, and phone numbers stay masked from attorneys during intake. Unmasking happens only after consultation and the client clicks Accept.",
  },
  {
    title: "Elimination of predatory friction",
    body: "Replace repetitive open-ended intro fees with clear financial tiers and value-driven matching — so procurement is transparent from the first step.",
  },
  {
    title: "The India–GCC legal corridor",
    body: "Build digitally integrated infrastructure connecting commercial and private legal landscapes across India and the GCC for cross-border expansion and asset protection.",
  },
];

const ENTERPRISES = [
  {
    title: "Shezz Signature Properties",
    body: "Premier real estate brokerage and mortgage advisory for institutional and private asset acquisitions across the UAE.",
  },
  {
    title: "Shezz Management and Consultancy LLC",
    body: "Corporate advisory for strategy, regulatory compliance scaffolding, and operational restructuring for international enterprises.",
  },
  {
    title: "Shezz One LLC",
    body: "General trading focused on supply-chain localization and launch of premium consumer products across cosmetics, baby care, and luxury fragrance.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Premier legal tech marketplace"
        description="Barristrly is an aggregator connecting clients to lawyers, experts, arbitrators, and legal service providers — with an anonymous directory, confidential meeting scheduling, and automated conflict checks before every consult."
      />

      <MarketingSection>
        <SectionIntro
          eyebrow="Corporate vision"
          title="Bridging the regional legal gap"
          description="A mission to redefine professional matchmaking — from Heena Mohammed, Co-Founder & Chairperson."
        />
        <div className="max-w-3xl space-y-6 text-gray-600 leading-relaxed text-lg">
          <p>
            Through more than a decade of practice across India and the UAE,
            Heena Mohammed observed a damaging market friction: fragmentation in
            how clients find the right lawyer. Without a centralized, transparent
            platform, people rely on unstructured referrals — then pay sequential
            consultation fees only to receive mismatched guidance.
          </p>
          <p>
            Driven by the belief that precise legal representation is a pillar of
            economic security, Barristrly was built as the ultimate mediator:
            intelligent categorization, historical track records, and operational
            transparency that match clients to specialists by practice vertical,
            jurisdiction, and budget.
          </p>
        </div>
      </MarketingSection>

      <MarketingSection tone="soft">
        <SectionIntro
          title="Four non-negotiable pillars"
          description="The long-term trajectory of the platform rests on these mandates."
        />
        <FeatureList items={PILLARS} />
      </MarketingSection>

      <MarketingSection>
        <SectionIntro
          eyebrow="Founder"
          title="Heena Mohammed"
          description="Co-Founder & Chairperson — legal professional, multi-sector entrepreneur, and legal-tech innovator based in Dubai."
        />
        <div className="max-w-3xl space-y-6 text-gray-600 leading-relaxed">
          <p>
            With over a decade spanning the legal landscapes of India and the
            United Arab Emirates, Heena has built a reputation as a corporate
            strategist and high-value transactional consultant — at the
            intersection of traditional advocacy and modern enterprise.
          </p>
          <p>
            She is a registered Legal Consultant with the Dubai Legal Affairs
            Department and an Advocate Member of the Bar Council of India. She
            holds an LL.B. from Government Law College (GLC), Mumbai University,
            and a B.Sc. from Mumbai University — a blend of scientific training
            and rigorous legal scholarship that shapes her approach to corporate
            structuring, risk mitigation, and commercial dispute resolution.
          </p>
          <p>
            Across UAE practice at Abdalla Alowais Advocates and Legal
            Consultants, Petrogulf Oil Manufacturing LLC, and FAL Oil Co. Ltd.,
            her portfolio includes multi-million-dollar maritime arbitrations
            across London, Paris, and the UAE, alongside DIFC Courts and DIAC
            frameworks — from cross-border M&A and share-swap arrangements to
            settlements in banking, labor, and construction.
          </p>
        </div>
      </MarketingSection>

      <MarketingSection tone="soft">
        <SectionIntro
          title="Commercial leadership"
          description="Parallel to legal practice, Heena is Co-Founder of the Shezz Group of Companies."
        />
        <FeatureList items={ENTERPRISES} />
      </MarketingSection>

      <MarketingSection>
        <SectionIntro
          title="Beyond the boardroom"
          description="Curated pursuits that enrich a strategic lens across culture, sustainability, and markets."
        />
        <ul className="max-w-3xl space-y-4 text-gray-600 leading-relaxed list-none p-0 m-0">
          <li className="border-t border-gray-200 pt-4">
            <span className="font-semibold text-ink">Fine art curation</span> —
            modern and contemporary collection, engaging cultural institutions
            across the Middle East and South Asia.
          </li>
          <li className="border-t border-gray-200 pt-4">
            <span className="font-semibold text-ink">
              Environmental conservation
            </span>{" "}
            — advocacy for sustainable development, ecological equilibrium, and
            corporate environmental responsibility.
          </li>
          <li className="border-t border-gray-200 pt-4">
            <span className="font-semibold text-ink">
              Jurisprudential literature
            </span>{" "}
            — classical jurisprudence, global economic histories, and
            cross-border commercial policy.
          </li>
          <li className="border-t border-gray-200 pt-4">
            <span className="font-semibold text-ink">
              Global travel & market analysis
            </span>{" "}
            — tracking consumer trends, architectural real estate innovation, and
            cross-border trade flows.
          </li>
        </ul>
      </MarketingSection>

      <MarketingCtaBand
        title="Find your exact legal match"
        description="Whether you need counsel, want to join the provider panel, or schedule a confidential meeting — start with BARRI or talk to our team."
        primaryHref="/request-demo"
        primaryLabel="Schedule Meeting"
        secondaryHref="/ai/intake"
        secondaryLabel="Ask BARRI"
      />
    </>
  );
}
