import type { Metadata } from "next";
import Link from "next/link";
import GradientButton from "@/components/ui/gradient-button";
import {
  MarketingCtaBand,
  MarketingSection,
  PageHero,
  SectionIntro,
} from "@/components/marketing/section";
import { allPracticeSlugs, SEO_CITIES } from "@/lib/marketing/seo-slugs";

export const metadata: Metadata = {
  title: "Find Lawyers | Barristrly",
  description:
    "Browse lawyers by practice area and city across the GCC corridor.",
};

export default function FindLawyersPage() {
  const practices = allPracticeSlugs();

  return (
    <>
      <PageHero
        eyebrow="Directory"
        title="Find lawyers by practice and city"
        description="Explore Barristrly’s directory hubs — or start with AI Intake for matched introductions."
      >
        <GradientButton href="/ai/intake" size="lg">
          Start AI Intake
        </GradientButton>
        <GradientButton href="/register?role=client" size="lg" variant="outline">
          Post a case
        </GradientButton>
      </PageHero>

      <MarketingSection>
        <SectionIntro title="Practice areas" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          {practices.map((p) => (
            <Link
              key={p.slug}
              href={`/lawyers/${p.slug}`}
              className="text-ink hover:text-primary font-medium border-b border-gray-200 pb-3 transition-colors"
            >
              {p.label} lawyers
            </Link>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection tone="soft">
        <SectionIntro title="Cities" />
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          {SEO_CITIES.map((city) => (
            <Link
              key={city.slug}
              href={`/lawyers/corporate/${city.slug}`}
              className="text-ink hover:text-primary font-medium transition-colors"
            >
              Corporate lawyers in {city.label}
            </Link>
          ))}
        </div>
      </MarketingSection>

      <MarketingCtaBand
        title="Not sure who you need?"
        description="AI Intake interviews your case and suggests matched lawyers."
        primaryHref="/ai/intake"
        primaryLabel="Start AI Intake"
      />
    </>
  );
}
