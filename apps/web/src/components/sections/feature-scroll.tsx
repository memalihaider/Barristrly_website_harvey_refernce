"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import Link from "next/link";

const features = [
  "Anonymous Directory",
  "Automated COI",
  "Confidential Meetings",
  "Provider Matching",
  "Milestone Escrow",
  "Expert Witnesses",
  "Global Corridor",
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          <div className="lg:col-span-3 space-y-4">
            <h2
              id="capabilities-heading"
              className="font-serif text-[clamp(1.35rem,2.2vw,1.85rem)] text-ink leading-snug tracking-tight max-w-[16rem]"
            >
              The top legal teams use Barristrly for
            </h2>
          </div>

          <ul className="lg:col-span-6 flex flex-col gap-1.5 md:gap-2 list-none p-0 m-0">
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

          <div className="lg:col-span-3 lg:flex lg:justify-end lg:self-center">
            <Link
              href="/marketplace"
              className="inline-flex items-center justify-center rounded-sm border border-ink/25 px-5 py-2.5 text-sm font-medium text-ink hover:border-primary hover:text-primary transition-colors"
            >
              Explore Platform
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
