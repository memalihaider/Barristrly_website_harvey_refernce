"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";

interface PricingCardProps {
  plan: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  cta?: string;
  popular?: boolean;
  index?: number;
  onCtaClick?: () => void;
}

export default function PricingCard({
  plan,
  price,
  period = "/month",
  description,
  features,
  cta = "Get Started",
  popular = false,
  index = 0,
  onCtaClick,
}: PricingCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`relative flex flex-col border p-6 sm:p-8 transition-colors ${
        popular
          ? "border-primary bg-ivory shadow-[0_0_0_1px_var(--color-primary)]"
          : "border-black/10 bg-ivory hover:border-black/20"
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-primary px-3.5 py-1 text-[0.6875rem] font-bold tracking-wide text-on-primary uppercase">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text-tertiary">{plan}</h3>
        {description && (
          <p className="mt-1 text-sm text-text-on-light-muted">{description}</p>
        )}
      </div>

      <div className="mb-6 flex items-baseline gap-1">
        <span className="font-serif text-4xl tracking-tight text-text-tertiary md:text-5xl">
          {price}
        </span>
        {period && (
          <span className="text-sm font-medium text-text-muted">{period}</span>
        )}
      </div>

      <div className="mb-6 h-px bg-black/8" />

      <ul className="mb-8 flex flex-1 flex-col gap-3 list-none p-0 m-0">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check
              className={`mt-0.5 h-4 w-4 shrink-0 ${
                popular ? "text-primary" : "text-text-muted"
              }`}
              strokeWidth={2.5}
              aria-hidden
            />
            <span className="text-sm leading-relaxed text-text-on-light-muted">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onCtaClick}
        className={`w-full rounded-full px-6 py-3.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          popular
            ? "bg-primary text-on-primary hover:bg-primary-hover"
            : "bg-text-tertiary text-white hover:bg-black"
        }`}
      >
        {cta}
      </button>
    </motion.div>
  );
}
