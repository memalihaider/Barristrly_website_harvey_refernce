import type { ReactNode } from "react";
import Link from "next/link";
import GradientButton from "@/components/ui/gradient-button";

type SectionProps = {
  children: ReactNode;
  className?: string;
  tone?: "cream" | "soft" | "dark";
  id?: string;
  tight?: boolean;
};

export function MarketingSection({
  children,
  className = "",
  tone = "cream",
  id,
  tight = false,
}: SectionProps) {
  const toneClass =
    tone === "dark"
      ? "dark-section"
      : tone === "soft"
        ? "soft-section"
        : "light-section";

  return (
    <section
      id={id}
      className={`${tight ? "py-16 md:py-20" : "section-padding"} ${toneClass} ${className}`}
    >
      <div className="container-wide">{children}</div>
    </section>
  );
}

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
  aside?: ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  aside,
}: PageHeroProps) {
  return (
    <section className="light-section pt-28 pb-14 md:pt-32 md:pb-20 border-b border-gray-200/80">
      <div className="container-wide">
        <div
          className={`grid gap-12 items-end ${aside ? "lg:grid-cols-[1.1fr_0.9fr]" : ""}`}
        >
          <div className="max-w-2xl">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-5">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="font-serif text-[clamp(2.25rem,4.5vw,3.75rem)] text-ink tracking-tight leading-[1.08]">
              {title}
            </h1>
            <p className="mt-5 text-base md:text-lg text-gray-600 leading-relaxed max-w-xl">
              {description}
            </p>
            {children ? (
              <div className="mt-9 flex flex-wrap gap-3">{children}</div>
            ) : null}
          </div>
          {aside ? <div className="hidden lg:block">{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}

export function ProductMock({
  title,
  lines,
}: {
  title: string;
  lines: string[];
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-ivory shadow-[0_24px_60px_-28px_rgba(15,14,13,0.35)] overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100 bg-[#f5f3ef]">
        <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
        <span className="ml-3 text-xs text-gray-500 font-medium">{title}</span>
      </div>
      <div className="p-5 space-y-3 bg-gradient-to-br from-ivory to-[#f5f3ef]">
        {lines.map((line, i) => (
          <div
            key={line}
            className={`rounded-lg px-3 py-2.5 text-sm ${
              i === 0
                ? "bg-primary/10 text-ink border border-primary/20"
                : "bg-[#f5f3ef] text-gray-600 border border-gray-100"
            }`}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatRow({
  stats,
}: {
  stats: { label: string; value: string }[];
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
      {stats.map((s) => (
        <div key={s.label} className="border-t border-gray-200 pt-5">
          <div className="font-serif text-3xl md:text-4xl text-primary tracking-tight">
            {s.value}
          </div>
          <div className="mt-2 text-sm text-gray-600 leading-snug">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export function CertGrid({
  items,
}: {
  items: { title: string; detail: string }[];
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
      {items.map((item) => (
        <div key={item.title} className="border-t border-gray-200 pt-5">
          <h3 className="font-serif text-xl text-ink tracking-tight">{item.title}</h3>
          <p className="mt-2.5 text-sm text-gray-600 leading-relaxed">{item.detail}</p>
        </div>
      ))}
    </div>
  );
}

export function SplitCta({
  title,
  description,
  primary,
  secondary,
}: {
  title: string;
  description: string;
  primary: ReactNode;
  secondary?: ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-t border-gray-200 pt-10">
      <div className="max-w-xl">
        <h2 className="font-serif text-3xl md:text-[2.5rem] text-ink tracking-tight leading-tight">
          {title}
        </h2>
        <p className="mt-3 text-gray-600 leading-relaxed">{description}</p>
      </div>
      <div className="flex flex-wrap gap-3 shrink-0">
        {primary}
        {secondary}
      </div>
    </div>
  );
}

export function FeatureList({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  return (
    <div className="grid md:grid-cols-2 gap-x-14 gap-y-12">
      {items.map((item) => (
        <div key={item.title} className="border-t border-gray-200 pt-5">
          <h3 className="font-serif text-2xl text-ink tracking-tight">{item.title}</h3>
          <p className="mt-2.5 text-gray-600 leading-relaxed">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

export function MarketingCtaBand({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  dark = false,
}: {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  dark?: boolean;
}) {
  return (
    <MarketingSection tone={dark ? "dark" : "soft"}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div className="max-w-xl">
          <h2
            className={`font-serif text-3xl md:text-4xl tracking-tight ${
              dark ? "text-ivory" : "text-ink"
            }`}
          >
            {title}
          </h2>
          <p
            className={`mt-3 leading-relaxed ${
              dark ? "text-white/70" : "text-gray-600"
            }`}
          >
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <GradientButton href={primaryHref}>{primaryLabel}</GradientButton>
          {secondaryHref && secondaryLabel ? (
            dark ? (
              <Link
                href={secondaryHref}
                className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-light"
              >
                {secondaryLabel} →
              </Link>
            ) : (
              <GradientButton href={secondaryHref} variant="outline">
                {secondaryLabel}
              </GradientButton>
            )
          ) : null}
        </div>
      </div>
    </MarketingSection>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl mb-12 md:mb-14">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-3">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-serif text-3xl md:text-4xl text-ink tracking-tight">{title}</h2>
      {description ? (
        <p className="mt-3 text-gray-600 leading-relaxed">{description}</p>
      ) : null}
    </div>
  );
}
