"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EyeOff, Scale, Shield, UserCheck } from "lucide-react";
import Link from "next/link";

const MOTIVES = [
  {
    icon: Scale,
    title: "Remove brand bias",
    body: "Firm names, logos, and personal brands stay hidden so you choose on practice fit, forum experience, and fee tier — not reputation theater.",
  },
  {
    icon: Shield,
    title: "Protect sensitive matters",
    body: "Your identity and contact details stay masked through intake and first consult. Unmasking happens only when you accept counsel.",
  },
  {
    icon: UserCheck,
    title: "Clear conflicts first",
    body: "Adverse parties are screened before narrative and documents enter the pool — so you never brief a conflicted firm by accident.",
  },
];

const USEFUL = [
  {
    title: "For clients",
    points: [
      "Stop paying sequential intro fees to the wrong lawyer",
      "Compare providers on merit without brand pressure",
      "Keep sensitive disputes private until you are ready",
    ],
  },
  {
    title: "For providers",
    points: [
      "Receive conflict-ready briefs, not cold open inquiries",
      "Compete on expertise instead of marketing spend",
      "Unlock identity only after COI affirmation and escrow",
    ],
  },
];

export default function AnonymousWhy() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="why-anonymous"
      ref={ref}
      className="relative section-padding overflow-hidden light-section"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 0% 0%, rgba(232,93,4,0.06), transparent 50%), radial-gradient(ellipse 45% 35% at 100% 100%, rgba(232,93,4,0.05), transparent 50%)",
        }}
      />

      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-4">
              Why anonymous directory
            </p>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
              <EyeOff className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="font-serif text-[clamp(1.85rem,3.5vw,3rem)] text-ink tracking-tight leading-[1.08]">
              Merit first. Identity later.
            </h2>
            <p className="mt-5 text-base md:text-lg text-gray-600 leading-relaxed">
              We built anonymity into Barristrly so legal matching stays
              fair, private, and conflict-safe. Firm identity, personal names,
              and brand markers remain hidden until mutual invitation and
              acceptance unlock the matter — eliminating geographic and branding
              bias from the first browse.
            </p>
            <Link
              href="/find-lawyers"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-hover transition-colors"
            >
              Browse anonymous directory
            </Link>
          </motion.div>

          <div className="lg:col-span-7 space-y-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 mb-5">
                The motive
              </p>
              <ul className="space-y-0 list-none p-0 m-0 border-t border-[#e5e3dc]">
                {MOTIVES.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.li
                      key={item.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.08 * i }}
                      className="flex gap-4 border-b border-[#e5e3dc] py-5"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <div>
                        <h3 className="font-serif text-xl text-ink tracking-tight">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
                          {item.body}
                        </p>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 mb-5">
                How it helps
              </p>
              <div className="grid sm:grid-cols-2 gap-8">
                {USEFUL.map((col, i) => (
                  <motion.div
                    key={col.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  >
                    <h3 className="text-sm font-semibold text-primary mb-3">
                      {col.title}
                    </h3>
                    <ul className="space-y-3 list-none p-0 m-0">
                      {col.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-2.5 text-sm text-gray-600 leading-relaxed"
                        >
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                            aria-hidden
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
