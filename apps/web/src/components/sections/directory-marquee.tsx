"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import GradientButton from "@/components/ui/gradient-button";

const LISTINGS = [
  {
    id: "DXB-9812",
    practice: "Employment · MoHRE claims",
    forum: "Dubai Mainland",
    tier: "Tier-2",
    rating: "4.9",
    avatar: "/testimonials/amira.jpg",
  },
  {
    id: "AUH-4401",
    practice: "Corporate · Free zone setup",
    forum: "ADGM",
    tier: "Tier-1",
    rating: "4.8",
    avatar: "/testimonials/james.jpg",
  },
  {
    id: "DIFC-2208",
    practice: "Arbitration · DIAC",
    forum: "DIFC Courts",
    tier: "Tier-1",
    rating: "5.0",
    avatar: "/testimonials/neha.jpg",
  },
  {
    id: "SHJ-1180",
    practice: "Real estate · RDC",
    forum: "Sharjah / Dubai RDC",
    tier: "Tier-3",
    rating: "4.7",
    avatar: "/testimonials/omar.jpg",
  },
  {
    id: "GCC-7720",
    practice: "Immigration · Golden Visa",
    forum: "GDRFA / ICP",
    tier: "Tier-2",
    rating: "4.8",
    avatar: "/testimonials/priya.jpg",
  },
  {
    id: "LON-3314",
    practice: "Cross-border · Commercial",
    forum: "London corridor",
    tier: "Tier-1",
    rating: "4.9",
    avatar: "/testimonials/james.jpg",
  },
  {
    id: "PKR-9055",
    practice: "Banking · Debt recovery",
    forum: "UAE / GCC",
    tier: "Tier-2",
    rating: "4.6",
    avatar: "/testimonials/omar.jpg",
  },
  {
    id: "NOT-4412",
    practice: "Notary · Attestation",
    forum: "UAE · International",
    tier: "Tier-3",
    rating: "4.7",
    avatar: "/testimonials/amira.jpg",
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
      className="w-[340px] sm:w-[380px] shrink-0 rounded-2xl border border-[#e5e3dc] bg-[#faf9f6]/95 overflow-hidden shadow-[0_12px_40px_-24px_rgba(15,14,13,0.15)] hover:shadow-[0_24px_60px_rgba(232,93,4,0.06)] hover:border-primary/20 transition-all duration-300 flex flex-col select-none"
    >
      {/* Large Blurred Avatar Header (Pics on Top) */}
      <div className="relative w-full h-[210px] sm:h-[240px] bg-[#e5e3dc] border-b border-[#e5e3dc] overflow-hidden flex items-center justify-center shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.avatar}
          alt="Masked Profile"
          className="absolute inset-0 w-full h-full object-cover filter blur-[15px] scale-110"
        />
        {/* Large security shield/lock circle overlay */}
        <div className="absolute inset-0 bg-black/15 flex flex-col items-center justify-center gap-2">
          <div className="h-11 w-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-md">
            <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-[9px] uppercase font-bold tracking-widest text-white/95 bg-black/30 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
            Encrypted Profile
          </span>
        </div>
      </div>

      {/* Card Details (Below) */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
              COUNSEL #{item.id}
            </p>
            <div className="flex items-center gap-0.5 text-[11px] font-semibold text-ink/60 bg-[#e5e3dc]/40 px-2 py-0.5 rounded">
              <span className="text-primary text-xs">★</span>
              <span>{item.rating}</span>
            </div>
          </div>
          
          {/* Eyebrow badge to emphasize anonymous directory */}
          <div className="mt-2 flex items-center">
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Anonymous Directory Profile
            </span>
          </div>
          
          <h3 className="mt-4 text-lg font-bold text-ink tracking-tight leading-snug">
            {item.practice}
          </h3>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200/50 flex flex-wrap gap-1.5 text-[10px] font-medium text-ink/75">
          <span className="rounded-md bg-white border border-gray-200/50 px-2.5 py-0.5 whitespace-nowrap">
            {item.forum}
          </span>
          <span className="rounded-md bg-white border border-gray-200/50 px-2.5 py-0.5 whitespace-nowrap">
            {item.tier}
          </span>
          <span className="rounded-md bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 whitespace-nowrap font-bold">
            Anonymity Secured
          </span>
        </div>
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
      <div className="container-wide mb-12 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-3">
            Browse providers like a marketplace
          </p>
          <h2 className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] text-ink tracking-tight">
            Anonymous Legal Directory
          </h2>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Product-style listings with practice tags, forums, and fee tiers —
            firm names and personal brands stay hidden until match unlock.
          </p>
        </div>
        <GradientButton
          href="/find-lawyers"
          size="sm"
          variant="primary"
          className="shrink-0 font-semibold"
        >
          Open Directory
        </GradientButton>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        className="relative"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-24 bg-gradient-to-r from-[#f5f3ef] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-24 bg-gradient-to-l from-[#f5f3ef] to-transparent" />
        <div
          className="flex w-max gap-6 px-6"
          style={{ animation: "ticker 45s linear infinite" }}
        >
          {row.map((item, i) => (
            <ListingCard key={`${item.id}-${i}`} item={item} index={i} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
