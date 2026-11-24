import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, FileText, Info, Wallet } from "lucide-react";
import GradientButton from "@/components/ui/gradient-button";
import FaqItem from "@/components/ui/faq-item";
import JsonLd from "@/components/seo/json-ld";
import {
  MarketingCtaBand,
  MarketingSection,
  PageHero,
  SectionIntro,
} from "@/components/marketing/section";
import { LEGAL_SERVICES, serviceFromSlug } from "@/lib/marketing/seo-slugs";
import { getPracticeDetails } from "@/lib/marketing/practice-details";
import { SERVICE_CATALOG, type CatalogService } from "@/lib/marketing/service-catalog";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LEGAL_SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceFromSlug(slug);
  if (!service) return { title: "Legal Services" };
  const d = getPracticeDetails(slug);
  const title = d?.metaTitle ?? `${service.label} Lawyers in Dubai & UAE`;
  const description = d?.metaDescription ?? service.summary;
  return {
    title,
    description,
    alternates: { canonical: `/legal-services/${service.slug}` },
    openGraph: { title, description, url: `/legal-services/${service.slug}` },
  };
}

const card = "rounded-2xl border border-[#e5e3dc] bg-white p-6";
const eyebrow = "text-[11px] font-semibold uppercase tracking-[0.14em] text-primary";

const STEPS = [
  {
    title: "Tell us what happened",
    body: "Fill in a short, free brief. It takes about three minutes and stays confidential.",
  },
  {
    title: "We find the right lawyers",
    body: "We share your brief with up to three vetted, UAE-licensed professionals who handle your type of matter.",
  },
  {
    title: "Compare clear proposals",
    body: "Within 48 hours you receive each lawyer's approach and fee in AED — in plain language.",
  },
  {
    title: "You choose — no obligation",
    body: "Pick the lawyer you are most comfortable with, or walk away. You only pay if you hire someone.",
  },
];

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm md:text-[15px] text-gray-700 leading-snug">
          <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function LegalServicePage({ params }: Props) {
  const { slug } = await params;
  const service = serviceFromSlug(slug);
  const d = getPracticeDetails(slug);
  if (!service || !d) notFound();

  const path = `/legal-services/${service.slug}`;
  const relatedServices = d.relatedServices
    .map((id) => SERVICE_CATALOG.find((s) => s.id === id))
    .filter((s): s is CatalogService => Boolean(s));
  const otherAreas = LEGAL_SERVICES.filter((s) => s.slug !== slug);

  const onThisPage = [
    { href: "#overview", label: "Overview" },
    { href: "#help", label: "How we help" },
    { href: "#know", label: "Key things to know" },
    { href: "#process", label: "How it works" },
    { href: "#costs", label: "Costs" },
    { href: "#faq", label: "FAQs" },
  ];

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({ name: service.label, description: d.metaDescription, path }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Legal services", path: "/services" },
            { name: service.label, path },
          ]),
          faqJsonLd(d.faqs),
        ]}
      />

      <PageHero
        eyebrow={service.forum}
        title={`${service.label} in Dubai & the UAE`}
        description={d.heroLine}
        aside={
          <div className={`${card} w-full lg:max-w-md lg:justify-self-end`}>
            <p className={eyebrow}>You may need this if…</p>
            <div className="mt-4">
              <CheckList items={d.situations.slice(0, 4)} />
            </div>
          </div>
        }
      >
        <GradientButton href="/ai/intake" size="lg">
          Get a free lawyer match
        </GradientButton>
        <GradientButton href="/pricing" size="lg" variant="outline">
          Book a consultation
        </GradientButton>
      </PageHero>

      <nav aria-label="On this page" className="border-b border-[#e5e3dc] bg-white/95">
        <div className="container-wide flex gap-5 overflow-x-auto py-3.5 text-sm whitespace-nowrap">
          {onThisPage.map((l) => (
            <a key={l.href} href={l.href} className="font-medium text-ink hover:text-primary">
              {l.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Overview */}
      <MarketingSection id="overview">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className={eyebrow}>Overview</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl text-ink tracking-tight leading-tight">
              {d.intro.heading}
            </h2>
            <div className="mt-6 space-y-5 text-base md:text-lg text-gray-700 leading-relaxed">
              {d.intro.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </div>
          <aside className={`${card} bg-[#faf9f6] self-start`}>
            <p className={eyebrow}>Common situations</p>
            <div className="mt-4">
              <CheckList items={d.situations} />
            </div>
            <a
              href="#request-cta"
              className="mt-6 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Sound familiar? Get matched →
            </a>
          </aside>
        </div>
      </MarketingSection>

      {/* How we help */}
      <MarketingSection tone="soft" id="help">
        <SectionIntro
          eyebrow="How we help"
          title="What a matched lawyer can do for you"
          description="Every professional we introduce is vetted and licensed for this kind of work in the UAE."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {d.help.map((group) => (
            <div key={group.title} className={card}>
              <h3 className="font-serif text-xl text-ink tracking-tight">{group.title}</h3>
              <div className="mt-4">
                <CheckList items={group.items} />
              </div>
            </div>
          ))}
        </div>
      </MarketingSection>

      {/* Key facts */}
      <MarketingSection id="know">
        <SectionIntro
          eyebrow="Good to know"
          title="Key things to know — in plain English"
          description="General information to help you understand your situation. Your lawyer will advise on your specific case."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {d.keyFacts.map((f) => (
            <div key={f.title} className={`${card} bg-[#faf9f6]`}>
              <h3 className="flex items-start gap-2.5 font-serif text-xl text-ink tracking-tight">
                <Info className="h-5 w-5 shrink-0 text-primary mt-1" aria-hidden />
                {f.title}
              </h3>
              <p className="mt-3 text-gray-700 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </MarketingSection>

      {/* Process */}
      <MarketingSection tone="soft" id="process">
        <SectionIntro eyebrow="How it works" title="Get the right lawyer in four simple steps" />
        <ol className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 list-none p-0 m-0">
          {STEPS.map((step, i) => (
            <li key={step.title} className="border-t border-black/15 pt-6">
              <p className="font-serif text-4xl text-primary tracking-tight">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-serif text-xl text-ink tracking-tight">{step.title}</h3>
              <p className="mt-2.5 text-sm md:text-base text-gray-600 leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </MarketingSection>

      {/* Prepare + costs */}
      <MarketingSection id="costs">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className={card}>
            <h2 className="flex items-center gap-2 font-serif text-2xl text-ink">
              <FileText className="h-5 w-5 text-primary" aria-hidden /> What to prepare
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              You don&apos;t need everything to start — share what you have.
            </p>
            <div className="mt-5">
              <CheckList items={d.prepare} />
            </div>
          </div>
          <div className={card}>
            <h2 className="flex items-center gap-2 font-serif text-2xl text-ink">
              <Wallet className="h-5 w-5 text-primary" aria-hidden /> How much does it cost?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Every case is different, so lawyers quote after reading your brief.
            </p>
            <div className="mt-5">
              <CheckList items={d.costs} />
            </div>
          </div>
        </div>
      </MarketingSection>

      {/* FAQ */}
      <MarketingSection tone="soft" id="faq">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-16">
          <div>
            <p className={eyebrow}>FAQs</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl text-ink tracking-tight leading-tight">
              Questions people often ask
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Have a different question?{" "}
              <Link href="/request-demo" className="font-semibold text-primary hover:underline">
                Ask us
              </Link>{" "}
              — we reply within 48 hours.
            </p>
          </div>
          <div className="border-t border-black/10">
            {d.faqs.map((f, i) => (
              <FaqItem
                key={f.question}
                question={f.question}
                answer={f.answer}
                index={i}
                defaultOpen={i === 0}
              />
            ))}
          </div>
        </div>
      </MarketingSection>

      {/* Request CTA */}
      <MarketingSection id="request-cta" tight>
        <div className="flex flex-col gap-6 rounded-3xl bg-ink p-8 text-white md:flex-row md:items-center md:justify-between md:p-12">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl md:text-4xl leading-tight">
              Talk to the right {service.label.split(/[,&]/)[0].trim().toLowerCase()} lawyer
            </h2>
            <p className="mt-3 text-white/75 leading-relaxed">
              Free to submit · Confidential · Up to three proposals within 48 hours · No obligation
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <GradientButton href="/ai/intake" size="lg">
              Get a free lawyer match
            </GradientButton>
            <GradientButton href="/request-demo" size="lg" variant="white">
              Contact us
            </GradientButton>
          </div>
        </div>
      </MarketingSection>

      {/* Related */}
      <MarketingSection tone="soft" tight>
        <p className={`${eyebrow} mb-6`}>Related services</p>
        <ul className="grid gap-4 md:grid-cols-3 list-none p-0 m-0">
          {relatedServices.map((s) => (
            <li key={s.id}>
              <Link
                href={s.href}
                className="group flex h-full flex-col rounded-2xl border border-[#e5e3dc] bg-white p-5 transition-colors hover:border-primary/40"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-serif text-xl text-ink group-hover:text-primary">
                    {s.shortName}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-primary" aria-hidden />
                </span>
                <span className="mt-2 text-sm text-gray-600 leading-relaxed">{s.tagline}</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className={`${eyebrow} mt-12 mb-4`}>Other practice areas</p>
        <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
          {otherAreas.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/legal-services/${s.slug}`}
                className="inline-block rounded-full border border-[#e5e3dc] bg-white px-4 py-2 text-sm text-ink hover:border-primary/40 hover:text-primary"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingCtaBand
        title="Not sure which kind of lawyer you need?"
        description="Describe your situation in your own words. We will work out the right practice area and match you with the right professionals."
        primaryHref="/ai/intake"
        primaryLabel="Start a free brief"
        secondaryHref="/how-it-works"
        secondaryLabel="How it works"
      />
    </>
  );
}
