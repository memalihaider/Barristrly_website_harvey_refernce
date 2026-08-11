"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Partner {
  name: string;
}

interface LogoTickerProps {
  partners: Partner[];
  speed?: number;
  /** CSS color for edge fade (match section background) */
  edgeFrom?: string;
  /** Dark type for cream / light surfaces */
  ink?: boolean;
}

export default function LogoTicker({
  partners,
  speed = 38,
  edgeFrom = "#000000",
  ink = false,
}: LogoTickerProps) {
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
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28"
          style={{
            background: `linear-gradient(to right, ${edgeFrom}, transparent)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28"
          style={{
            background: `linear-gradient(to left, ${edgeFrom}, transparent)`,
          }}
        />

        <div
          className="flex w-max items-center gap-12 sm:gap-16"
          style={{ animation: `ticker ${speed}s linear infinite` }}
        >
          {items.map((partner, i) => (
            <span
              key={`${partner.name}-${i}`}
              className={`whitespace-nowrap text-sm sm:text-base font-semibold tracking-wide transition-colors duration-300 ${
                ink
                  ? "text-ink/55 hover:text-ink"
                  : "text-white/90 hover:text-white"
              }`}
            >
              {partner.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
