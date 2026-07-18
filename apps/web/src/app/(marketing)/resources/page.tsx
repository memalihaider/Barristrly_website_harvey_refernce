import type { Metadata } from "next";
import Link from "next/link";
import GradientButton from "@/components/ui/gradient-button";
import {
  MarketingSection,
  PageHero,
  SectionIntro,
} from "@/components/marketing/section";
import { AI_TOOLS, LEGAL_SERVICES } from "@/lib/marketing/seo-slugs";

export const metadata: Metadata = {
  title: "Resources | Barristrly",
  description: "Guides, product updates, and links into Barristrly products.",
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Learn the Barristrly system"
        description="Product overviews, service guides, and AI tool pages — including live AI Intake."
      >
        <GradientButton href="/ai/intake" size="lg">
          Start AI Intake
        </GradientButton>
      </PageHero>

      <MarketingSection>
        <SectionIntro title="Products" />
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
          {[
            { href: "/marketplace", label: "Marketplace" },
            { href: "/ai", label: "AI" },
            { href: "/ai/intake", label: "AI Intake" },
            { href: "/practice", label: "PracticeOS" },
            { href: "/enterprise", label: "Enterprise" },
            { href: "/security", label: "Security" },
            { href: "/pricing", label: "Pricing" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-t border-gray-200 pt-3 font-medium text-ink hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection tone="soft">
        <SectionIntro title="Legal services" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {LEGAL_SERVICES.map((s) => (
            <Link key={s.slug} href={`/legal-services/${s.slug}`} className="group border-t border-gray-200 pt-5">
              <h3 className="font-serif text-xl text-ink group-hover:text-primary transition-colors tracking-tight">
                {s.label}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{s.summary}</p>
            </Link>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection>
        <SectionIntro title="AI tools" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {AI_TOOLS.map((t) => (
            <Link key={t.slug} href={`/ai/${t.slug}`} className="group border-t border-gray-200 pt-5">
              <h3 className="font-serif text-xl text-ink group-hover:text-primary transition-colors tracking-tight">
                {t.label}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{t.summary}</p>
            </Link>
          ))}
        </div>
      </MarketingSection>
    </>
  );
}
