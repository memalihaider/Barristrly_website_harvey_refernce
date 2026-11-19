"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Scale, Briefcase, Users } from "lucide-react";

const RESOURCES = [
  {
    href: "/services",
    label: "Service catalog",
    detail: "Ten services with clear AED pricing",
    icon: Briefcase,
  },
  {
    href: "/pricing",
    label: "Pricing",
    detail: "Consultations, retainers, drafting, and more",
    icon: Scale,
  },
  {
    href: "/resources",
    label: "Resources",
    detail: "Articles and practice-area guides",
    icon: BookOpen,
  },
  {
    href: "/practice",
    label: "For lawyers",
    detail: "Join the provider network",
    icon: Users,
  },
  {
    href: "/about",
    label: "About",
    detail: "Meet the founder and our mission",
    icon: BookOpen,
  },
  {
    href: "/request-demo",
    label: "Contact",
    detail: "Tell us what service you need",
    icon: ArrowUpRight,
  },
];

export default function CtaBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="resources-hub" ref={ref} className="section-padding relative">
      <div className="container-wide relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-4">
              Next steps
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] text-ink leading-[1.1] tracking-tight">
              Choose a service, check pricing, or ask us
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed max-w-lg text-base md:text-lg">
              Start with a free match, book a consultation, or send a short
              message — we will guide you to the simplest option.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary hover:bg-primary-hover transition-colors"
            >
              Browse services
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 border-t border-[#e5e3dc]">
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
                  className="group flex items-start gap-4 border-b border-[#e5e3dc] py-6 hover:border-primary/30 transition-colors"
                >
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-serif text-xl md:text-2xl text-ink tracking-tight group-hover:text-primary transition-colors">
                        {item.label}
                      </span>
                      <ArrowUpRight
                        className="h-4 w-4 text-gray-400 group-hover:text-primary shrink-0"
                        aria-hidden
                      />
                    </span>
                    <span className="mt-1.5 block text-sm text-gray-600 leading-relaxed">
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
