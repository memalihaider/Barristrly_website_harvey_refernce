"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  authorName: string;
  authorTitle: string;
  company: string;
  index?: number;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Deterministic gradient based on name
function getAvatarGradient(name: string): string {
  const gradients = [
    "from-orange-400 to-amber-500",
    "from-orange-500 to-rose-400",
    "from-amber-400 to-orange-500",
    "from-orange-400 to-yellow-500",
    "from-rose-400 to-orange-400",
    "from-amber-500 to-orange-600",
  ];
  const index = name.length % gradients.length;
  return gradients[index];
}

export default function TestimonialCard({
  quote,
  authorName,
  authorTitle,
  company,
  index = 0,
}: TestimonialCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const initials = getInitials(authorName);
  const gradient = getAvatarGradient(authorName);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.55,
        ease: "easeOut",
        delay: index * 0.1,
      }}
      className="group relative flex flex-col justify-between rounded-2xl border border-orange-100/50 bg-gradient-to-b from-[#FFFBF5] to-[#FFF8F0] p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-orange-100/30 sm:p-8"
    >
      {/* Quote icon */}
      <div className="mb-4">
        <Quote className="h-8 w-8 text-orange-300/60" />
      </div>

      {/* Quote text */}
      <blockquote className="mb-6 flex-1">
        <p className="font-serif text-base leading-relaxed text-gray-700 italic md:text-lg">
          &ldquo;{quote}&rdquo;
        </p>
      </blockquote>

      {/* Author info */}
      <div className="flex items-center gap-3 border-t border-orange-100/60 pt-5">
        {/* Avatar */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-sm font-bold text-white shadow-sm`}
        >
          {initials}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            {authorName}
          </p>
          <p className="truncate text-xs text-gray-500">
            {authorTitle}, {company}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
