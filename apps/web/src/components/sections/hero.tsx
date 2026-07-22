"use client";

import { motion } from "framer-motion";
import { Compass, CalendarDays } from "lucide-react";
import GradientButton from "@/components/ui/gradient-button";

export default function Hero() {
  return (
    <section className="relative min-h-dvh flex flex-col justify-end overflow-hidden bg-black">
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

      <div className="container-wide relative z-10 pb-24 pt-40 md:pb-32 md:pt-48">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[clamp(2.75rem,7vw,5.5rem)] text-white leading-[1.02] tracking-[-0.03em] mb-6"
          >
            Lawyer Match, Redefined
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl text-base md:text-lg text-white leading-relaxed mb-10"
          >
            Barristrly is a premier legal technology marketplace connecting
            clients with top-tier lawyers, industry experts, certified
            arbitrators, and legal service providers — with an anonymous
            directory, confidential meeting scheduling, and automated conflict
            checks before consultation begins.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <GradientButton
              size="lg"
              href="/find-lawyers"
              variant="primary"
              className="inline-flex items-center gap-2"
            >
              <Compass className="h-5 w-5" aria-hidden />
              Legal Direction
            </GradientButton>
            <GradientButton
              size="lg"
              href="/request-demo"
              variant="white"
              className="inline-flex items-center gap-2"
            >
              <CalendarDays className="h-5 w-5" aria-hidden />
              Schedule Meeting
            </GradientButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
