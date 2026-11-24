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
  if (!practice) return { title: "Lawyers" };
  const city = slug[1] ? cityFromSlug(slug[1]) : null;
  const label = practiceLabel(practice);
  const title = city
    ? `${label} Lawyers in ${city.label}`
    : `${label} Lawyers in Dubai & UAE`;
  return {
    title,
    description: city
      ? `Looking for a ${label.toLowerCase()} lawyer in ${city.label}? Get matched with vetted, licensed ${label.toLowerCase()} lawyers through Barristrly — free brief, confidential, reply within 48 hours.`
      : `Find vetted ${label.toLowerCase()} lawyers in Dubai, Abu Dhabi and across the UAE. Submit a free brief and get matched with up to three licensed lawyers within 48 hours.`,
    alternates: { canonical: `/lawyers/${slug.join("/")}` },
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
            ? `Looking for ${label.toLowerCase()} counsel in ${city.label}? Tell us what you need and we will connect you with vetted professionals.`
            : `Looking for ${label.toLowerCase()} counsel? Tell us what you need and Barristrly will connect you with vetted professionals.`
        }
      >
        <GradientButton href="/request-demo" size="lg">
          Contact us
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
          <Link href="/how-it-works" className="text-primary font-semibold hover:text-primary-hover">
            How it works →
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
