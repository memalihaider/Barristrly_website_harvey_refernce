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
    "Browse Barristrly legal services — free lawyer matching, consultations, retainers, contracts, wills, PRO help, banking, PR, and more.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Clear legal services for people and businesses"
        description="Every service has a plain description and AED pricing. Choose what you need, send a short request, and we reply within 24 hours."
      >
        <GradientButton href="/services/lawyer-matching#request" size="lg">
          Get matched for free
        </GradientButton>
        <GradientButton href="/services/consultation#request" size="lg" variant="outline">
          Book a consultation
        </GradientButton>
      </PageHero>

      <MarketingSection>
        <SectionIntro
          title="What we offer"
          description="Ten practical services. Government and court fees are always listed separately where they apply."
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
        secondaryHref="/services/consultation#request"
        secondaryLabel="Book a consultation"
      />
    </>
  );
}
