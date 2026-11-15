"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { SERVICE_CATALOG } from "@/lib/marketing/service-catalog";

export default function ServicesGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#f7f5f1] text-ink"
      aria-labelledby="services-list-heading"
    >
      <div className="container-wide py-20 md:py-28 lg:py-32">
        <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)_auto] gap-10 lg:gap-8 items-center">
          {/* Left caption — matches reference “Connect with vetted providers.” */}
          <motion.p
            id="services-list-heading"
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="max-w-[14rem] text-[15px] md:text-base leading-relaxed text-gray-600"
          >
            Connect with vetted providers across our service master catalog.
          </motion.p>

          {/* Large serif service list */}
          <nav aria-label="Services" className="min-w-0">
            <ul className="list-none m-0 p-0 space-y-1 md:space-y-2">
              {SERVICE_CATALOG.map((service, i) => {
                const isActive = active === i;
                return (
                  <motion.li
                    key={service.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(0.05 + i * 0.04, 0.45),
                    }}
                  >
                    <Link
                      href={service.href}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      className={`block font-serif tracking-tight leading-[1.15] transition-colors duration-300 ${
                        isActive
                          ? "text-primary"
                          : "text-ink/35 hover:text-ink/55"
                      }`}
                      style={{
                        fontSize: "clamp(1.65rem, 3.8vw, 3.35rem)",
                      }}
                    >
                      {service.shortName}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* Ghost CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:self-center lg:justify-self-end"
          >
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-semibold text-ink hover:border-primary/40 hover:text-primary transition-colors"
            >
              Explore Platform
            </Link>
          </motion.div>
        </div>

        {/* Active service detail strip */}
        <motion.div
          key={SERVICE_CATALOG[active]?.id}
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35 }}
          className="mt-12 md:mt-16 max-w-2xl border-t border-black/10 pt-6"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            Service {String(SERVICE_CATALOG[active].number).padStart(2, "0")}
            {SERVICE_CATALOG[active].isNew ? " · New" : ""}
          </p>
          <p className="mt-2 text-sm md:text-base text-gray-600 leading-relaxed">
            {SERVICE_CATALOG[active].tagline}
          </p>
          <p className="mt-2 text-sm font-semibold text-ink">
            {SERVICE_CATALOG[active].tiers[0]?.priceLabel ??
              SERVICE_CATALOG[active].pricingModel}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
