"use client";

import { motion } from "framer-motion";
import { Compass, Scale } from "lucide-react";
import GradientButton from "@/components/ui/gradient-button";
import LogoTicker from "@/components/ui/logo-ticker";

const partners = [
  { name: "ADGM Registry" },
  { name: "DIFC Courts" },
  { name: "Dubai Land Dept" },
  { name: "UAE Laws Applied" },
  { name: "GCC Arbitration" },
  { name: "Abu Dhabi Courts" },
  { name: "London Commercial Court" },
];

export default function Hero() {
  return (
    <section className="relative min-h-dvh flex flex-col justify-between overflow-hidden bg-black">
      {/* Video Background */}
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

      {/* Gradients Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent"
        aria-hidden="true"
      />

      {/* Main Hero Copy Content */}
      <div className="container-wide relative z-10 pt-40 md:pt-48 pb-10 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[clamp(2.75rem,7vw,5.5rem)] text-white leading-[1.02] tracking-[-0.03em] mb-6"
          >
            Lawyer Match, Redefined
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl text-base md:text-lg text-white leading-relaxed mb-10"
          >
            Anonymous legal directory. Automated conflict checks before every
            consult. Confidential meeting scheduling with escrow-backed matches.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <GradientButton
              size="lg"
              href="/find-lawyers"
              variant="primary"
              className="inline-flex items-center gap-2"
            >
              <Compass className="h-5 w-5" aria-hidden />
              Legal Direction
            </GradientButton>
            <GradientButton
              size="lg"
              href="/find-lawyers"
              variant="white"
              className="inline-flex items-center gap-2"
            >
              <Scale className="h-5 w-5" aria-hidden />
              Match my Lawyer
            </GradientButton>
          </motion.div>
        </div>
      </div>

      {/* Moving Logos Bar Overlayed at the bottom (Harvey-Style) */}
      <div className="w-full bg-[#0b0a09]/50 backdrop-blur-md border-t border-white/10 py-5 relative z-10 shrink-0">
        <div className="container-wide flex items-center justify-between gap-6">
          <div className="flex-1 overflow-hidden">
            <LogoTicker partners={partners} speed={36} />
          </div>
          <div className="shrink-0 hidden md:block">
            <span className="text-[9px] uppercase font-bold tracking-widest text-white/60 border border-white/15 px-3.5 py-1.5 rounded bg-white/5 whitespace-nowrap">
              Vetted Forums
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
