"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { LEGAL_SERVICES } from "@/lib/marketing/seo-slugs";

export default function ServicesGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding light-section">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12 md:mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-4">
            7 dedicated practice pillars
          </p>
          <h2 className="font-serif text-[clamp(1.85rem,3.5vw,3rem)] text-ink tracking-tight leading-[1.08]">
            Every matter, matched to the right forum
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {LEGAL_SERVICES.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
            >
              <Link
                href={`/legal-services/${service.slug}`}
                className="group block h-full rounded-2xl border border-gray-200 bg-ivory p-6 transition-all duration-300 hover:border-primary/35 hover:shadow-[0_16px_36px_-20px_rgba(232,93,4,0.3)]"
              >
                <h3 className="font-serif text-lg text-ink tracking-tight group-hover:text-primary transition-colors">
                  {service.label}
                </h3>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {service.forum}
                </p>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {service.summary}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
