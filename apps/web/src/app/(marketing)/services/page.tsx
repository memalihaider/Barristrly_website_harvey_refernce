import type { Metadata } from "next";
import Link from "next/link";
import GradientButton from "@/components/ui/gradient-button";
import {
  MarketingCtaBand,
  MarketingSection,
  PageHero,
  SectionIntro,
} from "@/components/marketing/section";
import { SERVICE_CATALOG } from "@/lib/marketing/service-catalog";

export const metadata: Metadata = {
  title: "Legal Services in Dubai & UAE — Contracts, Company Setup, Wills",
  description:
    "Six fixed-scope legal services in Dubai and across the UAE: contract drafting, company formation & PRO, will drafting, legal retainers, arbitration support, and agreement templates. Vetted lawyers, AED pricing, reply in 48 hours.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Six clear services. One trusted desk."
        description="Barristrly connects you with vetted professionals for arbitration support, documents, UAE company setup, wills, contracts, and ongoing retainers — with plain language and clear next steps."
      >
        <GradientButton href="/request-demo" size="lg">
          Contact us
        </GradientButton>
        <GradientButton href="/how-it-works" size="lg" variant="outline">
          How it works
        </GradientButton>
      </PageHero>

      <MarketingSection>
        <SectionIntro
          title="What we offer"
          description="Six practical services. We are a legal technology aggregator — not a law firm. Independent professionals deliver the work."
        />
        <ul className="grid md:grid-cols-2 gap-5 list-none p-0 m-0">
          {SERVICE_CATALOG.map((s) => (
            <li key={s.id}>
              <Link
                href={s.href}
                className="group flex h-full flex-col rounded-2xl border border-[#e5e3dc] bg-[#faf9f6] p-6 transition-colors hover:border-primary/35 hover:bg-white"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                    Service {String(s.number).padStart(2, "0")}
                  </span>
                  {s.isNew ? (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      New
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-3 font-serif text-2xl text-ink tracking-tight group-hover:text-primary transition-colors">
                  {s.shortName}
                </h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed flex-1">
                  {s.tagline}
                </p>
                <p className="mt-4 text-sm font-semibold text-ink">
                  {s.pricingModel}
                </p>
                <span className="mt-3 text-sm font-semibold text-primary">
                  View details →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingCtaBand
        title="Not sure which service fits?"
        description="Tell us your situation and we will point you to the simplest next step."
        primaryHref="/request-demo"
        primaryLabel="Contact us"
        secondaryHref="/services/retainers#request"
        secondaryLabel="Ask about a retainer"
      />
    </>
  );
}
