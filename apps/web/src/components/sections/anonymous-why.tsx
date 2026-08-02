"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EyeOff, Scale, Shield, UserCheck } from "lucide-react";
import Link from "next/link";

const MOTIVES = [
  {
    icon: Scale,
    step: "01",
    title: "Remove brand bias",
    body: "Firm names, logos, and personal brands stay hidden so you choose on practice fit, forum experience, and fee tier — not reputation theater.",
  },
  {
    icon: Shield,
    step: "02",
    title: "Protect sensitive matters",
    body: "Your identity and contact details stay masked through intake and first consult. Unmasking happens only when you accept counsel.",
  },
  {
    icon: UserCheck,
    step: "03",
    title: "Clear conflicts first",
    body: "Adverse parties are screened before narrative and documents enter the pool — so you never brief a conflicted firm by accident.",
  },
];

const FLOW = [
  { label: "Browse", detail: "Anonymous profiles" },
  { label: "Match", detail: "Merit + forum fit" },
  { label: "COI", detail: "Conflict cleared" },
  { label: "Reveal", detail: "Identity unlocked" },
];

export default function AnonymousWhy() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="why-anonymous"
      ref={ref}
      className="relative overflow-hidden light-section py-24 md:py-32 lg:py-36"
    >
      {/* Light atmospheric plane */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, #f7f5f1 0%, #faf9f6 42%, #ffffff 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% -10%, rgba(232,93,4,0.12), transparent 55%), radial-gradient(ellipse 40% 35% at 100% 60%, rgba(232,93,4,0.06), transparent 50%), radial-gradient(ellipse 35% 30% at 0% 80%, rgba(232,93,4,0.05), transparent 45%)",
        }}
      />
      {/* Soft grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,14,13,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15,14,13,0.035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 75%)",
        }}
      />

      <div className="container-wide relative z-10">
        {/* Flagship intro — title leads */}
        <div className="mx-auto max-w-5xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45 }}
            className="mb-5 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gray-500"
          >
            <EyeOff className="h-3.5 w-3.5 text-primary" aria-hidden />
            Most important feature
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="font-serif text-[clamp(2.75rem,6.5vw,5rem)] text-primary tracking-tight leading-[1.02]"
          >
            Why Anonymous Directory
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 font-serif text-[clamp(1.35rem,2.4vw,1.85rem)] text-ink tracking-tight"
          >
            Merit first. Identity later.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-gray-600 leading-relaxed"
          >
            Anonymity is the core of Barristrly. Firm names, personal brands, and
            contact details stay hidden until mutual invitation unlocks the
            matter — so every browse starts fair, private, and conflict-safe.
          </motion.p>
        </div>

        {/* Innovative flow strip */}
        <motion.ol
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-14 md:mt-16 mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-0 list-none p-0 m-0
            md:rounded-full md:border md:border-[#e5e3dc] md:bg-white/75 md:backdrop-blur-sm md:px-2 md:py-2
            md:shadow-[0_20px_50px_-28px_rgba(15,14,13,0.18)]"
          aria-label="Anonymous directory flow"
        >
          {FLOW.map((item, i) => (
            <li
              key={item.label}
              className="relative flex flex-col items-center justify-center rounded-2xl border border-[#e5e3dc] bg-white/90 px-4 py-5 md:rounded-full md:border-0 md:bg-transparent md:py-4"
            >
              {i > 0 ? (
                <span
                  className="pointer-events-none absolute left-0 top-1/2 hidden h-px w-full -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/35 to-transparent md:block"
                  aria-hidden
                />
              ) : null}
              <span className="relative z-10 font-serif text-2xl md:text-[1.65rem] text-ink tracking-tight">
                {item.label}
              </span>
              <span className="relative z-10 mt-1 text-sm md:text-[0.95rem] text-gray-500">
                {item.detail}
              </span>
            </li>
          ))}
        </motion.ol>

        {/* Motive principles — typography-led, larger */}
        <div className="mt-16 md:mt-20 max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 mb-8 md:mb-10">
            The motive
          </p>
          <ul className="space-y-0 list-none p-0 m-0 divide-y divide-[#e5e3dc] border-y border-[#e5e3dc]">
            {MOTIVES.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.li
                  key={item.title}
                  initial={{ opacity: 0, y: 14 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.22 + i * 0.08 }}
                  className="group grid md:grid-cols-[5.5rem_1fr] gap-4 md:gap-8 py-8 md:py-10"
                >
                  <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-3">
                    <span className="font-serif text-2xl md:text-3xl text-primary/80 tracking-tight tabular-nums">
                      {item.step}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif text-[1.65rem] md:text-[2rem] text-ink tracking-tight leading-tight transition-colors duration-300 group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-base md:text-lg text-gray-600 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* Dual audience + CTA */}
        <div className="mt-14 md:mt-16 mx-auto max-w-5xl grid md:grid-cols-[1fr_auto_1fr] gap-10 md:gap-12 items-start">
          <div>
            <h3 className="font-serif text-2xl md:text-[1.75rem] text-ink tracking-tight mb-4">
              For clients
            </h3>
            <ul className="space-y-3.5 list-none p-0 m-0">
              {[
                "Stop paying sequential intro fees to the wrong lawyer",
                "Compare providers on merit without brand pressure",
                "Keep sensitive disputes private until you are ready",
              ].map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-base md:text-[1.05rem] text-gray-600 leading-relaxed"
                >
                  <span
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="hidden md:block w-px self-stretch bg-gradient-to-b from-transparent via-[#d9d6ce] to-transparent"
            aria-hidden
          />

          <div>
            <h3 className="font-serif text-2xl md:text-[1.75rem] text-ink tracking-tight mb-4">
              For providers
            </h3>
            <ul className="space-y-3.5 list-none p-0 m-0">
              {[
                "Receive conflict-ready briefs, not cold open inquiries",
                "Compete on expertise instead of marketing spend",
                "Unlock identity only after COI affirmation and escrow",
              ].map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-base md:text-[1.05rem] text-gray-600 leading-relaxed"
                >
                  <span
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.4 }}
          className="mt-12 md:mt-14 flex justify-center"
        >
          <Link
            href="/find-lawyers"
            className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-on-primary hover:bg-primary-hover transition-colors shadow-[0_16px_36px_-18px_rgba(232,93,4,0.65)]"
          >
            Browse Anonymous Directory
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
