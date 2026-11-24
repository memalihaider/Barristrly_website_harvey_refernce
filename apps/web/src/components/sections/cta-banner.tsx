"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Scale, Briefcase, Users } from "lucide-react";

const RESOURCES = [
  {
    href: "/ai/intake",
    label: "Free lawyer match",
    detail: "Submit a brief — up to three vetted lawyers within 48 hours",
    icon: Briefcase,
  },
  {
    href: "/pricing",
    label: "Pricing",
    detail: "Clear AED prices for drafting, company setup, Wills and retainers",
    icon: Scale,
  },
  {
    href: "/resources",
    label: "UAE legal guides",
    detail: "Practical articles on contracts, company setup, Wills and more",
    icon: BookOpen,
  },
  {
    href: "/practice",
    label: "For lawyers",
    detail: "Join the network and receive pre-screened client requests",
    icon: Users,
  },
  {
    href: "/about",
    label: "About Barristrly",
    detail: "Who we are and why we built a better way to hire lawyers",
    icon: BookOpen,
  },
  {
    href: "/request-demo",
    label: "Contact us",
    detail: "Tell us your situation — we reply within 48 hours",
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
              Get started
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] text-ink leading-[1.1] tracking-tight">
              Get legal help in the UAE today
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed max-w-lg text-base md:text-lg">
              Start with a free brief and get matched with vetted lawyers, check
              our AED pricing, or send a quick message — we will point you to the
              simplest, most cost-effective option.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            <Link
              href="/ai/intake"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary hover:bg-primary-hover transition-colors"
            >
              Get a free lawyer match
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
