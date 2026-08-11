import type { Metadata } from "next";
import Link from "next/link";
import GradientButton from "@/components/ui/gradient-button";
import {
  MarketingSection,
  PageHero,
  SectionIntro,
} from "@/components/marketing/section";
import { PRODUCTS } from "@/lib/marketing/products";

export const metadata: Metadata = {
  title: "Products | Barristrly",
  description:
    "Legal marketplace plus CRM, PMS, accounting, CLM, online arbitration, documents, and Legal Research AI.",
};

export default function ProductsIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="The Barristrly product stack"
        description="Eight products around one idea: match privately, meet confidentially, then run the matter — across India, Pakistan, the UAE, and the world."
      >
        <GradientButton href="/marketplace" size="lg">
          Start with Marketplace
        </GradientButton>
        <GradientButton href="/request-demo" size="lg" variant="outline">
          Discuss the stack
        </GradientButton>
      </PageHero>

      <MarketingSection>
        <SectionIntro
          title="What ships in the menu now"
          description="Pages are live as working briefs. We will go through each product in detail in the next meeting."
        />
        <ul className="grid md:grid-cols-2 gap-6 list-none p-0 m-0">
          {PRODUCTS.map((p) => (
            <li key={p.id}>
              <Link
                href={p.href}
                className="group block h-full rounded-2xl border border-[#e5e3dc] bg-white p-7 hover:border-primary/35 transition-colors"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                  {p.eyebrow}
                </p>
                <h2 className="mt-2 font-serif text-2xl md:text-[1.75rem] text-ink tracking-tight group-hover:text-primary transition-colors">
                  {p.name}
                </h2>
                <p className="mt-2 text-sm font-medium text-ink/70">{p.tagline}</p>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {p.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </MarketingSection>
    </>
  );
}
