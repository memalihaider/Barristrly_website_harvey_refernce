"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import GradientButton from "@/components/ui/gradient-button";
import { Clock, Users, Scale } from "lucide-react";

const SESSIONS = [
  { minutes: "30", price: "400", detail: "Quick scope & direction" },
  { minutes: "45", price: "600", detail: "Extended anonymous consult" },
  { minutes: "60", price: "800", detail: "Full-hour matter deep dive" },
];

const VALUE_POINTS = [
  {
    icon: Users,
    title: "Consult more than one lawyer",
    body: "At a fraction of traditional rates, you can meet multiple specialists before you commit.",
  },
  {
    icon: Scale,
    title: "Compare expertise, then choose",
    body: "Weigh fit, forum experience, and advice quality — then pick the counsel best suited to your matter.",
  },
  {
    icon: Clock,
    title: "No long-term lock-in upfront",
    body: "Pay for timed consults only. Engage retainers when you’re confident — not before.",
  },
];

export default function HomePricing() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" ref={ref} className="section-padding soft-section">
      <div className="container-wide">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-4">
              Accessible legal advice
            </p>
            <h2 className="font-serif text-[clamp(1.85rem,3.5vw,3rem)] text-ink tracking-tight leading-[1.08]">
              Quality legal advice at a fair session rate
            </h2>
            <p className="mt-5 text-base md:text-lg text-gray-600 leading-relaxed">
              A detailed legal consultation often costs{" "}
              <span className="font-semibold text-ink">AED 1,000 or more per hour</span>.
              Barristrly makes verified, conflict-cleared advice far more
              accessible — so you can explore options before a long-term
              engagement.
            </p>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              Talk to multiple lawyers at a minimal session cost, compare their
              expertise, and choose the one best suited for your matter with
              confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GradientButton href="/pricing" size="md" variant="primary">
                View full pricing
              </GradientButton>
              <Link
                href="/find-lawyers"
                className="inline-flex items-center justify-center rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink hover:border-primary hover:text-primary transition-colors"
              >
                Browse directory
              </Link>
            </div>
          </motion.div>

          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="rounded-[1.5rem] border border-[#e5e3dc] bg-[#faf9f6] p-6 md:p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary mb-6">
                Timed anonymous sessions
              </p>
              <div className="grid sm:grid-cols-3 gap-4 md:gap-5">
                {SESSIONS.map((s, i) => (
                  <motion.div
                    key={s.minutes}
                    initial={{ opacity: 0, y: 12 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.12 + i * 0.06 }}
                    className="rounded-2xl border border-[#e5e3dc] bg-white p-5 text-center transition-all duration-300 hover:border-primary/35 hover:shadow-[0_16px_36px_-20px_rgba(232,93,4,0.3)]"
                  >
                    <p className="font-serif text-2xl md:text-3xl text-ink tracking-tight">
                      {s.minutes}{" "}
                      <span className="text-base font-sans font-medium text-gray-500">
                        min
                      </span>
                    </p>
                    <p className="mt-3 font-serif text-xl md:text-2xl font-semibold text-primary tracking-tight">
                      AED {s.price}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                      Per session
                    </p>
                    <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                      {s.detail}
                    </p>
                  </motion.div>
                ))}
              </div>
              <p className="mt-5 text-center text-xs text-gray-500">
                Fees held in escrow until the consult is complete.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-5">
              {VALUE_POINTS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    className="border-t border-[#e5e3dc] pt-4"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                      <Icon className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <h3 className="text-sm font-semibold text-ink tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
                      {item.body}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
