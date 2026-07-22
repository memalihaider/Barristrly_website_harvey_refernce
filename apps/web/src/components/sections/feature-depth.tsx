"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const BLOCKS = [
  {
    title: "Conflict of interest",
    body: "Every engagement runs automated COI before consultation — adverse parties screened, client identity still masked, firms affirm clearance blind.",
  },
  {
    title: "Anonymous legal directory",
    body: "Select on merit metrics — practice, forum, ratings, fee tier — without geographic or firm-branding bias until mutual unlock.",
  },
  {
    title: "Anonymous meeting scheduling",
    body: "Timed VoIP sessions with escrow-backed fees. Contact details stay platform-held until the consult ends and you authorize release.",
  },
  {
    title: "Global presence",
    body: "UAE mainland and free zones, GCC corridors, India–GCC bridge, and connected markets — one aggregator for cross-border legal matchmaking.",
  },
];

export default function FeatureDepth() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="why-features" ref={ref} className="section-padding light-section">
      <div className="container-wide">
        <div className="max-w-2xl mb-12 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-3">
            Why it matters
          </p>
          <h2 className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] text-ink tracking-tight">
            Core protections, global reach
          </h2>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Short explainers for COI, anonymous directory, confidential meetings,
            and Barristrly’s corridor footprint.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {BLOCKS.map((block, i) => (
            <motion.article
              key={block.title}
              initial={{ opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-gray-200 overflow-hidden bg-[#fafaf9]"
            >
              <div className="relative aspect-[16/9] bg-black overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover opacity-80"
                  aria-hidden
                >
                  <source src="/bg-video.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <p className="absolute bottom-4 left-4 right-4 text-sm font-semibold text-white">
                  {block.title}
                </p>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 leading-relaxed">{block.body}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
