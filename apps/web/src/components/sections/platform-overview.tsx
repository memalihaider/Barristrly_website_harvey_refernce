"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function PlatformOverview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="platform" ref={ref} className="section-padding light-section">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="max-w-3xl mx-auto text-center mb-10 md:mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-4">
            Who &amp; why
          </p>
          <h2 className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] text-ink tracking-tight leading-tight mb-5">
            Premier legal technology marketplace
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Barristrly is an AI-designed premier legal technology marketplace
            connecting clients with top-tier lawyers, industry experts,
            certified arbitrators, and other legal service providers globally.
            Confidential meeting scheduling, an anonymous legal directory, and
            an automated conflict-of-interest check before every consultation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="media-frame mx-auto max-w-5xl relative overflow-hidden"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
            aria-label="Barristrly who and why overview"
          >
            <source src="/bg-video.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
            aria-hidden
          />
          <div className="relative z-10 flex flex-col items-center justify-center gap-2 text-white py-28 md:py-40 px-6 text-center">
            <span className="font-serif text-5xl md:text-6xl tracking-tight text-primary-light font-extrabold">
              B
            </span>
            <p className="text-sm text-white/80 max-w-md">
              Who Barristrly is — and how it supports corporates and individuals
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
