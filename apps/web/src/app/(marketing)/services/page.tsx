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
  title: "Legal Services | Barristrly",
  description:
    "Seven legal services: free lawyer matching, fixed-fee consultations, retainers, contract drafting, wills, UAE company formation & PRO, and e-books with templates.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Seven clear services. One trusted desk."
        description="Match with vetted legal professionals in the UAE — free matching, remote consultations, retainers, drafting, wills, company setup, and self-serve templates."
      >
        <GradientButton href="/services/lawyer-matching#request" size="lg">
          Get matched — free
        </GradientButton>
        <GradientButton href="/services/consultation#request" size="lg" variant="outline">
          Book a consultation
        </GradientButton>
      </PageHero>

      <MarketingSection>
        <SectionIntro
          title="What we offer"
          description="Seven practical services. We are a legal technology aggregator — not a law firm. Independent professionals deliver the work."
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
                  {s.number <= 2 ? (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      Featured
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
        description="Start with free matching, or book a fixed-fee consultation from home."
        primaryHref="/services/lawyer-matching#request"
        primaryLabel="Get matched — free"
        secondaryHref="/services/consultation#request"
        secondaryLabel="Book a consultation"
      />
    </>
  );
}
