"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  "Case Intake",
  "Conflict Vetting",
  "Anonymous Matching",
  "Deal Management",
  "Milestone Escrow",
  "Encrypted Consults",
  "Identity Routing",
];

export default function FeatureScroll() {
  const [activeIndex, setActiveIndex] = useState(3);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % features.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section
      id="solutions"
      ref={ref}
      className="section-padding soft-section"
      aria-labelledby="capabilities-heading"
    >
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <h2
              id="capabilities-heading"
              className="font-serif text-[clamp(1.5rem,2.5vw,2rem)] text-ink leading-snug tracking-tight"
            >
              The top legal teams use Barristrly for
            </h2>
            <Link
              href="#platform"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              Explore Platform <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ul className="lg:col-span-8 flex flex-col gap-2 md:gap-3 list-none p-0 m-0">
            {features.map((title, index) => {
              const isActive = index === activeIndex;
              return (
                <li key={title}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                    className={`capability-item ${isActive ? "is-active" : ""}`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {title}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
