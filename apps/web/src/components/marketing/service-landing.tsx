import Link from "next/link";
import { ArrowUpRight, Check, Clock, FileText, MinusCircle } from "lucide-react";
import GradientButton from "@/components/ui/gradient-button";
import FaqItem from "@/components/ui/faq-item";
import PostCard from "@/components/content/post-card";
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
import { getServiceDetails } from "@/lib/marketing/service-details";
import type { BlogPostSummary } from "@/lib/content/blog";

const card = "rounded-2xl border border-[#e5e3dc] bg-white p-6";
const eyebrow = "text-[11px] font-semibold uppercase tracking-[0.14em] text-primary";

export default function ServiceLanding({
  service,
  posts = [],
}: {
  service: CatalogService;
  posts?: BlogPostSummary[];
}) {
  // Icons are functions and cannot cross into the client-side form.
  const { icon: _icon, ...formService } = service; // eslint-disable-line @typescript-eslint/no-unused-vars
  const details = getServiceDetails(service.id);
  const related = details.related
    .map((id) => SERVICE_CATALOG.find((s) => s.id === id))
    .filter((s): s is CatalogService => Boolean(s));

  const onThisPage = [
    { href: "#overview", label: "Overview" },
    { href: "#scope", label: "What's covered" },
    ...(service.tiers.length ? [{ href: "#packages", label: "Options" }] : []),
    { href: "#process", label: "How it works" },
    { href: "#details", label: "Documents & timing" },
    { href: "#faq", label: "FAQs" },
    { href: "#request", label: "Get a quote" },
  ];

  return (
    <>
      <PageHero
        eyebrow={service.eyebrow}
        title={service.name}
        description={service.description}
        aside={
          <div className={`${card} lg:max-w-md lg:justify-self-end w-full`}>
            <p className={eyebrow}>At a glance</p>
            <dl className="mt-4 divide-y divide-[#efede7] text-sm">
              {[
                ["Pricing", service.pricingModel],
                ["Match & quote", "Within 48 hours"],
                ["Coverage", "Dubai, Abu Dhabi, DIFC, ADGM & GCC"],
                ["Handled by", "Vetted, independent professionals"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-gray-500">{k}</dt>
                  <dd className="text-right font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
      >
        <GradientButton href={service.ctaHref} size="lg">
          {service.ctaLabel}
        </GradientButton>
        {service.secondaryCtaLabel && service.secondaryCtaHref ? (
          <GradientButton href={service.secondaryCtaHref} size="lg" variant="outline">
            {service.secondaryCtaLabel}
          </GradientButton>
        ) : (
          <GradientButton href="#faq" size="lg" variant="outline">
            Read the FAQs
          </GradientButton>
        )}
      </PageHero>

      <nav
        aria-label="On this page"
        className="border-b border-[#e5e3dc] bg-white/95 backdrop-blur"
      >
        <div className="container-wide flex gap-5 overflow-x-auto py-3.5 text-sm whitespace-nowrap">
          <Link href="/services" className="text-gray-500 hover:text-primary">
            All services
          </Link>
          <span className="text-gray-300" aria-hidden>
            /
          </span>
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
              {details.overview.heading}
            </h2>
            <div className="mt-6 space-y-5 text-base md:text-lg text-gray-700 leading-relaxed">
              {details.overview.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </div>
          <aside className="space-y-4">
            <div className={`${card} bg-[#faf9f6]`}>
              <p className={eyebrow}>What you get</p>
              <ul className="mt-4 space-y-2.5">
                {service.deliverables.map((d) => (
                  <li key={d} className="flex gap-2.5 text-sm text-gray-700 leading-snug">
                    <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            {service.whoFor.length ? (
              <div className={`${card} bg-[#faf9f6]`}>
                <p className={eyebrow}>Who this is for</p>
                <ul className="mt-4 space-y-2.5">
                  {service.whoFor.map((w) => (
                    <li key={w} className="flex gap-2.5 text-sm text-gray-700 leading-snug">
                      <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </MarketingSection>

      {/* Scope */}
      <MarketingSection tone="soft" id="scope">
        <SectionIntro
          eyebrow="What's covered"
          title={`What our ${service.shortName.toLowerCase()} professionals can help with`}
          description="Tell us which of these you need — or describe your situation and we will point you to the right specialist."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {details.scope.map((group) => (
            <div key={group.title} className={card}>
              <h3 className="font-serif text-xl text-ink tracking-tight">{group.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-gray-700 leading-snug">
                    <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </MarketingSection>

      {/* Options / tiers */}
      {service.tiers.length ? (
        <MarketingSection id="packages">
          <SectionIntro
            eyebrow="Options & pricing"
            title="Choose the option that fits"
            description="All prices are in AED. Final fees are confirmed in writing after we understand your matter — before any work starts."
          />
          <ul
            className={`grid gap-4 list-none p-0 m-0 ${
              service.tiers.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
            }`}
          >
            {service.tiers.map((tier) => (
              <li key={tier.id} className={`${card} bg-[#faf9f6] flex flex-col`}>
                <p className={eyebrow}>{tier.duration ?? service.eyebrow}</p>
                <h3 className="mt-2 font-serif text-2xl text-ink tracking-tight">{tier.name}</h3>
                <p className="mt-3 text-2xl font-semibold text-ink">{tier.priceLabel}</p>
                {tier.detail ? (
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{tier.detail}</p>
                ) : null}
                {tier.scope ? (
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{tier.scope}</p>
                ) : null}
                {tier.features?.length ? (
                  <ul className="mt-4 space-y-1.5 text-sm text-gray-700 list-disc pl-4">
                    {tier.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                ) : null}
                <a
                  href="#request"
                  className="mt-auto pt-5 text-sm font-semibold text-primary hover:underline"
                >
                  Get a quote →
                </a>
              </li>
            ))}
          </ul>
        </MarketingSection>
      ) : null}

      {/* Benefits */}
      {service.benefits.length ? (
        <MarketingSection tone="soft">
          <SectionIntro
            eyebrow="Why Barristrly"
            title="Why clients use this service"
            description="Practical advantages — without the rush or filler."
          />
          <FeatureList items={service.benefits.map((b) => ({ title: b.title, body: b.body }))} />
        </MarketingSection>
      ) : null}

      {/* Process */}
      <MarketingSection id="process">
        <SectionIntro
          eyebrow="How it works"
          title="From request to result in four steps"
        />
        <ol className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 list-none p-0 m-0">
          {details.process.map((step, i) => (
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

      {/* Documents, timing, exclusions */}
      <MarketingSection tone="soft" id="details">
        <SectionIntro
          eyebrow="Before you start"
          title="Documents, timing and what's not included"
          description="Having these ready helps your professional quote accurately and start faster."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          <div className={card}>
            <h3 className="flex items-center gap-2 font-serif text-xl text-ink">
              <FileText className="h-5 w-5 text-primary" aria-hidden /> What to prepare
            </h3>
            <ul className="mt-4 space-y-2.5">
              {details.documents.map((d) => (
                <li key={d} className="flex gap-2.5 text-sm text-gray-700 leading-snug">
                  <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className={card}>
            <h3 className="flex items-center gap-2 font-serif text-xl text-ink">
              <Clock className="h-5 w-5 text-primary" aria-hidden /> Typical timing
            </h3>
            <dl className="mt-4 divide-y divide-[#efede7] text-sm">
              {details.timeline.map((t) => (
                <div key={t.label} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-gray-600">{t.label}</dt>
                  <dd className="text-right font-semibold text-ink">{t.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-gray-500">
              Indicative only. Your exact timeline is confirmed in your quote.
            </p>
          </div>
          <div className={card}>
            <h3 className="flex items-center gap-2 font-serif text-xl text-ink">
              <MinusCircle className="h-5 w-5 text-primary" aria-hidden /> Not included
            </h3>
            <ul className="mt-4 space-y-2.5">
              {details.notIncluded.map((d) => (
                <li key={d} className="flex gap-2.5 text-sm text-gray-700 leading-snug">
                  <span className="mt-2 h-1 w-2 shrink-0 rounded bg-gray-400" aria-hidden />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </MarketingSection>

      {/* FAQ */}
      <MarketingSection id="faq">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-16">
          <div>
            <p className={eyebrow}>FAQs</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl text-ink tracking-tight leading-tight">
              {service.shortName} — common questions
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Can&apos;t find your answer?{" "}
              <a href="#request" className="font-semibold text-primary hover:underline">
                Send us your question
              </a>{" "}
              and we&apos;ll reply within 48 hours.
            </p>
          </div>
          <div className="border-t border-black/10">
            {details.faqs.map((f, i) => (
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

      {/* Request form */}
      <MarketingSection tone="soft">
        <ServiceRequestForm service={formService} />
      </MarketingSection>

      {/* Related articles */}
      {posts.length ? (
        <MarketingSection>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className={eyebrow}>Guides</p>
              <h2 className="mt-3 font-serif text-3xl text-ink tracking-tight">
                Helpful reading on {service.shortName.toLowerCase()}
              </h2>
            </div>
            <Link href="/blog" className="text-sm font-semibold text-primary hover:underline">
              All articles →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </MarketingSection>
      ) : null}

      {/* Related services */}
      <MarketingSection tight tone={posts.length ? "soft" : "cream"}>
        <p className={`${eyebrow} mb-6`}>Related services</p>
        <ul className="grid gap-4 md:grid-cols-3 list-none p-0 m-0">
          {related.map((s) => (
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
