"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  label: string;
  className?: string;
  labelClassName?: string;
}

export default function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2,
  label,
  className = "text-gray-900",
  labelClassName = "text-gray-500",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [displayValue, setDisplayValue] = useState(0);

  const springValue = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  const rounded = useTransform(springValue, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      springValue.set(target);
    }
  }, [isInView, springValue, target]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [rounded]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center gap-2"
    >
      <span className={`text-5xl font-bold tracking-tight tabular-nums md:text-6xl ${className}`}>
        {prefix}
        {displayValue.toLocaleString()}
        {suffix && (
          <span className="text-primary">{suffix}</span>
        )}
      </span>
      <span className={`text-sm font-medium tracking-wide uppercase ${labelClassName}`}>
        {label}
      </span>
    </motion.div>
  );
}
