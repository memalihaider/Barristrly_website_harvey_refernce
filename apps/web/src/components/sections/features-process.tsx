"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  CalendarDays,
  EyeOff,
  Scale,
  Check,
  Lock,
  Mic,
} from "lucide-react";

const STEPS = [
  {
    icon: Scale,
    title: "Describe & classify",
    body: "BARRI maps your matter to practice area, jurisdiction, and budget.",
    label: "Intake",
  },
  {
    icon: EyeOff,
    title: "Anonymous directory",
    body: "Browse masked provider cards on merit — firm brands stay hidden until unlock.",
    label: "Directory",
  },
  {
    icon: ShieldCheck,
    title: "Conflict clearance",
    body: "Automated COI runs before consult; firms affirm adverse parties blind.",
    label: "COI",
  },
  {
    icon: CalendarDays,
    title: "Schedule & meet",
    body: "Fund escrow, book a timed anonymous VoIP session, then unmask on consent.",
    label: "Meet",
  },
];

function StepPreview({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              BARRI Intake
            </span>
          </div>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
            Classifying…
          </span>
        </div>
        <div className="rounded-xl border border-[#e8e5df] bg-[#faf9f6] p-4">
          <p className="text-sm text-ink leading-relaxed">
            “Commercial lease dispute in Dubai — claim value around AED 1.2M.”
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Corporate lease", "Dubai", "AED 1M+", "Urgent"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#e5e3dc] bg-white px-3 py-1 text-[11px] font-medium text-ink/80"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
              Masked matching
            </span>
          </div>
          <span className="text-[11px] text-gray-500">2 candidates</span>
        </div>
        {[
          {
            id: "COUNSEL–8390",
            match: "98%",
            line: "Dubai arbitrator · 14 yrs · DIFC commercial",
          },
          {
            id: "COUNSEL–4412",
            match: "94%",
            line: "Mainland counsel · lease & RDC disputes",
          },
        ].map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-[#e8e5df] bg-white p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xs font-bold text-primary">
                {c.id}
              </span>
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                {c.match} merit
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-600 leading-relaxed">{c.line}</p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
              <Lock className="h-3 w-3" aria-hidden />
              Identity encrypted until unlock
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            Conflict screening
          </span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
            PASSED
          </span>
        </div>
        <ul className="space-y-3 list-none p-0 m-0">
          {[
            "Party registration locked",
            "Blind adverse-party search",
            "Firm affirmation received",
          ].map((row) => (
            <li
              key={row}
              className="flex items-center justify-between gap-3 rounded-xl border border-[#e8e5df] bg-white px-4 py-3"
            >
              <span className="text-sm text-ink">{row}</span>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Check className="h-3.5 w-3.5" aria-hidden />
              </span>
            </li>
          ))}
        </ul>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#eceae4]">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            Session ready
          </span>
        </div>
        <span className="text-[11px] font-medium text-gray-500">
          Escrow held
        </span>
      </div>
      <div className="rounded-xl border border-[#e8e5df] bg-white p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mic className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <p className="text-xs text-gray-500">Anonymous VoIP</p>
            <p className="font-serif text-xl text-ink tracking-tight">
              Starts in 02:40
            </p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-lg bg-[#faf9f6] px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Duration
            </p>
            <p className="mt-0.5 text-sm font-semibold text-ink">45 min</p>
          </div>
          <div className="rounded-lg bg-[#faf9f6] px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Status
            </p>
            <p className="mt-0.5 text-sm font-semibold text-primary">Protected</p>
          </div>
        </div>
      </div>
      <div className="w-full rounded-xl bg-primary py-3 text-center text-sm font-semibold text-on-primary">
        Enter meeting room
      </div>
    </div>
  );
}

export default function FeaturesProcess() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || !isInView) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [paused, isInView]);

  const current = STEPS[activeStep];
  const Icon = current.icon;

  return (
    <section
      id="features"
      ref={ref}
      className="relative section-padding overflow-hidden soft-section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Soft light atmosphere */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 90% 10%, rgba(232,93,4,0.08), transparent 55%), radial-gradient(ellipse 40% 35% at 5% 90%, rgba(232,93,4,0.05), transparent 50%)",
        }}
      />

      <div className="container-wide relative z-10">
        <div className="max-w-2xl mb-12 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-3">
            Features
          </p>
          <h2 className="font-serif text-[clamp(1.85rem,3.5vw,3rem)] text-ink tracking-tight leading-[1.08]">
            From matter to meeting — four clear steps
          </h2>
          <p className="mt-3 text-gray-600 leading-relaxed max-w-xl">
            A guided marketplace flow: classify, browse anonymously, clear
            conflicts, then meet under escrow.
          </p>
        </div>

        {/* Progress rail */}
        <div className="mb-10 md:mb-12">
          <div className="relative flex items-center justify-between gap-2">
            <div
              className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[#e5e3dc]"
              aria-hidden
            />
            <motion.div
              className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-primary origin-left"
              aria-hidden
              animate={{
                width: `${(activeStep / (STEPS.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
            {STEPS.map((step, i) => {
              const done = i <= activeStep;
              return (
                <button
                  key={step.label}
                  type="button"
                  onClick={() => setActiveStep(i)}
                  onFocus={() => setActiveStep(i)}
                  className="relative z-10 flex flex-col items-center gap-2"
                  aria-current={i === activeStep ? "step" : undefined}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300 ${
                      done
                        ? "border-primary bg-primary text-on-primary shadow-[0_8px_20px_rgba(232,93,4,0.25)]"
                        : "border-[#e5e3dc] bg-white text-gray-400"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`hidden sm:block text-[11px] font-semibold tracking-wide ${
                      i === activeStep ? "text-primary" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Step list — editorial, not card stack */}
          <div className="lg:col-span-5 flex flex-col">
            <ol className="flex flex-col list-none p-0 m-0 border-t border-[#e5e3dc]">
              {STEPS.map((step, i) => {
                const StepIcon = step.icon;
                const isActive = i === activeStep;
                return (
                  <li key={step.title} className="border-b border-[#e5e3dc]">
                    <button
                      type="button"
                      onClick={() => setActiveStep(i)}
                      onMouseEnter={() => setActiveStep(i)}
                      onFocus={() => setActiveStep(i)}
                      className="group w-full flex gap-4 py-5 md:py-6 text-left transition-colors"
                      aria-current={isActive ? "true" : undefined}
                    >
                      <span
                        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                          isActive
                            ? "bg-primary text-on-primary"
                            : "bg-primary/10 text-primary group-hover:bg-primary/15"
                        }`}
                      >
                        <StepIcon className="h-4.5 w-4.5" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block font-serif text-xl md:text-2xl tracking-tight transition-colors ${
                            isActive ? "text-ink" : "text-ink/35 group-hover:text-ink/60"
                          }`}
                        >
                          {step.title}
                        </span>
                        <AnimatePresence initial={false}>
                          {isActive ? (
                            <motion.span
                              key="body"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.28 }}
                              className="mt-2 block text-sm text-gray-600 leading-relaxed overflow-hidden"
                            >
                              {step.body}
                            </motion.span>
                          ) : null}
                        </AnimatePresence>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Light product canvas */}
          <div className="lg:col-span-7 relative min-h-[380px]">
            <div className="absolute inset-0 overflow-hidden rounded-[1.75rem] border border-[#e5e3dc] bg-[#faf9f6]">
              <div
                className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
                aria-hidden
              />
              <div
                className="absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-primary/[0.06] blur-2xl"
                aria-hidden
              />

              {/* Soft photo wash */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/testimonials/priya.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-[0.12] grayscale"
                aria-hidden
              />

              <div className="relative z-10 flex h-full flex-col p-6 md:p-8 lg:p-10">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-[0_10px_28px_rgba(232,93,4,0.28)]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <span className="font-serif text-[clamp(3rem,7vw,5rem)] leading-none tracking-tighter text-ink/[0.06] select-none">
                    {String(activeStep + 1).padStart(2, "0")}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 flex flex-col justify-center"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-2">
                      Step {activeStep + 1} · {current.label}
                    </p>
                    <h3 className="font-serif text-2xl md:text-3xl text-ink tracking-tight mb-6">
                      {current.title}
                    </h3>
                    <div className="rounded-2xl border border-[#e5e3dc] bg-white/90 p-5 md:p-6 shadow-[0_20px_50px_-30px_rgba(15,14,13,0.35)]">
                      <StepPreview step={activeStep} />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
