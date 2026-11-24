"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import GradientButton from "@/components/ui/gradient-button";
import { Check } from "lucide-react";
import { SERVICE_CATALOG } from "@/lib/marketing/service-catalog";

const HOME_IDS = ["contract-drafting", "company-formation", "retainers"] as const;

export default function HomePricing() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const options = HOME_IDS.map(
    (id) => SERVICE_CATALOG.find((s) => s.id === id)!,
  );

  return (
    <section id="pricing" ref={ref} className="section-padding soft-section">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12 md:mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-4">
            Most requested legal services
          </p>
          <h2 className="font-serif text-[clamp(1.85rem,3.5vw,3rem)] text-ink tracking-tight leading-[1.08]">
            Contract drafting, UAE company setup and legal retainers — with clear AED pricing
          </h2>
          <p className="mt-5 text-base md:text-lg text-gray-600 leading-relaxed">
            Pick what you need today. Every service has a fixed scope, an upfront
            price or quote, and a vetted UAE professional behind it — no jargon,
            no surprises.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {options.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.08 * i }}
              className="flex flex-col rounded-2xl border border-[#e5e3dc] bg-white p-6 md:p-7"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                Option {i + 1}
              </p>
              <h3 className="mt-3 font-serif text-2xl text-ink tracking-tight">
                {service.shortName}
              </h3>
              <p className="mt-3 text-2xl font-semibold text-ink">
                {service.tiers[0]?.priceLabel}
              </p>
              <p className="mt-1 text-xs text-gray-500">{service.pricingModel}</p>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed flex-1">
                {service.tagline}
              </p>
              <ul className="mt-5 space-y-2">
                {service.deliverables.slice(0, 3).map((d) => (
                  <li
                    key={d}
                    className="flex gap-2 text-sm text-gray-700 leading-snug"
                  >
                    <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <GradientButton
                  href={service.ctaHref}
                  variant={i === 1 ? "primary" : "outline"}
                  size="md"
                  className="w-full justify-center"
                >
                  {service.ctaLabel}
                </GradientButton>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          <Link href="/services" className="font-semibold text-primary hover:underline">
            See all six legal services
          </Link>{" "}
          — including arbitration support, Will drafting, and agreement templates.
        </p>
      </div>
    </section>
  );
}
