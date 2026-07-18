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
    name: "Privacy-first matching",
    detail: "Double-blind routing before identity reveal",
  },
  {
    icon: Lock,
    name: "Encrypted sessions",
    detail: "Protected consults and matter access",
  },
  {
    icon: EyeOff,
    name: "COI safeguards",
    detail: "Conflict screening before engagement",
  },
  {
    icon: Fingerprint,
    name: "Role-based access",
    detail: "Client, lawyer, and admin boundaries",
  },
  {
    icon: ScrollText,
    name: "Audit trail",
    detail: "Sensitive actions logged for review",
  },
  {
    icon: Server,
    name: "Escrow controls",
    detail: "Milestone holds until work clears",
  },
];

export default function SecuritySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="security" ref={ref} className="section-padding dark-section relative">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(232,93,4,0.1), transparent 50%)",
        }}
        aria-hidden="true"
      />

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16 md:mb-20">
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
              Barristrly is built around the controls enterprise teams expect:
              double-blind identity routing, escrow guarantees, audit logs, and
              clear data access boundaries — designed for confidential legal work.
            </p>
            <Link
              href="/security"
              className="inline-flex text-sm font-semibold text-primary-light hover:text-primary transition-colors"
            >
              More About Security
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14 md:gap-y-16">
          {controls.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="flex flex-col items-center text-center group"
              >
                <Icon
                  className="h-16 w-16 md:h-20 md:w-20 text-white/35 group-hover:text-white/55 transition-colors duration-300"
                  strokeWidth={1}
                  aria-hidden
                />
                <p className="mt-6 text-base font-semibold text-white tracking-tight">
                  {item.name}
                </p>
                <p className="mt-2 text-sm text-white/45 max-w-[220px] leading-relaxed">
                  {item.detail}
                </p>
                <Link
                  href="/security"
                  className="mt-4 text-xs font-semibold text-white/50 hover:text-primary transition-colors inline-flex items-center gap-1"
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
