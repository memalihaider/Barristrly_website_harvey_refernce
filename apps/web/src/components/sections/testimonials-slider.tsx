"use client";

import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "We stopped paying for sequential mismatched intros. Barristrly’s anonymous directory and COI clear before consult changed how our GC office hires counsel.",
    image: "/testimonials/amira.jpg",
    name: "Amira Al-Hassan",
    role: "General Counsel, Gulf Holdings Group",
  },
  {
    text: "As in-house counsel, the masked VoIP consult and escrow-backed session fees give us control. Identity only releases when we say so.",
    image: "/testimonials/james.jpg",
    name: "James Okonkwo",
    role: "Head of Legal, Regional Fintech",
  },
  {
    text: "For arbitration support we needed stenographers and interpreters fast — the aggregator panel matched us without exposing our matter narrative early.",
    image: "/testimonials/priya.jpg",
    name: "Priya Mehta",
    role: "Disputes Lead, Cross-Border Disputes Desk",
  },
  {
    text: "Zero listing fees and a 12-hour conflict SLA keep our firm responsive. Pre-vetted briefs beat raw marketplace noise.",
    image: "/testimonials/omar.jpg",
    name: "Omar Farouk",
    role: "Managing Partner, Farouk & Associates",
  },
  {
    text: "Corporate secretarial and PRO services alongside counsel in one directory — Barristrly is the bridge we needed between India and the GCC.",
    image: "/testimonials/neha.jpg",
    name: "Neha Kapoor",
    role: "Founder, Kapoor Ventures",
  },
  {
    text: "Managing corporate regulatory compliance across jurisdictions is seamless now. The document notarisation support is incredibly fast.",
    image: "/testimonials/james.jpg",
    name: "Marcus Vance",
    role: "Director, Vance Global Legal",
  },
  {
    text: "The milestone-escrow setup took the anxiety out of retainer payments. Funds are held securely until clear delivery is verified.",
    image: "/testimonials/amira.jpg",
    name: "Lina Naser",
    role: "VP Legal, Naser Group Middle East",
  },
  {
    text: "Vetted Solo practitioners matched by BARRI's algorithms were key in resolving our regional compliance dispute in under 48 hours.",
    image: "/testimonials/omar.jpg",
    name: "Rohan Shrivastava",
    role: "Founder, Shrivastava Compliance Advisors",
  },
  {
    text: "Conflict clearance runs blind before consultations start. This automated safeguard is a major shift in digital legal operations.",
    image: "/testimonials/priya.jpg",
    name: "Sophia Dubois",
    role: "General Counsel, Dubois Logistics Corp",
  },
];

export default function TestimonialsSlider() {
  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  return (
    <section id="testimonials" className="section-padding bg-[#faf9f6]/95 relative overflow-hidden border-t border-[#e5e3dc]">
      <div className="container-wide z-10 relative">
        
        {/* Header Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Client Testimonials
          </div>

          <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] text-ink tracking-tight leading-[1.1] text-center">
            What our users say
          </h2>
          <p className="text-center mt-4 text-gray-600 leading-relaxed text-base max-w-md">
            See what general counsels, founders, and managing partners say about Barristrly.
          </p>
        </motion.div>

        {/* Dynamic Fading Sliding Columns Carousel */}
        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[640px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={16} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={20} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={18} />
        </div>
      </div>
    </section>
  );
}
