import type { Metadata } from "next";
import GradientButton from "@/components/ui/gradient-button";
import {
  MarketingCtaBand,
  MarketingSection,
  PageHero,
  SectionIntro,
} from "@/components/marketing/section";
import { SERVICE_CATALOG } from "@/lib/marketing/service-catalog";

export const metadata: Metadata = {
  title: "Legal Services Pricing in AED — Transparent Lawyer Fees UAE",
  description:
    "See clear AED prices for contract drafting, UAE company formation, will drafting, legal retainers and arbitration support. No hidden fees — get a quote from vetted UAE lawyers within 48 hours.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  const featured = SERVICE_CATALOG.filter((s) =>
    ["contract-drafting", "company-formation", "retainers", "wills-estate"].includes(
      s.id,
    ),
  );

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Clear scopes. Fair next steps."
        description="Most services are quoted after a short brief so fees match your matter. Where government fees apply, they are always separate. VAT may apply."
      />

      <MarketingSection>
        <SectionIntro
          title="Most requested"
          description="Contracts, UAE setup, ongoing retainers, and wills — four clear starting points."
        />
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {featured.map((service) => (
            <div
              key={service.id}
              id={service.slug}
              className="scroll-mt-28 rounded-2xl border border-gray-200 bg-[#fafaf9] p-7 md:p-8 flex flex-col"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary mb-3">
                {service.eyebrow}
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-ink tracking-tight">
                {service.shortName}
              </h2>
              <p className="mt-3 text-2xl font-semibold text-ink">
                {service.tiers[0]?.priceLabel ?? service.pricingModel}
              </p>
              <p className="mt-1 text-sm text-gray-500">{service.pricingModel}</p>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed flex-1">
                {service.tagline}
              </p>
              <ul className="mt-5 space-y-2 text-sm text-gray-700">
                {service.tiers.slice(0, 4).map((t) => (
                  <li key={t.id} className="flex gap-2">
                    <span className="text-primary font-semibold">·</span>
                    <span>
                      <strong>{t.name}</strong> — {t.priceLabel}
                      {t.duration ? ` · ${t.duration}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <GradientButton href={service.ctaHref} size="md">
                  {service.ctaLabel}
                </GradientButton>
              </div>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection tone="soft">
        <SectionIntro
          title="All six services at a glance"
          description="A simple overview of how each service is priced."
        />
        <div className="overflow-x-auto rounded-2xl border border-[#e5e3dc] bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-[#e5e3dc] bg-[#faf9f6] text-[11px] uppercase tracking-[0.12em] text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">From</th>
                <th className="px-4 py-3 font-semibold">How it is priced</th>
                <th className="px-4 py-3 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {SERVICE_CATALOG.map((s) => (
                <tr key={s.id} className="border-b border-[#eeebe4] last:border-0">
                  <td className="px-4 py-3.5 font-medium text-ink">
                    {s.shortName}
                    {s.isNew ? (
                      <span className="ml-2 text-[10px] font-bold uppercase text-primary">
                        New
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3.5 text-ink">
                    {s.tiers[0]?.priceLabel ?? "—"}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{s.pricingModel}</td>
                  <td className="px-4 py-3.5 text-right">
                    <a
                      href={s.href}
                      className="font-semibold text-primary hover:underline"
                    >
                      Details
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MarketingSection>

      <MarketingCtaBand
        title="Need help choosing?"
        description="Send us a short note and we will recommend the simplest option."
        primaryHref="/request-demo"
        primaryLabel="Contact us"
        secondaryHref="/services"
        secondaryLabel="Browse services"
      />
    </>
  );
}
