"use client";

import { useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

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

export default function TestimonialHighlight() {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const t = testimonials[index];

  return (
    <section ref={ref} className="section-padding light-section">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7 min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45 }}
              >
                <p className="font-serif text-[clamp(1.4rem,2.8vw,2.15rem)] text-ink leading-[1.3] tracking-tight mb-8">
                  “{t.quote}”
                </p>
                <footer className="space-y-1">
                  <cite className="not-italic block text-sm font-semibold text-ink">
                    {t.name}
                  </cite>
                  <span className="block text-sm text-text-on-light-muted">
                    {t.title}
                  </span>
                  <span className="block text-sm text-text-muted">{t.org}</span>
                  <a
                    href="#cases"
                    className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-primary hover:text-primary-hover"
                  >
                    Customer Story <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </footer>
              </motion.blockquote>
            </AnimatePresence>

            <div className="flex gap-2 mt-10" role="tablist" aria-label="Testimonials">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-8 bg-primary" : "w-1.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Show testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[4/5] max-w-sm ml-auto overflow-hidden bg-gray-900">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(160deg, #33312c 0%, #0f0e0d 50%, #1a120e 100%)",
                }}
              />
              <div
                className="absolute inset-0 opacity-45"
                style={{
                  background:
                    "radial-gradient(circle at 40% 30%, rgba(232,93,4,0.35), transparent 55%)",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
