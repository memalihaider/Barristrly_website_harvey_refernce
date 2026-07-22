"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import GradientButton from "@/components/ui/gradient-button";

export default function CtaBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="cta" ref={ref} className="section-padding dark-section relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 25% 50%, rgba(232,93,4,0.16), transparent 50%)",
        }}
        aria-hidden="true"
      />

      <div className="container-wide relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] text-white leading-[1.1] tracking-tight">
              Find your exact legal match — anonymously
            </h2>
            <p className="mt-4 text-white/65 leading-relaxed max-w-lg">
              Directory · COI clearance · escrow-backed meetings. Schedule with
              our team or start with BARRI intake.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap gap-3"
          >
            <GradientButton size="lg" href="/request-demo" variant="primary">
              Schedule Meeting
            </GradientButton>
            <GradientButton size="lg" href="/find-lawyers" variant="outline" className="!text-primary !border-primary">
              Legal Direction
            </GradientButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
