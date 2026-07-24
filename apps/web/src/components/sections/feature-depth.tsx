"use client";

import { useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { CardStack, CardStackItem } from "@/components/ui/card-stack";

const BLOCKS: CardStackItem[] = [
  {
    id: 1,
    title: "Blind Conflict Screening",
    description: "Clears conflicts automatically before consultation. Adverse parties screened, client identity masked, firms clear COI blind.",
    videoSrc: "/bg-video.mp4",
  },
  {
    id: 2,
    title: "Merit-First Listings",
    description: "Browse and select counsel purely on merit metrics — practice, forum, ratings, fee tier — without branding bias.",
    videoSrc: "/bg-video.mp4",
  },
  {
    id: 3,
    title: "Escrow-Protected VoIP",
    description: "Book timed anonymous audio/video sessions. Contact details remain platform-held until consult ends and you release them.",
    videoSrc: "/bg-video.mp4",
  },
  {
    id: 4,
    title: "Cross-Border Matchmaking",
    description: "One aggregator corridor connecting UAE mainland, ADGM, DIFC, GCC corridors, and the India–GCC bridge.",
    videoSrc: "/bg-video.mp4",
  },
  {
    id: 5,
    title: "Milestone Escrow Protection",
    description: "Secure escrow payment routing where funds are safely held and only released upon milestone verification and client approval.",
    videoSrc: "/bg-video.mp4",
  },
  {
    id: 6,
    title: "Vetted Counsel Network",
    description: "Access a vetted network of premium firm practices, solo practitioners, and specialized arbitrators aligned to your forum.",
    videoSrc: "/bg-video.mp4",
  },
];

export default function FeatureDepth() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cardWidth = Math.min(760, windowWidth * 0.9);
  const cardHeight = Math.min(420, cardWidth * 0.6);

  return (
    <section id="why-features" ref={ref} className="section-padding light-section overflow-hidden">
      <div className="container-wide">
        <div className="max-w-2xl mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden />
            Why it matters
          </div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] text-ink tracking-tight leading-[1.1]">
            Core protections, global reach
          </h2>
          <p className="mt-3 text-gray-600 leading-relaxed text-base md:text-lg">
            Short explainers for COI, anonymous directory, confidential meetings,
            and Barristrly’s corridor footprint.
          </p>
        </div>

        {/* Integrated Premium 3D Card Stack */}
        <div className="mx-auto w-full max-w-4xl flex justify-center mt-6">
          {isInView && (
            <CardStack
              items={BLOCKS}
              initialIndex={0}
              autoAdvance
              intervalMs={3200}
              pauseOnHover
              showDots={false}
              maxVisible={5}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
            />
          )}
        </div>
      </div>
    </section>
  );
}
