import Link from "next/link";
import GradientButton from "@/components/ui/gradient-button";
import {
  FeatureList,
  MarketingCtaBand,
  MarketingSection,
  PageHero,
  SectionIntro,
} from "@/components/marketing/section";
import ServiceRequestForm from "@/components/marketing/service-request-form";
import type { CatalogService } from "@/lib/marketing/service-catalog";
import { SERVICE_CATALOG } from "@/lib/marketing/service-catalog";

export default function ServiceLanding({ service }: { service: CatalogService }) {
  return (
    <>
      <PageHero
        eyebrow={
          service.isNew
            ? `Service ${service.number} · New`
            : `Service ${service.number}`
        }
        title={service.name}
        description={service.description}
      >
        <GradientButton href={service.ctaHref} size="lg">
          {service.ctaLabel}
        </GradientButton>
        {service.secondaryCtaLabel && service.secondaryCtaHref ? (
          <GradientButton href={service.secondaryCtaHref} size="lg" variant="outline">
            {service.secondaryCtaLabel}
          </GradientButton>
        ) : (
          <GradientButton href="/services" size="lg" variant="outline">
            All services
          </GradientButton>
        )}
      </PageHero>

      <MarketingSection tone="soft" tight>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#e5e3dc] bg-white p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              Pricing model
            </p>
            <p className="mt-2 font-serif text-xl text-ink">{service.pricingModel}</p>
            <p className="mt-2 text-sm text-gray-600">{service.monetization}</p>
          </div>
          <div className="rounded-2xl border border-[#e5e3dc] bg-white p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              Tagline
            </p>
            <p className="mt-2 text-sm text-gray-700 leading-relaxed">
              {service.tagline}
            </p>
          </div>
        </div>
      </MarketingSection>

      {service.tiers.length ? (
        <MarketingSection>
          <SectionIntro
            title="Packages & pricing"
            description="All prices in AED. VAT and official government fees are itemized separately where applicable."
          />
          <ul className="grid md:grid-cols-2 gap-4 list-none p-0 m-0">
            {service.tiers.map((tier) => (
              <li
                key={tier.id}
                className="rounded-2xl border border-[#e5e3dc] bg-[#faf9f6] p-6 flex flex-col"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                  {tier.duration ?? service.eyebrow}
                </p>
                <h3 className="mt-2 font-serif text-2xl text-ink tracking-tight">
                  {tier.name}
                </h3>
                <p className="mt-3 text-2xl font-semibold text-ink">
                  {tier.priceLabel}
                </p>
                {tier.detail ? (
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {tier.detail}
                  </p>
                ) : null}
                {tier.scope ? (
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {tier.scope}
                  </p>
                ) : null}
                {tier.features?.length ? (
                  <ul className="mt-4 space-y-1.5 text-sm text-gray-700 list-disc pl-4">
                    {tier.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </MarketingSection>
      ) : null}

      <MarketingSection tone="soft">
        <SectionIntro title="What you get" description={service.phase1Notes} />
        <FeatureList
          items={service.deliverables.map((d, i) => ({
            title: `Deliverable ${i + 1}`,
            body: d,
          }))}
        />
      </MarketingSection>

      <MarketingSection>
        <ServiceRequestForm service={service} />
      </MarketingSection>

      <MarketingSection tight>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-6">
          Service master catalog
        </p>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 list-none p-0 m-0">
          {SERVICE_CATALOG.map((s) => (
            <li key={s.id}>
              <Link
                href={s.href}
                className={`block rounded-xl border p-4 transition-colors ${
                  s.id === service.id
                    ? "border-primary/40 bg-primary/5"
                    : "border-[#e5e3dc] bg-white hover:border-primary/30"
                }`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {String(s.number).padStart(2, "0")}
                  {s.isNew ? " · New" : ""}
                </p>
                <p className="mt-1 text-sm font-semibold text-ink leading-snug">
                  {s.shortName}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingCtaBand
        title="Need help choosing a service?"
        description="Book a consultation or start with free lawyer matching — Phase 1 requests are handled within 24 hours."
        primaryHref="/services/consultation#request"
        primaryLabel="Book consultation"
        secondaryHref="/services/lawyer-matching#request"
        secondaryLabel="Free matching"
      />
    </>
  );
}
