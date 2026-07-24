"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ShieldCheck, Calendar, EyeOff, Scale } from "lucide-react";

const STEPS = [
  {
    icon: Scale,
    title: "Describe & classify",
    body: "BARRI maps your matter to practice area, jurisdiction, and budget.",
  },
  {
    icon: EyeOff,
    title: "Anonymous directory",
    body: "Browse masked provider cards on merit — firm brands stay hidden until unlock.",
  },
  {
    icon: ShieldCheck,
    title: "Conflict clearance",
    body: "Automated COI runs before consult; firms affirm adverse parties blind.",
  },
  {
    icon: Calendar,
    title: "Schedule & meet",
    body: "Fund escrow, book a timed anonymous VoIP session, then unmask on consent.",
  },
];

export default function FeaturesProcess() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeStep, setActiveStep] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered || !isInView) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered, isInView]);

  return (
    <section id="features" ref={ref} className="section-padding light-section">
      <div className="container-wide">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-3">
                Features
              </p>
              <h2 className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] text-ink tracking-tight">
                Step-by-step marketplace process
              </h2>
              <p className="mt-3 text-gray-600 leading-relaxed">
                From intake to anonymous consult — built for aggregators, not
                in-house LegalOS workspaces.
              </p>
            </div>
            
            <div className="space-y-4">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                const isActive = i === activeStep;
                return (
                  <button
                    key={step.title}
                    onMouseEnter={() => {
                      setActiveStep(i);
                      setIsHovered(true);
                    }}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => setActiveStep(i)}
                    className={`w-full text-left flex gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                      isActive
                        ? "bg-[#faf9f6] border-[#e5e3dc] shadow-[0_12px_30px_rgba(0,0,0,0.015)]"
                        : "bg-transparent border-transparent opacity-60 hover:opacity-95"
                    }`}
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      isActive ? "bg-primary text-white scale-105 shadow-md shadow-primary/10" : "bg-primary/10 text-primary"
                    }`}>
                      <Icon className="h-4.5 w-4.5" aria-hidden />
                    </span>
                    <div>
                      <p className="font-semibold text-ink tracking-tight text-base">
                        {step.title}
                      </p>
                      <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="media-frame relative overflow-hidden min-h-[380px] md:min-h-[460px] rounded-2xl shadow-xl border border-gray-100"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover opacity-60"
                aria-label="Barristrly features and process"
              >
                <source src="/bg-video.mp4" type="video/mp4" />
              </video>
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"
                aria-hidden
              />
              
              {/* Dynamic Interactive HUD / Screen Mockup Overlay */}
              <div className="absolute inset-0 z-20 flex items-center justify-center p-6 md:p-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, scale: 0.94, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: -15 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_30px_60px_rgba(0,0,0,0.5)] max-w-sm w-full text-white"
                  >
                    {activeStep === 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">BARRI Intake AI</span>
                          </div>
                          <span className="text-[10px] text-white/40 font-mono">v1.2</span>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                          <p className="text-xs font-mono text-white/90 leading-relaxed">
                            "Intake query: Dispute over Commercial lease in Dubai, AED 1.2M value."
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 border border-white/5 text-white/80 font-medium">Corporate Lease</span>
                          <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 border border-white/5 text-white/80 font-medium">Dubai IFC</span>
                          <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 border border-white/5 text-white/80 font-medium">AED 1M+</span>
                        </div>
                      </div>
                    )}
                    {activeStep === 1 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Masked Matching</span>
                          </div>
                          <span className="text-[10px] text-white/40 font-mono">2 candidates</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-primary font-bold">COUNSEL-8390</span>
                            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">98% Merit Match</span>
                          </div>
                          <p className="text-[11px] text-white/70 leading-relaxed">
                            Dubai Arbitrator · 14 yrs exp · Qualified in corporate commercial litigation & DIFC rules.
                          </p>
                        </div>
                        <p className="text-[10px] text-white/40 text-center italic leading-tight">
                          Firm identities and profiles remain encrypted.
                        </p>
                      </div>
                    )}
                    {activeStep === 2 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">Conflict Screening</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary font-bold">PASSED</span>
                        </div>
                        <div className="space-y-2.5 py-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/60">Party registration list</span>
                            <span className="text-emerald-400 font-mono font-medium">Clear</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/60">Blind adverse search</span>
                            <span className="text-emerald-400 font-mono font-medium">Passed</span>
                          </div>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-primary" 
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>
                    )}
                    {activeStep === 3 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-red-400">VoIP Session Ready</span>
                          </div>
                          <span className="text-[10px] text-white/40 font-mono">Escrow Active</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3.5 rounded-xl">
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-white/50 font-medium">Meeting Protected</p>
                            <p className="text-xs font-semibold text-white">Timed VoIP starting in 02:40</p>
                          </div>
                        </div>
                        <button className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-primary/20">
                          Enter Meeting Room
                        </button>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
