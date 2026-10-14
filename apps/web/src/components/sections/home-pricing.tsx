"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import GradientButton from "@/components/ui/gradient-button";
import { Check } from "lucide-react";

const OPTIONS = [
  {
    eyebrow: "Option 1",
    title: "Free Lawyer Sourcing & Matching",
    price: "FREE",
    priceDetail: "0 AED",
    need: "Clients seeking fee comparisons or hiring representation for lawsuits/transactions.",
    deliverables: [
      "Up to 3 curated fee proposals from vetted advocates",
      "24-hour SLA response",
      "Zero platform charge for clients",
    ],
    ctaLabel: "Submit Brief — Get Matched",
    ctaHref: "/ai/intake",
    variant: "outline" as const,
  },
  {
    eyebrow: "Option 2",
    title: "Dedicated Legal Strategy Session",
    price: "AED 1,000",
    priceDetail: "+ 5% VAT (AED 1,050 total)",
    need: "Clients requiring immediate, expert advice or document strategy before taking action.",
    deliverables: [
      "Private 45–60 min 1-on-1 meeting (video/in-person)",
      "Pre-meeting document audit",
      "Post-meeting summary roadmap",
    ],
    ctaLabel: "Book Consultation Now",
    ctaHref: "/pricing",
    variant: "primary" as const,
  },
  {
    eyebrow: "Option 3",
    title: "Legal Retainers",
    price: "AED 6,999",
    priceDetail: "/ month",
    need: "Obtain legal drafting and consultation for a fixed price.",
    deliverables: [
      "Includes 10 hours of legal expertise",
      "Drafting of agreements",
      "Contact us to know more",
    ],
    ctaLabel: "Enquire About Retainers",
    ctaHref: "/pricing#retainers",
    variant: "outline" as const,
  },
];

export default function HomePricing() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" ref={ref} className="section-padding soft-section">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12 md:mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-4">
            Three ways to get started
          </p>
          <h2 className="font-serif text-[clamp(1.85rem,3.5vw,3rem)] text-ink tracking-tight leading-[1.08]">
            Choose free matching, a dedicated consultation, or a retainer
          </h2>
          <p className="mt-5 text-base md:text-lg text-gray-600 leading-relaxed">
            Submit a brief and get matched with vetted UAE-licensed providers
            at no cost, book a fixed-fee strategy session with a senior
            practitioner, or secure ongoing support with a monthly retainer.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {OPTIONS.map((option, i) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
              className="rounded-[1.5rem] border border-[#e5e3dc] bg-[#faf9f6] p-6 md:p-8 flex flex-col"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary mb-3">
                {option.eyebrow}
              </p>
              <h3 className="font-serif text-xl md:text-2xl text-ink tracking-tight">
                {option.title}
              </h3>
              <div className="mt-4">
                <p className="font-serif text-3xl md:text-4xl text-primary tracking-tight">
                  {option.price}
                </p>
                <p className="text-xs text-gray-500 mt-1">{option.priceDetail}</p>
              </div>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                {option.need}
              </p>
              <ul className="mt-5 space-y-2.5 list-none p-0 m-0">
                {option.deliverables.map((d) => (
                  <li
                    key={d}
                    className="flex items-start gap-2.5 text-sm text-gray-700"
                  >
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" aria-hidden />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <GradientButton href={option.ctaHref} size="md" variant={option.variant}>
                  {option.ctaLabel}
                </GradientButton>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
