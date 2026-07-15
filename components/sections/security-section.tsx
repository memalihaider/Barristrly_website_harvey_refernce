"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Eye, Key, Database, RefreshCw, FileText } from "lucide-react";
import Link from "next/link";

const badges = [
  { icon: Shield, name: "SOC2 II" },
  { icon: Eye, name: "CCPA" },
  { icon: Key, name: "ISO 27001" },
  { icon: Database, name: "GDPR" },
  { icon: RefreshCw, name: "ISO 27701" },
  { icon: FileText, name: "ISO 42001" },
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
              Barristrly meets the highest industry standards for security and
              compliance. We include the controls enterprise teams expect:
              double-blind identity routing, escrow guarantees, audit logs, data
              lifecycle management, and more.
            </p>
            <Link
              href="#cta"
              className="inline-flex text-sm font-semibold text-primary-light hover:text-primary transition-colors"
            >
              More About Security
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="flex flex-col items-center text-center gap-4 group"
              >
                <div className="flex h-16 w-16 items-center justify-center border border-white/25 text-primary-light transition-colors group-hover:border-primary group-hover:text-primary">
                  <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                </div>
                <p className="text-sm font-medium text-white">{badge.name}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
