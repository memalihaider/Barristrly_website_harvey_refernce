import GradientButton from "@/components/ui/gradient-button";
import {
  FeatureList,
  MarketingCtaBand,
  MarketingSection,
  PageHero,
  ProductMock,
  SectionIntro,
  StatRow,
} from "@/components/marketing/section";
import type { Product } from "@/lib/marketing/products";
import { PRODUCTS } from "@/lib/marketing/products";
import Link from "next/link";

export default function ProductLanding({ product }: { product: Product }) {
  return (
    <>
      <PageHero
        eyebrow={product.eyebrow}
        title={product.name}
        description={product.description}
        aside={
          <ProductMock
            title={product.name}
            lines={[product.tagline, ...product.highlights.map((h) => `${h.value} · ${h.label}`)]}
          />
        }
      >
        <GradientButton href="/request-demo" size="lg">
          Discuss this product
        </GradientButton>
        <GradientButton href="/marketplace" size="lg" variant="outline">
          Legal Marketplace
        </GradientButton>
      </PageHero>

      {product.highlights.length ? (
        <MarketingSection tone="soft" tight>
          <StatRow stats={product.highlights} />
        </MarketingSection>
      ) : null}

      {product.features.length ? (
        <MarketingSection>
          <SectionIntro
            title={product.tagline}
            description={
              product.comingDetail ||
              "Working brief for the next product session — capabilities below are the starting scope."
            }
          />
          <FeatureList items={product.features} />
        </MarketingSection>
      ) : null}

      <MarketingSection tight>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-6">
          All products
        </p>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 list-none p-0 m-0">
          {PRODUCTS.map((p) => (
            <li key={p.id}>
              <Link
                href={p.href}
                className={`block rounded-2xl border p-5 transition-colors ${
                  p.id === product.id
                    ? "border-primary/40 bg-primary/5"
                    : "border-[#e5e3dc] bg-white hover:border-primary/30"
                }`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {p.eyebrow}
                </p>
                <p className="mt-1 font-serif text-xl text-ink tracking-tight">
                  {p.name}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingCtaBand
        title="We’ll go deep on this stack next"
        description="Menu and pages are in place. Next meeting: finalize scope, modules, and rollout for each product."
        primaryHref="/request-demo"
        primaryLabel="Schedule that session"
        secondaryHref="/marketplace"
        secondaryLabel="See marketplace"
      />
    </>
  );
}
