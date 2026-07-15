"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  subtitle?: string;
  align?: "left" | "center";
  headingClassName?: string;
}

export default function SectionHeading({
  eyebrow,
  heading,
  subtitle,
  align = "center",
  headingClassName = "",
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const alignmentClasses =
    align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className={`flex flex-col gap-4 ${alignmentClasses}`}
    >
      {eyebrow && (
        <motion.span
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
          }}
          className="text-xs font-semibold tracking-[0.18em] text-primary uppercase"
        >
          {eyebrow}
        </motion.span>
      )}

      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
        }}
        className={`font-serif text-[clamp(1.75rem,3vw,2.75rem)] font-normal leading-tight tracking-tight text-text-tertiary ${headingClassName}`}
      >
        {heading}
      </motion.h2>

      {subtitle && (
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
          }}
          className={`max-w-2xl text-base leading-relaxed text-text-on-light-muted md:text-lg ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
