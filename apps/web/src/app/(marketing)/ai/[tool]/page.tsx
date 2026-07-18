import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GradientButton from "@/components/ui/gradient-button";
import {
  MarketingSection,
  PageHero,
} from "@/components/marketing/section";
import { AI_TOOLS, aiToolFromSlug } from "@/lib/marketing/seo-slugs";

type Props = { params: Promise<{ tool: string }> };

export function generateStaticParams() {
  return AI_TOOLS.map((t) => ({ tool: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool: toolSlug } = await params;
  const tool = aiToolFromSlug(toolSlug);
  if (!tool) return { title: "AI | Barristrly" };
  return {
    title: `${tool.label} | Barristrly AI`,
    description: tool.summary,
  };
}

export default async function AiToolPage({ params }: Props) {
  const { tool: toolSlug } = await params;
  const tool = aiToolFromSlug(toolSlug);
  if (!tool) notFound();

  return (
    <>
      <PageHero
        eyebrow="AI"
        title={tool.label}
        description={tool.summary}
      >
        <GradientButton href="/ai/intake" size="lg">
          Start AI Intake
        </GradientButton>
        <GradientButton
          href="/ai"
          size="lg"
          variant="outline"
        >
          All AI tools
        </GradientButton>
      </PageHero>

      <MarketingSection tone="soft">
        <p className="text-gray-700 leading-relaxed max-w-2xl">
          {tool.label} runs inside Barristrly matter context — Marketplace
          intake and PracticeOS files — so suggestions stay tied to real work.
        </p>
        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          {AI_TOOLS.filter((t) => t.slug !== toolSlug).map((t) => (
            <Link
              key={t.slug}
              href={`/ai/${t.slug}`}
              className="border-t border-gray-300 pt-3 text-ink hover:text-primary transition-colors"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </MarketingSection>
    </>
  );
}
