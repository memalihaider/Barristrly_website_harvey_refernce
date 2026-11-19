import type { Metadata } from "next";
import PostCard from "@/components/content/post-card";
import { listPublishedPosts } from "@/lib/content/blog";
import Link from "next/link";
import GradientButton from "@/components/ui/gradient-button";
import {
  MarketingSection,
  PageHero,
  SectionIntro,
} from "@/components/marketing/section";
import { LEGAL_SERVICES } from "@/lib/marketing/seo-slugs";
import { SERVICE_CATALOG } from "@/lib/marketing/service-catalog";

export const metadata: Metadata = {
  title: "Resources | Barristrly",
  description:
    "Articles, practice-area guides, and Barristrly service resources for UAE and GCC clients.",
};

export const revalidate = 300;

export default async function ResourcesPage() {
  const posts = await listPublishedPosts(6);

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Guides and insights for legal services"
        description="Practical reading on UAE and GCC legal services — plus our service catalog for matching, consultations, retainers, and specialist desks."
      >
        <GradientButton href="/services" size="lg">
          Browse services
        </GradientButton>
        <GradientButton href="/blog" size="lg" variant="outline">
          View blog
        </GradientButton>
      </PageHero>

      <MarketingSection id="articles">
        <SectionIntro title="Articles & blogs" />
        {posts.length ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
            <Link
              href="/blog"
              className="mt-8 inline-block text-sm font-semibold text-primary hover:text-primary-hover"
            >
              View all articles →
            </Link>
          </>
        ) : (
          <p className="text-sm text-gray-600">
            Articles will appear here as they are published. Meanwhile, explore
            our{" "}
            <Link href="/services" className="font-semibold text-primary">
              service catalog
            </Link>
            .
          </p>
        )}
      </MarketingSection>

      <MarketingSection tone="soft">
        <SectionIntro
          title="Our services"
          description="Live offerings with transparent AED pricing."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6">
          {SERVICE_CATALOG.map((s) => (
            <Link
              key={s.id}
              href={s.href}
              className="border-t border-gray-200 pt-4 font-medium text-ink hover:text-primary transition-colors"
            >
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-primary mb-1">
                Service {String(s.number).padStart(2, "0")}
              </span>
              {s.shortName}
            </Link>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection>
        <SectionIntro title="Practice areas" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {LEGAL_SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/legal-services/${s.slug}`}
              className="group border-t border-gray-200 pt-5"
            >
              <h3 className="font-serif text-xl text-ink tracking-tight group-hover:text-primary transition-colors">
                {s.label}
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {s.summary}
              </p>
            </Link>
          ))}
        </div>
      </MarketingSection>
    </>
  );
}
