"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import AnimatedCounter from "@/components/ui/animated-counter";

const stats = [
  { target: 20, suffix: "+", label: "Average hours saved per month" },
  { target: 300, suffix: "+", label: "Vetted firms on the network" },
  { target: 5, suffix: "+", label: "Countries Barristrly is used in" },
  { target: 12, suffix: " min", label: "Average time to first match", prefix: "<" },
  { target: 100, suffix: "%", label: "Cases party-screened before narrative unlock" },
];

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding dark-section">
      <div className="container-wide">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] text-white max-w-xl leading-tight mb-14 md:mb-20"
        >
          Helping teams stay focused and see measurable results
        </motion.h2>

        <div className="flex flex-col divide-y divide-white/15">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="py-7 md:py-9 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-baseline"
            >
              <span className="text-base md:text-lg text-text-secondary">
                {stat.label}
              </span>
              <div className="md:justify-self-end md:text-right">
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  label=""
                  className="text-white font-serif text-[clamp(2.5rem,5vw,4.25rem)] font-normal tracking-tight leading-none"
                  labelClassName="hidden"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
