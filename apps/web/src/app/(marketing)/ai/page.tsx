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
  title: "AI | Barristrly",
  description:
    "Legal research, drafting, contract review, intake, and agents — grounded in your matters.",
};

export default function AiPage() {
  return (
    <>
      <PageHero
        eyebrow="AI"
        title="Professional-class legal AI inside the work"
        description="Research, draft, review, and run agents where matters already live — starting with AI Intake that understands the case and matches counsel."
        aside={
          <ProductMock
            title="AI Intake"
            lines={[
              "Client: Terminated without notice after 3 years…",
              "Structured: Employment · AE-DIFC · High urgency",
              "Ready to match verified lawyers",
            ]}
          />
        }
      >
        <GradientButton href="/ai/intake" size="lg">
          Start AI Intake
        </GradientButton>
        <GradientButton href="/request-demo" size="lg" variant="outline">
          See AI in a demo
        </GradientButton>
      </PageHero>

      <MarketingSection tone="soft">
        <SectionIntro title="Tools" description="Each assistant sits inside the same matter context." />
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
        title="Start with intake"
        description="The fastest path into Barristrly is describing your case to the AI Intake assistant."
        primaryHref="/ai/intake"
        primaryLabel="Start AI Intake"
        secondaryHref="/marketplace"
        secondaryLabel="Marketplace"
      />
    </>
  );
}
