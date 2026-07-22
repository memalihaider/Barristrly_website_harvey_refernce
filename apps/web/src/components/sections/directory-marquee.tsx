"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const LISTINGS = [
  {
    id: "DXB-9812",
    practice: "Employment · MoHRE claims",
    forum: "Dubai Mainland",
    tier: "Tier-2",
    rating: "4.9",
  },
  {
    id: "AUH-4401",
    practice: "Corporate · Free zone setup",
    forum: "ADGM",
    tier: "Tier-1",
    rating: "4.8",
  },
  {
    id: "DIFC-2208",
    practice: "Arbitration · DIAC",
    forum: "DIFC Courts",
    tier: "Tier-1",
    rating: "5.0",
  },
  {
    id: "SHJ-1180",
    practice: "Real estate · RDC",
    forum: "Sharjah / Dubai RDC",
    tier: "Tier-3",
    rating: "4.7",
  },
  {
    id: "GCC-7720",
    practice: "Immigration · Golden Visa",
    forum: "GDRFA / ICP",
    tier: "Tier-2",
    rating: "4.8",
  },
  {
    id: "LON-3314",
    practice: "Cross-border · Commercial",
    forum: "London corridor",
    tier: "Tier-1",
    rating: "4.9",
  },
  {
    id: "PKR-9055",
    practice: "Banking · Debt recovery",
    forum: "UAE / GCC",
    tier: "Tier-2",
    rating: "4.6",
  },
  {
    id: "NOT-4412",
    practice: "Notary · Attestation",
    forum: "UAE · International",
    tier: "Tier-3",
    rating: "4.7",
  },
];

function ListingCard({
  item,
  index,
}: {
  item: (typeof LISTINGS)[number];
  index: number;
}) {
  return (
    <article
      key={`${item.id}-${index}`}
      className="w-[260px] sm:w-[280px] shrink-0 rounded-2xl border border-gray-200 bg-[#fafaf9] p-5 shadow-[0_12px_40px_-28px_rgba(15,14,13,0.35)]"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          Client #{item.id}
        </p>
        <span className="text-xs font-semibold text-ink/70">★ {item.rating}</span>
      </div>
      <h3 className="mt-3 font-serif text-lg text-ink tracking-tight leading-snug">
        Masked counsel profile
      </h3>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{item.practice}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium text-ink/70">
        <span className="rounded-full bg-white border border-gray-200 px-2.5 py-1">
          {item.forum}
        </span>
        <span className="rounded-full bg-white border border-gray-200 px-2.5 py-1">
          {item.tier}
        </span>
        <span className="rounded-full bg-white border border-gray-200 px-2.5 py-1">
          Identity masked
        </span>
      </div>
    </article>
  );
}

export default function DirectoryMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const row = [...LISTINGS, ...LISTINGS];

  return (
    <section
      id="directory"
      ref={ref}
      className="section-padding soft-section overflow-hidden"
    >
      <div className="container-wide mb-10 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-3">
            Anonymous legal directory
          </p>
          <h2 className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] text-ink tracking-tight">
            Browse providers like a marketplace
          </h2>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Product-style listings with practice tags, forums, and fee tiers —
            firm names and personal brands stay hidden until match unlock.
          </p>
        </div>
        <Link
          href="/find-lawyers"
          className="text-sm font-semibold text-primary hover:text-primary-hover shrink-0"
        >
          Open directory →
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        className="relative"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-24 bg-gradient-to-r from-[#f5f3ef] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-24 bg-gradient-to-l from-[#f5f3ef] to-transparent" />
        <div
          className="flex w-max gap-5 px-6"
          style={{ animation: "ticker 42s linear infinite" }}
        >
          {row.map((item, i) => (
            <ListingCard key={`${item.id}-${i}`} item={item} index={i} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
