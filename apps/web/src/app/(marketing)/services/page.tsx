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
  title: "Services | Barristrly",
  description:
    "Barristrly Service Master Catalog — lawyer matching, consultations, retainers, drafting, wills, PRO, banking, PR, VLO, and IP protection across UAE & GCC.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Service Master Catalog"
        title="Ten services. One UAE & GCC legal operations desk."
        description="Barristrly is a legal services company. Browse fixed-fee and subscription offerings — matching, consultations, retainers, drafting, wills, PRO, banking, PR, fractional GC, and IP protection."
      >
        <GradientButton href="/services/lawyer-matching#request" size="lg">
          Free lawyer matching
        </GradientButton>
        <GradientButton href="/services/consultation#request" size="lg" variant="outline">
          Book consultation
        </GradientButton>
      </PageHero>

      <MarketingSection>
        <SectionIntro
          title="Core offerings"
          description="Exact pricing and scopes from the Barristrly platform strategy. Government fees are always itemized separately."
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
                  View packages →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingCtaBand
        title="For businesses & startups"
        description="Retainers from AED 5,999/mo, VLO at AED 12,500/mo, and free matching when you only need the right counsel."
        primaryHref="/services/retainers"
        primaryLabel="Explore retainers"
        secondaryHref="/services/vlo-fractional-gc"
        secondaryLabel="Fractional GC"
      />
    </>
  );
}
