"use client";

import { motion } from "framer-motion";
import { ArrowRight, Scale } from "lucide-react";
import Link from "next/link";
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

const OPTIONS = [
  {
    label: "Option 1 — Lawyer Matching",
    title: "Find the Right Legal Professional — Absolutely Free",
    href: "/services/lawyer-matching",
    emphasize: true,
  },
  {
    label: "Option 2 — Legal Consultation",
    title:
      "Speak to qualified Legal Experts from the comfort of your home. Access the legal guidance you need, wherever you are.",
    href: "/services/consultation",
    emphasize: true,
    pricing: [
      "15 min — AED 299",
      "25–30 min — AED 599",
      "50–60 min detailed — AED 1,199",
    ],
  },
  {
    label: "Option 3 — Legal Retainers",
    title:
      "Choose an affordable Monthly Lawyers Retainer Plan to meet your ongoing Legal Needs.",
    href: "/services/retainers",
    emphasize: false,
  },
  {
    label: "Option 4 — Documentation",
    title: "Get documentation done at reasonable charges.",
    href: "/services/contract-drafting",
    emphasize: false,
  },
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

      <div className="container-wide relative z-10 pt-36 md:pt-44 pb-10 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
            Dubai · Abu Dhabi · DIFC · ADGM · Mainland UAE
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[clamp(2.35rem,5.8vw,4.5rem)] text-white leading-[1.06] tracking-[-0.03em] mb-5"
          >
            Match with vetted Legal Professionals in UAE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl text-base md:text-lg text-white/90 leading-relaxed mb-8"
          >
            Four clear ways to get legal help — start free, book a session, keep
            monthly support, or get documents drafted at reasonable charges.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10"
          >
            <GradientButton
              size="lg"
              href="/services/lawyer-matching#request"
              variant="primary"
              className="inline-flex items-center gap-2"
            >
              Get matched — free
              <ArrowRight className="h-5 w-5" aria-hidden />
            </GradientButton>
            <GradientButton
              size="lg"
              href="/services/consultation#request"
              variant="white"
              className="inline-flex items-center gap-2"
            >
              <Scale className="h-5 w-5" aria-hidden />
              Book consultation
            </GradientButton>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="grid gap-3 list-none p-0 m-0 max-w-2xl"
          >
            {OPTIONS.map((opt) => (
              <li key={opt.label}>
                <Link
                  href={opt.href}
                  className={`block rounded-xl border px-4 py-3.5 transition-colors ${
                    opt.emphasize
                      ? "border-primary/50 bg-primary/15 hover:bg-primary/25"
                      : "border-white/15 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                    {opt.label}
                  </p>
                  <p className="mt-1.5 text-sm md:text-[15px] text-white leading-snug">
                    {opt.title}
                  </p>
                  {opt.pricing ? (
                    <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 list-none p-0 text-xs text-white/80">
                      {opt.pricing.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  ) : null}
                </Link>
              </li>
            ))}
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
