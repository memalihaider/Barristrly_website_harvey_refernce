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
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Pricing
            </div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] text-ink tracking-tight leading-[1.1]">
              Clear session prices. Safe payments.
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed text-base">
              Pay for timed consults — your fee is held in escrow until the
              meeting is done. Companies get monthly plans with a set number of
              meetings and conflict checks.
            </p>
          </div>
          <GradientButton href="/pricing" size="md" variant="primary" className="font-semibold shadow-md shadow-primary/10 shrink-0">
            View full pricing
          </GradientButton>
        </div>

        {/* Individual Sessions (Highly Highlighted Meeting Time & Price) */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {INDIVIDUAL_SESSIONS.map((session, i) => (
            <motion.div
              key={session.name}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-[#e5e3dc] bg-[#faf9f6]/95 p-6 flex flex-col justify-between hover:shadow-[0_20px_50px_rgba(232,93,4,0.055)] hover:border-primary/25 transition-all duration-300 group select-none"
            >
              <div>
                {/* Highlighted Meeting Time indicator */}
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-ink/40">
                    Anonymous Session
                  </span>
                </div>
                
                {/* Large Title/Duration */}
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-ink tracking-tight">
                  {session.name.replace(" Anonymous Call", "")}
                </h3>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  {session.detail}
                </p>
              </div>

              {/* Highlighted Price Details */}
              <div className="mt-8 pt-5 border-t border-gray-200/50 flex items-baseline justify-between">
                <div>
                  <span className="text-2.5xl sm:text-3.5xl font-serif font-extrabold text-primary tracking-tight">
                    {session.price}
                  </span>
                  <span className="text-[9px] uppercase font-extrabold tracking-widest text-ink/40 block mt-0.5">
                    {session.period}
                  </span>
                </div>
                <div className="h-7 w-7 rounded-full bg-white border border-[#e5e3dc] flex items-center justify-center text-ink/60 group-hover:text-primary group-hover:border-primary/40 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subscription Plans (Enhanced UI Cards) */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {SUBSCRIPTION_PLANS.map((plan, i) => {
            const isFeatured = "highlight" in plan && plan.highlight;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
                className={`rounded-3xl border p-7 md:p-8 flex flex-col transition-all duration-300 hover:-translate-y-1.5 select-none ${
                  isFeatured
                    ? "border-primary bg-white shadow-[0_24px_50px_rgba(232,93,4,0.065)] scale-[1.02] z-10"
                    : "border-[#e5e3dc] bg-[#faf9f6]/95 hover:border-gray-300 hover:shadow-lg"
                }`}
              >
                {isFeatured ? (
                  <span className="inline-flex self-start items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full mb-4">
                    <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                    Most popular
                  </span>
                ) : (
                  <span className="h-6 mb-4 block" aria-hidden />
                )}
                
                <h3 className="font-serif text-2xl text-ink font-bold tracking-tight">
                  {plan.name}
                </h3>
                
                {/* Highlighted Subscription Price */}
                <div className="mt-4 flex items-baseline gap-1.5 pb-4 border-b border-gray-200/50">
                  <span className="font-serif text-3.5xl text-ink font-bold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">{plan.period}</span>
                </div>
                
                <p className="mt-4 text-xs sm:text-sm text-gray-600 leading-relaxed flex-1">
                  {plan.detail}
                </p>
                
                {/* Checkmarked Feature List */}
                <ul className="mt-6 space-y-3.5 list-none p-0 m-0 border-t border-gray-200/50 pt-5">
                  {plan.features.map((f) => (
                    <li key={f} className="text-xs sm:text-sm text-ink/80 flex items-start gap-3">
                      <svg className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <GradientButton
                    href={plan.cta.href}
                    size="sm"
                    variant={isFeatured ? "primary" : "outline"}
                    className={`w-full justify-center font-bold ${
                      !isFeatured ? "!text-primary !border-primary hover:bg-primary/5" : "shadow-md shadow-primary/10"
                    }`}
                  >
                    {plan.cta.label}
                  </GradientButton>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
