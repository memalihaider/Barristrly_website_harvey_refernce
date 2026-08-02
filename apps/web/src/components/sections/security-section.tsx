"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Fingerprint,
  ScrollText,
  Server,
} from "lucide-react";
import Link from "next/link";

/** Control themes — not certification claims */
const controls = [
  {
    icon: ShieldCheck,
    name: "Two-gate COI",
    detail: "Parties first — narrative locked until clearance",
  },
  {
    icon: Lock,
    name: "Encrypted sessions",
    detail: "Protected consults and matter access",
  },
  {
    icon: EyeOff,
    name: "Blind firm leads",
    detail: "Opposing parties only — client identity hidden",
  },
  {
    icon: Fingerprint,
    name: "Firm affirmation",
    detail: "Mandatory conflict cert before unblind",
  },
  {
    icon: ScrollText,
    name: "Audit trail",
    detail: "Sensitive actions logged for review",
  },
  {
    icon: Server,
    name: "Escrow unlock",
    detail: "Payment success gates identity & docs",
  },
];

export default function SecuritySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="security" ref={ref} className="section-padding relative">
      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-14 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="lg:col-span-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80 mb-4">
              Security
            </p>
            <h2 className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] text-white leading-tight tracking-tight">
              Enterprise-grade security and controls
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08 }}
            className="lg:col-span-6 space-y-5"
          >
            <p className="text-white/85 text-base md:text-lg leading-relaxed">
              Barristrly isolates matching parameters before privileged facts
              enter the system, then unblinds counsel only after mandatory COI
              affirmation and payment — with escrow, audit logs, and a 24-hour
              post-unlock quarantine if a conflict surfaces later.
            </p>
            <Link
              href="/security"
              className="inline-flex items-center justify-center rounded-full bg-[#f5f3ef] px-5 py-2.5 text-sm font-semibold !text-ink hover:bg-[#ebe7df] hover:!text-ink transition-colors"
            >
              More About Security
            </Link>
          </motion.div>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {controls.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="group relative flex flex-col items-center text-center rounded-2xl border border-[#e8e4db]/80 bg-[#faf9f6] p-7 md:p-8 transition-all duration-300 hover:bg-[#f5f3ef] hover:border-[#ddd8cd]"
              >
                <Icon
                  className="h-14 w-14 md:h-16 md:w-16 text-primary transition-transform duration-300 group-hover:scale-105"
                  strokeWidth={1}
                  aria-hidden
                />
                <p className="mt-5 text-base font-semibold tracking-tight !text-ink">
                  {item.name}
                </p>
                <p className="mt-2 text-sm max-w-[240px] leading-relaxed !text-gray-600">
                  {item.detail}
                </p>

                <Link
                  href="/security"
                  className="mt-4 text-xs font-semibold inline-flex items-center gap-1 text-primary hover:text-primary-hover transition-colors"
                >
                  Details
                  <span aria-hidden>↗</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
