"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type ButtonSize = "sm" | "md" | "lg";

interface GradientButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  size?: ButtonSize;
  showArrow?: boolean;
  className?: string;
  variant?: "primary" | "white" | "ghost";
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-7 py-3.5 text-[0.9375rem]",
  lg: "px-8 py-4 text-base",
};

export default function GradientButton({
  children,
  href,
  onClick,
  size = "md",
  className = "",
  variant = "primary",
}: GradientButtonProps) {
  const variants = {
    primary:
      "bg-primary text-on-primary hover:bg-primary-hover",
    white: "bg-white text-ink hover:bg-gray-100",
    ghost:
      "bg-transparent text-ivory border border-white/30 hover:border-white/60 hover:bg-white/5",
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold
    tracking-tight transition-colors duration-300
    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary
    ${sizeClasses[size]}
    ${variants[variant]}
    ${className}
  `.trim();

  if (href) {
    return (
      <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }} className="inline-flex">
        <Link href={href} className={baseClasses} onClick={onClick}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ y: 0 }}
      type="button"
      onClick={onClick}
      className={baseClasses}
    >
      {children}
    </motion.button>
  );
}
