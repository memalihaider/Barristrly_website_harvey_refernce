import type { Metadata } from "next";
import Link from "next/link";
import GradientButton from "@/components/ui/gradient-button";
import {
  FeatureList,
  MarketingCtaBand,
  MarketingSection,
  PageHero,
  ProductMock,
  SectionIntro,
} from "@/components/marketing/section";
import { AI_TOOLS } from "@/lib/marketing/seo-slugs";

export const metadata: Metadata = {
  title: "BARRI | Barristrly",
  description:
    "BARRI — AI intake and triage for the Barristrly legal marketplace. Classify matters, then match providers.",
};

export default function AiPage() {
  return (
    <>
      <PageHero
        eyebrow="BARRI"
        title="AI that feeds the marketplace — not a LegalOS desk"
        description="BARRI classifies your matter for matching. Research and draft helpers support briefs — the product is aggregator matchmaking, anonymous directory, and scheduled consults."
        aside={
          <ProductMock
            title="BARRI"
            lines={[
              "Client: Terminated without notice after 3 years…",
              "Structured: Employment · AE-DIFC · High urgency",
              "Ready to match vetted providers",
            ]}
          />
        }
      >
        <GradientButton href="/ai/intake" size="lg">
          Open BARRI
        </GradientButton>
        <GradientButton href="/request-demo" size="lg" variant="outline">
          Schedule Meeting
        </GradientButton>
      </PageHero>

      <MarketingSection tone="soft">
        <SectionIntro
          title="Tools"
          description="Helpers that support marketplace matching — not a standalone LegalOS workspace."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {AI_TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/ai/${tool.slug}`}
              className="group border-t border-gray-200 pt-5 block"
            >
              <h3 className="font-serif text-xl text-ink group-hover:text-primary transition-colors tracking-tight">
                {tool.label}
              </h3>
              <p className="mt-2.5 text-sm text-gray-600 leading-relaxed">
                {tool.summary}
              </p>
            </Link>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection>
        <FeatureList
          items={[
            {
              title: "Grounded in the matter",
              body: "Prompts can pull from intake briefs, documents, and notes — reducing generic answers and copy-paste risk.",
            },
            {
              title: "Human in the loop",
              body: "Outputs are suggestions. Lawyers approve, edit, and attach work product to the matter trail.",
            },
            {
              title: "Jurisdiction aware",
              body: "Ontology for GCC and corridor practice areas keeps routing and labeling consistent across products.",
            },
            {
              title: "Audit-friendly",
              body: "Sessions and actions can be tracked for firm and enterprise compliance reviews.",
            },
          ]}
        />
      </MarketingSection>

      <MarketingCtaBand
        title="Start with BARRI"
        description="Describe your matter to BARRI — we classify, clear privacy gates, and route toward matched providers."
        primaryHref="/ai/intake"
        primaryLabel="Open BARRI"
        secondaryHref="/marketplace"
        secondaryLabel="Marketplace"
      />
    </>
  );
}
