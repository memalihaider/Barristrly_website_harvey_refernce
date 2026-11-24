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
  // Icons are functions and cannot cross into the client-side form.
  const { icon: _icon, ...formService } = service; // eslint-disable-line @typescript-eslint/no-unused-vars
  return (
    <>
      <PageHero
        eyebrow={
          service.isNew
            ? `Service ${service.number} · New`
            : `Service ${service.number} of 6`
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
              How it is priced
            </p>
            <p className="mt-2 font-serif text-xl text-ink">{service.pricingModel}</p>
            <p className="mt-2 text-sm text-gray-600">{service.eyebrow}</p>
          </div>
          <div className="rounded-2xl border border-[#e5e3dc] bg-white p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              In short
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
            title="What you can request"
            description="Choose the option that fits. Final fees are confirmed after we understand your matter."
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

      {service.benefits.length ? (
        <MarketingSection tone="soft">
          <SectionIntro
            title="Why clients use this service"
            description="Practical advantages — without the rush or filler."
          />
          <FeatureList
            items={service.benefits.map((b) => ({
              title: b.title,
              body: b.body,
            }))}
          />
        </MarketingSection>
      ) : null}

      <MarketingSection>
        <SectionIntro
          title="What you get"
          description="Clear outcomes. Government and court fees stay separate when they apply."
        />
        <FeatureList
          items={service.deliverables.map((d, i) => ({
            title: `Included ${i + 1}`,
            body: d,
          }))}
        />
      </MarketingSection>

      {service.whoFor.length ? (
        <MarketingSection tone="soft">
          <SectionIntro
            title="Who this is for"
            description="A good fit if any of these sound like you."
          />
          <ul className="grid sm:grid-cols-3 gap-4 list-none p-0 m-0">
            {service.whoFor.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-[#e5e3dc] bg-white p-5 text-sm text-gray-700 leading-relaxed"
              >
                {item}
              </li>
            ))}
          </ul>
        </MarketingSection>
      ) : null}

      <MarketingSection>
        <ServiceRequestForm service={formService} />
      </MarketingSection>

      <MarketingSection tight>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-6">
          All Barristrly services
        </p>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 list-none p-0 m-0">
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
        title="Not sure which service fits?"
        description="Tell us your situation and we will point you to the simplest next step. We reply within 48 hours."
        primaryHref="/request-demo"
        primaryLabel="Contact us"
        secondaryHref="/services"
        secondaryLabel="Browse all services"
      />
    </>
  );
}
