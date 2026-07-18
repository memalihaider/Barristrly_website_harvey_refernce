"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote:
      "What we have seen with Barristrly is by far the most successful legal tech adoption story I have ever been a part of. Dual-consent routing protects client relationships from day one.",
    name: "Sarah Mitchell",
    title: "Managing Partner",
    org: "International Legal Partners",
  },
  {
    quote:
      "Barristrly has become part of our routine. Having a partner at this stage of cross-border practice is a real game-changer for conflict-safe matching.",
    name: "Marie-Cécile Martin",
    title: "Head of Legal Operations",
    org: "Gulf Corporate Counsel",
  },
  {
    quote:
      "The legal industry is evolving rapidly. Barristrly enables us to navigate COI complexity, streamline intake, and focus on delivering strategic value.",
    name: "Dr. Claudia Junker",
    title: "General Counsel",
    org: "Regional Enterprise Legal",
  },
];

export default function TestimonialsSlider() {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const n = testimonials.length;

  const prev = useCallback(() => setIndex((i) => (i - 1 + n) % n), [n]);
  const next = useCallback(() => setIndex((i) => (i + 1) % n), [n]);

  useEffect(() => {
    if (!isInView) return;
    const id = window.setInterval(next, 8000);
    return () => window.clearInterval(id);
  }, [isInView, next]);

  const t = testimonials[index];

  return (
    <section
      id="testimonials"
      ref={ref}
      className="section-padding dark-section relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 40%, rgba(232,93,4,0.12), transparent 50%)",
        }}
        aria-hidden
      />

      <div className="container-wide relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <h2 className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] text-white tracking-tight">
            Trusted by counsel who move with confidence
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="h-10 w-10 rounded-full border border-white/25 text-white hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="h-10 w-10 rounded-full border border-white/25 text-white hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="max-w-3xl min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              <p className="font-serif text-[clamp(1.35rem,2.8vw,2.1rem)] text-white leading-[1.35] tracking-tight">
                “{t.quote}”
              </p>
              <footer className="mt-8 space-y-1">
                <cite className="not-italic block text-sm font-semibold text-white">
                  {t.name}
                </cite>
                <span className="block text-sm text-white/55">
                  {t.title}, {t.org}
                </span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="flex gap-2 mt-10" role="tablist" aria-label="Testimonials">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-primary" : "w-1.5 bg-white/25 hover:bg-white/40"
              }`}
              aria-label={`Show testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
