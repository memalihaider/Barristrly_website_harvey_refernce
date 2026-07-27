"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Mic2, Newspaper, BookOpen, Scale, Globe2 } from "lucide-react";

const RESOURCES = [
  {
    href: "/resources",
    label: "Resources Hub",
    detail: "Guides, product updates, and learning paths",
    icon: BookOpen,
  },
  {
    href: "/resources#newsletters",
    label: "Newsletters",
    detail: "Legal corridor briefings and platform updates",
    icon: Newspaper,
  },
  {
    href: "/resources#articles",
    label: "Articles & Blogs",
    detail: "Insights on matching, COI, and marketplace law",
    icon: BookOpen,
  },
  {
    href: "/resources#uae-laws",
    label: "UAE Laws",
    detail: "Mainland, DIFC, ADGM, and federal references",
    icon: Scale,
  },
  {
    href: "/resources#international-laws",
    label: "Laws of other countries",
    detail: "GCC, India, UK, and cross-border corridors",
    icon: Globe2,
  },
];

export default function CtaBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="resources-hub"
      ref={ref}
      className="section-padding dark-section relative overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 40%, rgba(232,93,4,0.16), transparent 50%), radial-gradient(ellipse at 90% 80%, rgba(232,93,4,0.08), transparent 45%)",
        }}
        aria-hidden="true"
      />

      <div className="container-wide relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-4">
              Resources
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] text-white leading-[1.1] tracking-tight">
              Explore the Barristrly resource hub
            </h2>
            <p className="mt-4 text-white/65 leading-relaxed max-w-lg">
              Newsletters, articles, UAE and international law references — plus
              media and podcasts with the founder.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary hover:bg-primary-hover transition-colors"
            >
              Open Resources Hub
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </motion.div>
        </div>

        {/* Featured: Media & Podcasts — large visible type */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mb-10 md:mb-14"
        >
          <Link
            href="/resources#media-podcasts"
            className="group block rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-8 md:p-10 lg:p-12 hover:border-primary/40 hover:bg-white/[0.06] transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="flex items-start gap-5 md:gap-6">
                <span className="flex h-14 w-14 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-[0_12px_40px_rgba(232,93,4,0.35)]">
                  <Mic2 className="h-7 w-7 md:h-8 md:w-8" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-3">
                    Featured
                  </p>
                  <h3 className="font-serif text-[clamp(1.75rem,4vw,3rem)] text-white tracking-tight leading-[1.1] group-hover:text-primary transition-colors">
                    Media &amp; Podcasts with the Founder
                  </h3>
                  <p className="mt-3 text-base md:text-lg text-white/60 leading-relaxed max-w-xl">
                    Watch and listen to Heena Mohammed on legal matchmaking,
                    anonymity, and the India–GCC corridor.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 text-base md:text-lg font-semibold text-primary shrink-0">
                Access media
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Resource links grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 border-t border-white/10">
          {RESOURCES.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href + item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.12 + i * 0.05 }}
              >
                <Link
                  href={item.href}
                  className="group flex items-start gap-4 border-b border-white/10 py-6 hover:border-primary/30 transition-colors"
                >
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <Icon className="h-4.5 w-4.5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-serif text-xl md:text-2xl text-white tracking-tight group-hover:text-primary transition-colors">
                        {item.label}
                      </span>
                      <ArrowUpRight
                        className="h-4 w-4 text-white/35 group-hover:text-primary shrink-0"
                        aria-hidden
                      />
                    </span>
                    <span className="mt-1.5 block text-sm text-white/45 leading-relaxed">
                      {item.detail}
                    </span>
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
