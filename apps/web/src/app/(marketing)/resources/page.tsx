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
  description:
    "Newsletters, articles, UAE and international law references, and media & podcasts with the founder.",
};

const NEWSLETTERS = [
  {
    title: "Corridor Brief",
    summary: "Monthly roundup of UAE–GCC–India legal marketplace signals.",
  },
  {
    title: "COI & Matching Notes",
    summary: "Practical updates on anonymous directory and conflict workflows.",
  },
];

const ARTICLES = [
  {
    title: "Why merit-first matching needs anonymity",
    summary: "How brand-blind browsing changes counsel selection.",
  },
  {
    title: "Two-gate COI before consult",
    summary: "Clearing adverse parties before narrative and documents enter.",
  },
  {
    title: "Escrow-backed anonymous meetings",
    summary: "Timed sessions with identity unlock only on consent.",
  },
];

const UAE_LAWS = [
  { title: "UAE Mainland courts", summary: "Federal and emirate-level frameworks." },
  { title: "DIFC Courts", summary: "Common-law corridor for commercial disputes." },
  { title: "ADGM Courts", summary: "Abu Dhabi free-zone commercial jurisdiction." },
  { title: "MoHRE & labour", summary: "Employment and workplace dispute tracks." },
];

const INTL_LAWS = [
  { title: "Saudi Arabia", summary: "Commercial and disputes corridor references." },
  { title: "India", summary: "Cross-border commercial and arbitration touchpoints." },
  { title: "United Kingdom", summary: "England & Wales commercial law corridor." },
  { title: "Pakistan", summary: "Banking, recovery, and trade-finance pathways." },
];

const MEDIA = [
  {
    title: "Founder conversation: legal matchmaking redefined",
    summary:
      "Heena Mohammed on anonymity, COI, and building the India–GCC legal corridor.",
  },
  {
    title: "Podcast: Why clients need masked first consults",
    summary: "Privacy, trust, and escrow before identity reveal.",
  },
  {
    title: "Interview: From referrals to marketplace matching",
    summary: "How Barristrly replaces sequential mismatched intros.",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources Hub"
        title="Learn, read, and watch Barristrly"
        description="Newsletters, articles and blogs, UAE and international law references, plus media and podcasts with the founder."
      >
        <GradientButton href="/resources#media-podcasts" size="lg">
          Media &amp; Podcasts
        </GradientButton>
        <GradientButton href="/ai/intake" size="lg" variant="outline">
          Ask BARRI
        </GradientButton>
      </PageHero>

      <MarketingSection id="media-podcasts">
        <SectionIntro
          eyebrow="Featured"
          title="Media & Podcasts with the Founder"
          description="Visible access to conversations with Heena Mohammed — Co-Founder & Chairperson."
        />
        <div className="grid md:grid-cols-3 gap-8">
          {MEDIA.map((item) => (
            <article
              key={item.title}
              className="border-t-2 border-primary pt-6"
            >
              <h3 className="font-serif text-2xl md:text-[1.65rem] text-ink tracking-tight leading-snug">
                {item.title}
              </h3>
              <p className="mt-3 text-base text-gray-600 leading-relaxed">
                {item.summary}
              </p>
              <p className="mt-4 text-sm font-semibold text-primary">
                Coming soon · Watch / Listen
              </p>
            </article>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection id="newsletters" tone="soft">
        <SectionIntro title="Newsletters" />
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
          {NEWSLETTERS.map((item) => (
            <div key={item.title} className="border-t border-gray-200 pt-5">
              <h3 className="font-serif text-xl text-ink tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{item.summary}</p>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection id="articles">
        <SectionIntro title="Articles & Blogs" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {ARTICLES.map((item) => (
            <div key={item.title} className="border-t border-gray-200 pt-5">
              <h3 className="font-serif text-xl text-ink tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{item.summary}</p>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection id="uae-laws" tone="soft">
        <SectionIntro title="UAE Laws" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
          {UAE_LAWS.map((item) => (
            <div key={item.title} className="border-t border-gray-200 pt-5">
              <h3 className="font-medium text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.summary}</p>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection id="international-laws">
        <SectionIntro title="Laws of other countries" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
          {INTL_LAWS.map((item) => (
            <div key={item.title} className="border-t border-gray-200 pt-5">
              <h3 className="font-medium text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.summary}</p>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection tone="soft">
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

      <MarketingSection>
        <SectionIntro title="Legal services" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {LEGAL_SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/legal-services/${s.slug}`}
              className="group border-t border-gray-200 pt-5"
            >
              <h3 className="font-serif text-xl text-ink group-hover:text-primary transition-colors tracking-tight">
                {s.label}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{s.summary}</p>
            </Link>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection tone="soft">
        <SectionIntro title="AI tools" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {AI_TOOLS.map((t) => (
            <Link
              key={t.slug}
              href={`/ai/${t.slug}`}
              className="group border-t border-gray-200 pt-5"
            >
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
