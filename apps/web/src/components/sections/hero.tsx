"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Scale } from "lucide-react";
import GradientButton from "@/components/ui/gradient-button";
import LogoTicker from "@/components/ui/logo-ticker";

const partners = [
  { name: "Dubai" },
  { name: "Abu Dhabi" },
  { name: "Mainland UAE" },
  { name: "DIFC" },
  { name: "ADGM" },
  { name: "Corporate & Tax" },
  { name: "Family & Wills" },
  { name: "Disputes" },
];

export default function Hero() {
  return (
    <section className="relative min-h-dvh flex flex-col justify-between overflow-hidden bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent"
        aria-hidden="true"
      />

      <div className="container-wide relative z-10 pt-40 md:pt-48 pb-10 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
            Vetted UAE lawyers · Dubai · Abu Dhabi · DIFC · ADGM
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[clamp(2.5rem,6.2vw,5rem)] text-white leading-[1.04] tracking-[-0.03em] mb-6"
          >
            Find the right lawyer in Dubai &amp; the UAE{" "}
            <span className="italic text-white/80">— matched in 48 hours</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl text-base md:text-lg text-white leading-relaxed mb-10"
          >
            Contract drafting, company formation &amp; PRO, Wills, legal retainers
            and arbitration support. Tell us what you need — we match you with
            vetted, licensed professionals and show clear AED pricing before you
            commit.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <GradientButton
              size="lg"
              href="/ai/intake"
              variant="primary"
              className="inline-flex items-center gap-2"
            >
              Get a free lawyer match
              <ArrowRight className="h-5 w-5" aria-hidden />
            </GradientButton>
            <GradientButton
              size="lg"
              href="/services"
              variant="white"
              className="inline-flex items-center gap-2"
            >
              <Scale className="h-5 w-5" aria-hidden />
              Services &amp; pricing
            </GradientButton>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-7 flex flex-wrap gap-x-6 gap-y-2 list-none p-0 text-sm text-white/85"
          >
            {["Free to submit", "Reply within 48 hours", "Clear AED pricing", "Confidential"].map(
              (item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-primary" aria-hidden />
                  {item}
                </li>
              ),
            )}
          </motion.ul>
        </div>
      </div>

      <div className="w-full bg-[#0b0a09]/50 backdrop-blur-md border-t border-white/10 py-5 relative z-10 shrink-0">
        <div className="container-wide flex items-center justify-between gap-6">
          <div className="flex-1 overflow-hidden">
            <LogoTicker partners={partners} speed={36} />
          </div>
          <div className="shrink-0 hidden md:block">
            <span className="text-[9px] uppercase font-bold tracking-widest text-white/60 border border-white/15 px-3.5 py-1.5 rounded bg-white/5 whitespace-nowrap">
              Areas we cover
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
