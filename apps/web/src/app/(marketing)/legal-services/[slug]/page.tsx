import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GradientButton from "@/components/ui/gradient-button";
import {
  MarketingSection,
  PageHero,
} from "@/components/marketing/section";
import {
  LEGAL_SERVICES,
  serviceFromSlug,
} from "@/lib/marketing/seo-slugs";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LEGAL_SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceFromSlug(slug);
  if (!service) return { title: "Legal Services | Barristrly" };
  return {
    title: `${service.label} | Barristrly`,
    description: service.summary,
  };
}

export default async function LegalServicePage({ params }: Props) {
  const { slug } = await params;
  const service = serviceFromSlug(slug);
  if (!service) notFound();

  return (
    <>
      <PageHero
        eyebrow={`Legal services · ${service.forum}`}
        title={service.label}
        description={service.summary}
      >
        <GradientButton href="/ai/intake" size="lg">
          Submit Your Legal Brief — Free Match
        </GradientButton>
        <GradientButton href="/pricing" size="lg" variant="outline">
          Book a Consultation
        </GradientButton>
      </PageHero>

      <MarketingSection>
        <p className="text-gray-700 leading-relaxed max-w-2xl text-lg">
          Submit your brief and we curate and transmit it to up to three (3)
          vetted UAE-licensed Service Providers matching your jurisdiction and{" "}
          {service.label.toLowerCase()} practice area — with proposals back
          within a 24-hour SLA.
        </p>
        <div className="mt-10 flex flex-wrap gap-6">
          {LEGAL_SERVICES.filter((s) => s.slug !== slug).map((s) => (
            <Link
              key={s.slug}
              href={`/legal-services/${s.slug}`}
              className="text-ink hover:text-primary font-medium transition-colors"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </MarketingSection>
    </>
  );
}
