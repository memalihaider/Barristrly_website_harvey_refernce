"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function PlatformOverview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="platform" ref={ref} className="section-padding-lg light-section">
      <div className="container-wide">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center font-serif text-[clamp(1.5rem,3.2vw,2.35rem)] text-ink leading-[1.25] tracking-tight mb-14 md:mb-20"
        >
          Barristrly is AI designed for legal and professional services. Advance your
          expertise on a secure platform that lets you focus on high-value work.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="media-frame mx-auto max-w-5xl relative"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, rgba(232,93,4,0.2), transparent 58%), linear-gradient(160deg, #1f1d1a, #0f0e0d)",
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 flex flex-col items-center justify-center gap-3 text-white py-28 md:py-40">
            <span className="font-serif text-6xl md:text-7xl tracking-tight text-primary-light font-extrabold">
              B
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
