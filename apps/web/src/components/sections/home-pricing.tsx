"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import GradientButton from "@/components/ui/gradient-button";
import {
  INDIVIDUAL_SESSIONS,
  SUBSCRIPTION_PLANS,
} from "@/lib/marketing/pricing";

export default function HomePricing() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" ref={ref} className="section-padding soft-section">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-14">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-3">
              Pricing
            </p>
            <h2 className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] text-ink tracking-tight">
              Escrow-backed consults & corporate caps
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Anonymous session rates fund the match loop in escrow. Corporate
              plans use capped meetings and conflict-check cycles — marketplace
              matching, not unlimited AI workspace seats.
            </p>
          </div>
          <GradientButton href="/pricing" size="md">
            View full pricing
          </GradientButton>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {INDIVIDUAL_SESSIONS.map((session, i) => (
            <motion.div
              key={session.name}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05 }}
              className="border-t-2 border-gray-200 pt-5"
            >
              <p className="text-sm font-medium text-ink">{session.name}</p>
              <p className="mt-2 font-serif text-2xl text-primary tracking-tight">
                {session.price}
              </p>
              <p className="mt-1 text-xs text-gray-500">{session.period}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {SUBSCRIPTION_PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
              className={`rounded-2xl border bg-[#fafaf9] p-7 md:p-8 flex flex-col ${
                "highlight" in plan && plan.highlight
                  ? "border-primary shadow-[0_0_0_1px_var(--color-primary)]"
                  : "border-gray-200"
              }`}
            >
              {"highlight" in plan && plan.highlight ? (
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary mb-3">
                  Most popular
                </span>
              ) : (
                <span className="h-4 mb-3" aria-hidden />
              )}
              <h3 className="font-serif text-2xl text-ink tracking-tight">
                {plan.name}
              </h3>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="font-serif text-3xl text-ink tracking-tight">
                  {plan.price}
                </span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed flex-1">
                {plan.detail}
              </p>
              <ul className="mt-6 space-y-2.5 list-none p-0 m-0">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-ink/80 flex gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <GradientButton
                  href={plan.cta.href}
                  size="sm"
                  variant="outline"
                  className="w-full !text-primary !border-primary justify-center"
                >
                  {plan.cta.label}
                </GradientButton>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
