"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Partner {
  name: string;
}

interface LogoTickerProps {
  partners: Partner[];
  speed?: number;
}

export default function LogoTicker({ partners, speed = 38 }: LogoTickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const items = [...partners, ...partners];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full overflow-hidden"
    >
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28 bg-gradient-to-l from-black to-transparent" />

        <div
          className="flex w-max items-center gap-12 sm:gap-16"
          style={{ animation: `ticker ${speed}s linear infinite` }}
        >
          {items.map((partner, i) => (
            <span
              key={`${partner.name}-${i}`}
              className="whitespace-nowrap text-sm sm:text-base font-semibold tracking-wide text-white/30 hover:text-white/60 transition-colors duration-300"
            >
              {partner.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
