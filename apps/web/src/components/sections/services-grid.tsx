"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { SERVICE_CATALOG } from "@/lib/marketing/service-catalog";

const COLOR_MUTED = "rgba(15, 14, 13, 0.32)";
const COLOR_ORANGE = "#E85D04";

export default function ServicesGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#f7f5f1] text-ink"
      aria-labelledby="services-list-heading"
    >
      <div className="container-wide py-20 md:py-28 lg:py-32">
        <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)_auto] gap-10 lg:gap-8 items-center">
          <motion.h2
            id="services-list-heading"
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="max-w-[16rem] font-normal text-[15px] md:text-base leading-relaxed text-gray-600"
          >
            Legal services across Dubai &amp; the UAE. Clear prices. Vetted specialists.
          </motion.h2>

          <nav aria-label="Services" className="min-w-0">
            <ul className="list-none m-0 p-0 space-y-1 md:space-y-2">
              {SERVICE_CATALOG.map((service, i) => {
                const isHighlighted = hovered === i || (hovered === null && active === i);
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
                      onMouseEnter={() => {
                        setHovered(i);
                        setActive(i);
                      }}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => {
                        setHovered(i);
                        setActive(i);
                      }}
                      onBlur={() => setHovered(null)}
                      className="block font-serif tracking-tight leading-[1.15]"
                      style={{
                        fontSize: "clamp(1.65rem, 3.8vw, 3.35rem)",
                        color: isHighlighted ? COLOR_ORANGE : COLOR_MUTED,
                        transition: "color 200ms ease",
                      }}
                    >
                      {service.shortName}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:self-center lg:justify-self-end"
          >
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-semibold text-ink hover:border-primary/40 transition-colors"
              style={{ transition: "color 200ms ease, border-color 200ms ease" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = COLOR_ORANGE;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "";
              }}
            >
              Explore Services
            </Link>
          </motion.div>
        </div>

        <motion.div
          key={SERVICE_CATALOG[active]?.id}
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35 }}
          className="mt-12 md:mt-16 max-w-2xl border-t border-black/10 pt-6"
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: COLOR_ORANGE }}
          >
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
