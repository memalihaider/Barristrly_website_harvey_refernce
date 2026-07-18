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
        eyebrow="Legal services"
        title={service.label}
        description={service.summary}
      >
        <GradientButton href="/ai/intake" size="lg">
          Get matched
        </GradientButton>
        <GradientButton
          href="/request-demo"
          size="lg"
          variant="outline"
        >
          Request a demo
        </GradientButton>
      </PageHero>

      <MarketingSection>
        <p className="text-gray-700 leading-relaxed max-w-2xl text-lg">
          Barristrly routes {service.label.toLowerCase()} matters through AI
          intake and Marketplace matching, then keeps the engagement in
          PracticeOS with documents, billing, and next actions.
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
