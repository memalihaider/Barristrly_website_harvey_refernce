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
    "Anonymous legal directory by practice and city — match counsel after COI, then schedule confidential meetings.",
};

export default function FindLawyersPage() {
  const practices = allPracticeSlugs();

  return (
    <>
      <PageHero
        eyebrow="Anonymous directory"
        title="Find lawyers by practice and city"
        description="Browse Barristrly’s aggregator hubs by practice and corridor — or ask BARRI to classify your matter and start matching."
      >
        <GradientButton href="/ai/intake" size="lg">
          Ask BARRI
        </GradientButton>
        <GradientButton href="/request-demo" size="lg" variant="outline">
          Schedule Meeting
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
        description="Ask BARRI to classify your matter, then match through the anonymous directory."
        primaryHref="/ai/intake"
        primaryLabel="Ask BARRI"
      />
    </>
  );
}
