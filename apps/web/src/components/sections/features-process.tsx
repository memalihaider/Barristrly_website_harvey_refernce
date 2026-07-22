"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, CalendarDays, EyeOff, Scale } from "lucide-react";

const STEPS = [
  {
    icon: Scale,
    title: "Describe & classify",
    body: "BARRI maps your matter to practice area, jurisdiction, and budget.",
  },
  {
    icon: EyeOff,
    title: "Anonymous directory",
    body: "Browse masked provider cards on merit — firm brands stay hidden until unlock.",
  },
  {
    icon: ShieldCheck,
    title: "Conflict clearance",
    body: "Automated COI runs before consult; firms affirm adverse parties blind.",
  },
  {
    icon: CalendarDays,
    title: "Schedule & meet",
    body: "Fund escrow, book a timed anonymous VoIP session, then unmask on consent.",
  },
];

export default function FeaturesProcess() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" ref={ref} className="section-padding light-section">
      <div className="container-wide">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-3">
                Features
              </p>
              <h2 className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] text-ink tracking-tight">
                Step-by-step marketplace process
              </h2>
              <p className="mt-3 text-gray-600 leading-relaxed">
                From intake to anonymous consult — built for aggregators, not
                in-house LegalOS workspaces.
              </p>
            </div>
            <ul className="space-y-6 list-none p-0 m-0">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.li
                    key={step.title}
                    initial={{ opacity: 0, x: -12 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: i * 0.06 }}
                    className="flex gap-4"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <div>
                      <p className="font-semibold text-ink tracking-tight">
                        {i + 1}. {step.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="lg:col-span-7 media-frame relative overflow-hidden min-h-[280px] md:min-h-[380px]"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
              aria-label="Barristrly features and process"
            >
              <source src="/bg-video.mp4" type="video/mp4" />
            </video>
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent"
              aria-hidden
            />
            <div className="relative z-10 flex h-full min-h-[280px] md:min-h-[380px] items-end p-8 md:p-10">
              <p className="text-white text-sm md:text-base max-w-md leading-relaxed">
                Feature walkthrough — matching, COI, anonymous directory, and
                meeting scheduling (placeholder video until branded asset lands).
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
