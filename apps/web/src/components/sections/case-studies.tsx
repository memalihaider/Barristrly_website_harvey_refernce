"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import LogoTicker from "@/components/ui/logo-ticker";

const slides = [
  {
    id: "difc",
    title: "Gulf counsel scales conflict-safe matching with Barristrly",
    partner: "DIFC corridor",
    video: "/bg-video.mp4",
  },
  {
    id: "inhouse",
    title: "In-house teams cut intake-to-match time from days to minutes",
    partner: "Corporate legal",
    video: "/bg-video.mp4",
  },
  {
    id: "litigation",
    title: "Litigation boutiques protect client relationships with dual consent",
    partner: "Litigation firms",
    video: "/bg-video.mp4",
  },
  {
    id: "enterprise",
    title: "Enterprise legal ops bring Marketplace and PracticeOS into one system",
    partner: "Enterprise",
    video: "/bg-video.mp4",
  },
];

const partners = [
  { name: "ADGM Registry" },
  { name: "DIFC Courts" },
  { name: "Dubai Land Dept" },
  { name: "UAE Laws Applied" },
  { name: "GCC Arbitration" },
  { name: "Abu Dhabi Courts" },
  { name: "London Commercial Court" },
];

export default function CaseStudies() {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const n = slides.length;

  const prev = useCallback(() => setIndex((i) => (i - 1 + n) % n), [n]);
  const next = useCallback(() => setIndex((i) => (i + 1) % n), [n]);

  useEffect(() => {
    if (!isInView) return;
    const id = window.setInterval(next, 7000);
    return () => window.clearInterval(id);
  }, [isInView, next]);

  return (
    <section id="cases" ref={ref} className="section-padding bg-black text-ivory">
      <div className="container-wide">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 md:mb-12">
          <h2 className="font-serif text-[clamp(1.75rem,3.2vw,2.75rem)] text-white tracking-tight leading-tight">
            Real impact for real clients
          </h2>
          <Link
            href="/request-demo"
            className="inline-flex self-start items-center rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ivory hover:text-ink transition-colors"
          >
            See more videos
          </Link>
        </div>

        <div className="relative">
          <div className="relative flex items-center justify-center min-h-[280px] md:min-h-[360px]">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous video"
              className="absolute left-0 z-20 hidden md:flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next video"
              className="absolute right-0 z-20 hidden md:flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="w-full overflow-hidden px-0 md:px-14">
              <div className="flex items-stretch justify-center gap-4 md:gap-6">
                {[-1, 0, 1].map((offset) => {
                  const i = (index + offset + n) % n;
                  const slide = slides[i];
                  const isCenter = offset === 0;
                  return (
                    <motion.article
                      key={`${slide.id}-${offset}`}
                      layout
                      className={`relative shrink-0 overflow-hidden rounded-xl border border-white/10 transition-all duration-500 ${
                        isCenter
                          ? "w-[min(100%,720px)] aspect-[16/9] opacity-100 scale-100 z-10"
                          : "hidden lg:block w-[min(28%,320px)] aspect-[16/9] opacity-40 scale-95 z-0"
                      }`}
                    >
                      <video
                        className="absolute inset-0 h-full w-full object-cover"
                        src={slide.video}
                        autoPlay={isCenter}
                        muted
                        loop
                        playsInline
                        aria-hidden
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/20" />
                      {isCenter ? (
                        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-3">
                            {slide.partner}
                          </p>
                          <h3 className="font-serif text-xl md:text-3xl text-white tracking-tight max-w-xl leading-snug">
                            {slide.title}
                          </h3>
                          <div className="mt-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm border border-white/30">
                            <Play className="h-4 w-4 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                      ) : null}
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-8 md:hidden">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-primary" : "w-1.5 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Compact single-row ticker — same as TrustBar under hero */}
        <div className="mt-10 md:mt-12 pt-8 border-t border-white/10">
          <LogoTicker partners={partners} speed={42} />
        </div>
      </div>
    </section>
  );
}
