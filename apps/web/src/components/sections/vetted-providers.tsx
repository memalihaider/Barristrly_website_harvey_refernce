"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Building2,
  Briefcase,
  UserCheck,
  Landmark,
  Scale,
  Mic2,
  Headphones,
  Stamp,
  FileStack,
  Languages,
} from "lucide-react";

const PROVIDERS = [
  {
    icon: Building2,
    title: "Qualified lawyers with law firms",
    detail: "Vetted counsel across firm practices and corridors.",
  },
  {
    icon: Briefcase,
    title: "Legal consultants",
    detail: "Advisory specialists for structuring and compliance.",
  },
  {
    icon: UserCheck,
    title: "Independent legal practitioners",
    detail: "Solo and boutique counsel matched to your matter.",
  },
  {
    icon: Landmark,
    title: "Industry and court experts",
    detail: "Subject-matter experts aligned to your forum.",
  },
  {
    icon: Scale,
    title: "Qualified arbitrators",
    detail: "Certified arbitrators for domestic and cross-border disputes.",
  },
  {
    icon: Mic2,
    title: "Expert witnesses",
    detail: "Specialists for arbitration and litigation proceedings.",
  },
  {
    icon: Headphones,
    title: "Arbitration hearing support",
    detail:
      "Hearing facilities · court reporters & real-time stenographers · interpreters & translators · e-discovery & document management.",
  },
  {
    icon: Stamp,
    title: "Legal notaries",
    detail: "Local and international notarisation and attestation.",
  },
  {
    icon: FileStack,
    title: "Corporate secretarial & PRO",
    detail: "Company secretarial, PRO, and regulatory support services.",
  },
  {
    icon: Languages,
    title: "Legal translators",
    detail: "Certified translation for filings, contracts, and evidence.",
  },
];

export default function VettedProviders() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="providers" ref={ref} className="section-padding soft-section">
      <div className="container-wide">
        <div className="max-w-2xl mb-12 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-3">
            Marketplace
          </p>
          <h2 className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] text-ink tracking-tight">
            Clients can connect with vetted providers
          </h2>
          <p className="mt-3 text-gray-600 leading-relaxed">
            One aggregator directory spanning counsel, experts, arbitrators, and
            legal support services — matched after conflict screening.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {PROVIDERS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="border-t border-gray-200 pt-5"
              >
                <Icon className="h-5 w-5 text-primary mb-3" strokeWidth={1.75} aria-hidden />
                <h3 className="font-semibold text-ink tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {item.detail}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
