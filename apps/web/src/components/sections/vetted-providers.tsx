"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  EyeOff,
  ShieldCheck,
  Calendar,
  Briefcase,
  Lock,
  Globe,
} from "lucide-react";

const FEATURES = [
  {
    icon: EyeOff,
    title: "Anonymous Directory",
    detail: "Merit-first search where identity, firm names, and brands are hidden until selection.",
  },
  {
    icon: ShieldCheck,
    title: "Automated COI",
    detail: "Instant conflict-of-interest checks run automatically before consultations begin.",
  },
  {
    icon: Calendar,
    title: "Confidential Meetings",
    detail: "Scheduled audio/video consultations secured with dynamic anonymization layers.",
  },
  {
    icon: Briefcase,
    title: "Provider Matching",
    detail: "Advanced algorithms that classify your matter and route you to verified legal professionals.",
  },
  {
    icon: Lock,
    title: "Milestone Escrow",
    detail: "Secure payment routing where funds are held in escrow and released on client approval.",
  },
  {
    icon: Globe,
    title: "Global Corridor",
    detail: "Seamless cross-border access to vetted legal partners across international jurisdictions.",
  },
];

export default function VettedProviders() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="providers" ref={ref} className="section-padding soft-section">
      <div className="container-wide">
        <div className="max-w-3xl mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold uppercase tracking-wider text-primary mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden />
            Features
          </div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] text-ink tracking-tight leading-[1.1] mb-6">
            Top legal marketplace features
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl leading-relaxed">
            A comprehensive suite of tools built to protect privacy, clear conflicts, and facilitate secure consultations.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {FEATURES.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative bg-[#faf9f6]/95 border border-[#e5e3dc] hover:border-primary/30 rounded-2xl p-8 shadow-[0_12px_40px_rgba(0,0,0,0.015)] hover:shadow-[0_24px_60px_rgba(232,93,4,0.05)] transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between"
              >
                {/* Background soft glow gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/[0.06] text-primary group-hover:bg-primary group-hover:text-white group-hover:scale-105 transition-all duration-300 mb-6 shadow-sm">
                    <Icon className="h-5.5 w-5.5" strokeWidth={1.75} aria-hidden />
                  </div>
                  <h3 className="text-lg font-bold text-ink tracking-tight mb-3 group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed transition-colors duration-300 group-hover:text-gray-600">
                    {item.detail}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
