"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  wide?: boolean;
  index?: number;
}

export default function FeatureCard({
  icon,
  title,
  description,
  wide = false,
  index = 0,
}: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: index * 0.08,
      }}
      whileHover={{
        y: -6,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      className={`group relative overflow-hidden rounded-2xl border border-orange-100/60 bg-gradient-to-br from-white/80 via-orange-50/30 to-amber-50/20 p-6 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-orange-100/40 sm:p-8 ${
        wide ? "md:col-span-2" : ""
      }`}
    >
      {/* Hover accent border effect */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-orange-400/0 transition-all duration-300 group-hover:border-orange-400/40" />

      {/* Subtle gradient orb decoration */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-orange-200/20 to-amber-100/10 blur-2xl transition-opacity duration-300 group-hover:opacity-80" />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Icon container */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-50 text-orange-600 shadow-sm ring-1 ring-orange-200/40 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight text-gray-900">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-gray-600">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
