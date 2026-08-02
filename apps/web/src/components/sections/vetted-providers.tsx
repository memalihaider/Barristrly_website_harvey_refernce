"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  EyeOff,
  ShieldCheck,
  Calendar,
  Briefcase,
  Lock,
  Globe,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  detail: string;
  accent: string;
};

const FEATURES: Feature[] = [
  {
    icon: EyeOff,
    title: "Anonymous Directory",
    detail:
      "Merit-first search where identity, firm names, and brands stay hidden until you unlock a match.",
    accent: "01",
  },
  {
    icon: ShieldCheck,
    title: "Automated COI",
    detail:
      "Conflict-of-interest checks run before consultation — adverse parties screened, narrative held back.",
    accent: "02",
  },
  {
    icon: Calendar,
    title: "Confidential Meetings",
    detail:
      "Timed audio/video sessions with platform-held contacts until escrow clears and you consent to reveal.",
    accent: "03",
  },
  {
    icon: Briefcase,
    title: "Provider Matching",
    detail:
      "BARRI classifies your matter and routes you to verified lawyers, experts, and arbitrators by forum.",
    accent: "04",
  },
  {
    icon: Lock,
    title: "Milestone Escrow",
    detail:
      "Session fees sit in escrow and release only when the consult completes and milestones are approved.",
    accent: "05",
  },
  {
    icon: Globe,
    title: "Global Corridor",
    detail:
      "One marketplace corridor across UAE mainland, ADGM, DIFC, GCC, and the India–GCC bridge.",
    accent: "06",
  },
];

export default function VettedProviders() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!isInView || paused) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % FEATURES.length);
    }, 3800);
    return () => window.clearInterval(id);
  }, [isInView, paused]);

  const current = FEATURES[active];
  const Icon = current.icon;

  return (
    <section
      id="providers"
      ref={ref}
      className="relative section-padding overflow-hidden bg-[#0f0e0d] text-ivory"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Atmosphere */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 85% 20%, rgba(232,93,4,0.18), transparent 55%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(232,93,4,0.08), transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container-wide relative z-10">
        <div className="max-w-4xl mb-12 md:mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4">
            Features
          </p>
          <h2 className="font-serif text-[clamp(2.35rem,5vw,4rem)] tracking-tight leading-[1.05] text-white lg:whitespace-nowrap">
            Built for Match, Privacy, and Trust
          </h2>
          <p className="mt-4 text-base md:text-lg text-white/55 leading-relaxed max-w-xl">
            Six marketplace capabilities that move you from directory browse to
            conflict-clear consult — without a generic LegalOS desk.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Index rail */}
          <ol className="lg:col-span-5 flex flex-col list-none p-0 m-0 border-t border-white/10">
            {FEATURES.map((item, i) => {
              const isActive = i === active;
              return (
                <li key={item.title} className="border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    className="group w-full flex items-center gap-4 md:gap-5 py-4 md:py-5 text-left transition-colors"
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span
                      className={`font-serif text-sm tabular-nums transition-colors ${
                        isActive ? "text-primary" : "text-white/30"
                      }`}
                    >
                      {item.accent}
                    </span>
                    <span
                      className={`flex-1 font-serif text-xl md:text-2xl tracking-tight transition-all duration-300 ${
                        isActive
                          ? "text-white translate-x-1"
                          : "text-white/35 group-hover:text-white/70"
                      }`}
                    >
                      {item.title}
                    </span>
                    <span
                      className={`h-px w-8 md:w-12 transition-all duration-300 ${
                        isActive
                          ? "bg-primary w-14 md:w-20"
                          : "bg-white/15 group-hover:bg-white/35"
                      }`}
                      aria-hidden
                    />
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Spotlight stage */}
          <div className="lg:col-span-7 relative min-h-[320px] md:min-h-[380px]">
            <div className="absolute inset-0 rounded-[1.75rem] border border-white/10 bg-white/[0.03] backdrop-blur-[2px] overflow-hidden">
              <div
                className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
                aria-hidden
              />
              <div
                className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-primary/10 blur-2xl"
                aria-hidden
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.title}
                  initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 flex h-full flex-col justify-between p-8 md:p-10 lg:p-12"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-[0_12px_40px_rgba(232,93,4,0.35)]">
                      <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                    </div>
                    <span className="font-serif text-[clamp(3.5rem,8vw,6rem)] leading-none tracking-tighter text-white/[0.07] select-none">
                      {current.accent}
                    </span>
                  </div>

                  <div className="mt-10 md:mt-0 max-w-lg">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-3">
                      Marketplace capability
                    </p>
                    <h3 className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] text-white tracking-tight leading-[1.1]">
                      {current.title}
                    </h3>
                    <p className="mt-4 text-base md:text-lg text-white/60 leading-relaxed">
                      {current.detail}
                    </p>
                  </div>

                  {/* Progress ticks */}
                  <div className="mt-10 flex gap-1.5" aria-hidden>
                    {FEATURES.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1 rounded-full transition-all duration-500 ${
                          i === active
                            ? "w-8 bg-primary"
                            : "w-2 bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
