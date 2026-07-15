"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const cases = [
  {
    title: "Scaling cross-border disputes with conflict-safe intake",
    tag: "Litigation",
    stat: "14 hours saved per brief",
  },
  {
    title: "Corporate teams cut contract intake vetting latency by 80%",
    tag: "In-House",
    stat: "<12 min routing",
  },
  {
    title: "UK–UAE corridor routing streamlines compliance reviews",
    tag: "Mid-Market",
    stat: "100% COI cleared",
  },
  {
    title: "Firms adopt dual-consent matching for privacy-first practice",
    tag: "Law Firms",
    stat: "5+ corridors live",
  },
];

export default function CaseStudies() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="cases" ref={ref} className="section-padding soft-section">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14">
          <h2 className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] text-ink leading-tight tracking-tight">
            Real impact for real clients
          </h2>
          <a
            href="#cta"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover"
          >
            See more videos <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-black/10 border border-black/10">
          {cases.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              className="bg-ivory p-8 md:p-10 min-h-[260px] flex flex-col group hover:bg-white transition-colors"
            >
              <span className="text-xs font-semibold tracking-[0.14em] uppercase text-primary mb-8">
                {item.tag}
              </span>
              <h3 className="font-serif text-xl md:text-2xl text-ink leading-snug tracking-tight mb-auto group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <div className="border-t border-black/10 pt-4 mt-8 flex justify-between items-center text-xs">
                <span className="text-text-muted">Outcome</span>
                <span className="font-semibold text-ink">{item.stat}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
