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
    featured: true,
    highlight: "Cryptographic hashing",
    highlightDetail:
      "Conflict checks are verified and protected with cryptographic hashing — so clearance can’t be spoofed or quietly altered.",
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
    <section id="security" ref={ref} className="section-padding dark-section relative overflow-hidden">
      {/* Ambient brand glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(232,93,4,0.18), transparent 55%), radial-gradient(ellipse 50% 40% at 80% 70%, rgba(232,93,4,0.1), transparent 50%), radial-gradient(ellipse 40% 35% at 15% 85%, rgba(232,93,4,0.08), transparent 50%)",
        }}
        aria-hidden="true"
      />

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-14 md:mb-18">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="lg:col-span-6"
          >
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
            <p className="text-text-secondary text-base leading-relaxed">
              Barristrly isolates matching parameters before privileged facts
              enter the system, then unblinds counsel only after mandatory COI
              affirmation and payment — with escrow, audit logs, and a 24-hour
              post-unlock quarantine if a conflict surfaces later.
            </p>
            <Link
              href="/security"
              className="inline-flex text-sm font-semibold text-primary-light hover:text-primary transition-colors"
            >
              More About Security
            </Link>
          </motion.div>
        </div>

        <div className="relative">
          {/* Soft orange glow behind the card grid */}
          <div
            className="pointer-events-none absolute inset-0 -m-6 md:-m-10 rounded-[2rem]"
            style={{
              background:
                "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(232,93,4,0.16), transparent 65%)",
            }}
            aria-hidden
          />

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {controls.map((item, index) => {
              const Icon = item.icon;
              const featured = "featured" in item && item.featured;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className={`group relative flex flex-col items-center text-center rounded-2xl border p-7 md:p-8 transition-all duration-300
                    ${
                      featured
                        ? "border-primary/40 bg-primary/[0.08] shadow-[0_0_40px_-12px_rgba(232,93,4,0.45)]"
                        : "border-white/10 bg-white/[0.03] hover:border-primary/30 hover:bg-white/[0.05] hover:shadow-[0_0_32px_-14px_rgba(232,93,4,0.35)]"
                    }`}
                >
                  {featured ? (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-on-primary">
                      Trust differentiator
                    </span>
                  ) : null}

                  <Icon
                    className={`h-14 w-14 md:h-16 md:w-16 transition-colors duration-300 ${
                      featured
                        ? "text-primary"
                        : "text-white/35 group-hover:text-primary"
                    }`}
                    strokeWidth={1}
                    aria-hidden
                  />
                  <p className="mt-5 text-base font-semibold text-white tracking-tight">
                    {item.name}
                  </p>
                  <p className="mt-2 text-sm text-white/45 max-w-[240px] leading-relaxed">
                    {item.detail}
                  </p>

                  {featured && "highlight" in item ? (
                    <div className="mt-4 w-full rounded-xl border border-primary/25 bg-primary/10 px-3.5 py-3 text-left">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                        {item.highlight}
                      </p>
                      <p className="mt-1.5 text-xs text-white/70 leading-relaxed">
                        {item.highlightDetail}
                      </p>
                    </div>
                  ) : null}

                  <Link
                    href="/security"
                    className="mt-4 text-xs font-semibold text-white/50 group-hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    Details
                    <span aria-hidden>↗</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
