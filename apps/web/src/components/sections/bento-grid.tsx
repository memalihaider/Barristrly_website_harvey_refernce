"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, ShieldCheck, Lock, Wallet, Users, Globe } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Natural Language AI Intake",
    description:
      "Submit case facts in conversation. Barristrly extracts jurisdiction, practice area, urgency, and budget constraints.",
  },
  {
    icon: ShieldCheck,
    title: "Two-Gate Conflict Clearing",
    description:
      "Collect parties first with narrative locked. Firms get a blind lead, affirm no conflict, then unlock identity only after payment.",
  },
  {
    icon: Lock,
    title: "Ephemeral Consultation Sandboxes",
    description:
      "Encrypted video with silhouette masking and optional real-time voice morphing.",
  },
  {
    icon: Wallet,
    title: "Milestone Escrow Accounts",
    description:
      "Funds stay in Stripe-protected escrow until dual confirmation unlocks release.",
  },
  {
    icon: Users,
    title: "Dual Consent Gateway",
    description:
      "Client identity stays masked until firm COI affirmation and payment success trigger unblind.",
  },
  {
    icon: Globe,
    title: "Global Corridor Routing",
    description:
      "Intelligent matching across UAE, GCC, Pakistan, and London — tuned to local rules.",
  },
];

export default function BentoGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="platform-bento"
      ref={ref}
      className="section-padding light-section border-t border-black/5"
    >
      <div className="container-wide">
        <div className="max-w-2xl mb-14 md:mb-20">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-primary mb-4">
            Platform
          </p>
          <h2 className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] text-text-tertiary leading-tight tracking-tight mb-4">
            Built for modern legal workflows
          </h2>
          <p className="text-text-on-light-muted text-base leading-relaxed">
            Modular services that protect identity, clarify intake, and streamline
            fee transactions — without dashboard clutter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className="group"
              >
                <div className="mb-4 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="text-base font-semibold text-text-tertiary mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-on-light-muted leading-relaxed">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
