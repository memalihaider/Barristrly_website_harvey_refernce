import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GradientButton from "@/components/ui/gradient-button";
import {
  MarketingSection,
  PageHero,
} from "@/components/marketing/section";
import {
  allPracticeSlugs,
  cityFromSlug,
  practiceFromSlug,
  practiceLabel,
  SEO_CITIES,
} from "@/lib/marketing/seo-slugs";

type Props = { params: Promise<{ slug: string[] }> };

export async function generateStaticParams() {
  const practices = allPracticeSlugs();
  const params: { slug: string[] }[] = practices.map((p) => ({
    slug: [p.slug],
  }));
  for (const p of practices.slice(0, 6)) {
    for (const city of SEO_CITIES) {
      params.push({ slug: [p.slug, city.slug] });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const practice = practiceFromSlug(slug[0] ?? "");
  if (!practice) return { title: "Lawyers | Barristrly" };
  const city = slug[1] ? cityFromSlug(slug[1]) : null;
  const label = practiceLabel(practice);
  const title = city
    ? `${label} Lawyers in ${city.label} | Barristrly`
    : `${label} Lawyers | Barristrly`;
  return {
    title,
    description: city
      ? `Find ${label.toLowerCase()} lawyers in ${city.label} on Barristrly Marketplace.`
      : `Find ${label.toLowerCase()} lawyers on Barristrly Marketplace.`,
  };
}

export default async function LawyersSeoPage({ params }: Props) {
  const { slug } = await params;
  if (!slug?.length || slug.length > 2) notFound();

  const practice = practiceFromSlug(slug[0]);
  if (!practice) notFound();

  const city = slug[1] ? cityFromSlug(slug[1]) : null;
  if (slug[1] && !city) notFound();

  const label = practiceLabel(practice);
  const title = city
    ? `${label} lawyers in ${city.label}`
    : `${label} lawyers`;

  return (
    <>
      <PageHero
        eyebrow="Find lawyers"
        title={title}
        description={
          city
            ? `Looking for ${label.toLowerCase()} counsel in ${city.label}? Submit a free matching brief or book a consultation.`
            : `Looking for ${label.toLowerCase()} counsel? Submit a free matching brief or book a fixed-fee consultation with Barristrly.`
        }
      >
        <GradientButton href="/services/lawyer-matching#request" size="lg">
          Free lawyer matching
        </GradientButton>
        <GradientButton
          href="/services"
          size="lg"
          variant="outline"
        >
          All services
        </GradientButton>
      </PageHero>

      <MarketingSection tone="soft">
        <p className="text-gray-700 leading-relaxed max-w-2xl">
          This page helps people find the right practice area. Submit a service
          request and our team matches you with vetted UAE-licensed providers.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/services/lawyer-matching" className="text-primary font-semibold hover:text-primary-hover">
            How matching works →
          </Link>
          {!city
            ? SEO_CITIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/lawyers/${slug[0]}/${c.slug}`}
                  className="text-ink hover:text-primary transition-colors"
                >
                  {c.label}
                </Link>
              ))
            : null}
        </div>
      </MarketingSection>
    </>
  );
}
