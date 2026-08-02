"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  EyeOff,
  Globe2,
  PhoneCall,
  ShieldCheck,
  Lock,
  Fingerprint,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { CardStack, type CardStackItem } from "@/components/ui/card-stack";

const VIDEO_BLOCKS: CardStackItem[] = [
  {
    id: 1,
    title: "Blind Conflict Screening",
    description:
      "Clears conflicts automatically before consultation. Adverse parties screened, client identity masked, firms clear COI blind.",
    tag: "COI",
    videoSrc: "/bg-video.mp4",
  },
  {
    id: 2,
    title: "Merit-First Listings",
    description:
      "Browse and select counsel purely on merit metrics — practice, forum, ratings, fee tier — without branding bias.",
    tag: "Directory",
    videoSrc: "/bg-video.mp4",
  },
  {
    id: 3,
    title: "Escrow-Protected VoIP",
    description:
      "Book timed anonymous audio/video sessions. Contact details remain platform-held until consult ends and you release them.",
    tag: "Meetings",
    videoSrc: "/bg-video.mp4",
  },
  {
    id: 4,
    title: "Cross-Border Matchmaking",
    description:
      "One aggregator corridor connecting UAE mainland, ADGM, DIFC, GCC corridors, and the India–GCC bridge.",
    tag: "Corridors",
    videoSrc: "/bg-video.mp4",
  },
  {
    id: 5,
    title: "Milestone Escrow Protection",
    description:
      "Secure escrow payment routing where funds are safely held and only released upon milestone verification and client approval.",
    tag: "Escrow",
    videoSrc: "/bg-video.mp4",
  },
  {
    id: 6,
    title: "Vetted Counsel Network",
    description:
      "Access a vetted network of premium firm practices, solo practitioners, and specialized arbitrators aligned to your forum.",
    tag: "Network",
    videoSrc: "/bg-video.mp4",
  },
];

const COI_GATES = [
  {
    icon: Lock,
    title: "Registration gate",
    body: "Clients list themselves and adverse parties first. Case narrative and documents stay locked so privileged facts never enter the pool before COI runs.",
  },
  {
    icon: Fingerprint,
    title: "Blind match & affirmation",
    body: "Firms see Case ID, practice area, claim value, and opposing-party nodes only. Accepting a lead requires mandatory conflict certification before any client reveal.",
  },
  {
    icon: CreditCard,
    title: "Payment-gated unblind",
    body: "Client name and documents unlock only after affirmation and payment succeed. Escrow holds fees until milestones clear.",
  },
  {
    icon: RefreshCw,
    title: "Post-unlock quarantine",
    body: "If a conflict surfaces after reveal, firms can report within 24 hours — access is revoked, credits issued, and the matter rematches to the next clear firm.",
  },
];

const PILLARS = [
  {
    icon: EyeOff,
    title: "Anonymous directory",
    body: "Browse and shortlist counsel on practice fit, forum experience, and fee tier. Firm names, logos, and personal brands stay hidden until mutual invitation unlocks identity.",
  },
  {
    icon: PhoneCall,
    title: "Confidential meetings",
    body: "Book timed anonymous audio/video consults. Contact details stay platform-held until the session ends and you choose to release them — with escrow protecting both sides.",
  },
  {
    icon: Globe2,
    title: "Corridor footprint",
    body: "One aggregator path across UAE mainland, ADGM, DIFC, GCC corridors, and the India–GCC bridge — so cross-border matters match on forum, not marketing reach.",
  },
];

export default function FeatureDepth() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [windowWidth, setWindowWidth] = useState(1200);
  const [activeGate, setActiveGate] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isInView) return;
    const id = window.setInterval(() => {
      setActiveGate((g) => (g + 1) % COI_GATES.length);
    }, 3800);
    return () => window.clearInterval(id);
  }, [isInView]);

  const cardWidth = Math.min(560, windowWidth * 0.72);
  const cardHeight = Math.min(320, cardWidth * 0.58);

  return (
    <section
      id="why-features"
      ref={ref}
      className="relative overflow-hidden light-section py-24 md:py-28 lg:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(165deg, #f7f5f1 0%, #faf9f6 35%, #ffffff 70%, #faf9f6 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 80% 8%, rgba(232,93,4,0.14), transparent 55%), radial-gradient(ellipse 40% 35% at 10% 55%, rgba(232,93,4,0.07), transparent 50%)",
        }}
      />

      <div className="container-wide relative z-10">
        {/* Centered intro */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4">
            Why it matters
          </p>
          <h2 className="font-serif text-[clamp(2.1rem,4vw,3.4rem)] text-ink tracking-tight leading-[1.06]">
            Core protections,{" "}
            <span className="text-primary">global reach</span>
          </h2>
          <p className="mt-5 text-lg md:text-xl text-gray-600 leading-relaxed">
            Short explainers for COI, anonymous directory, confidential
            meetings, and Barristrly’s corridor footprint — swipe the stack
            to explore each layer.
          </p>
        </motion.div>

        {/* Centered, smaller video stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="relative mx-auto mt-10 md:mt-12 w-full max-w-3xl flex justify-center pb-6 md:pb-10"
        >
          {isInView && (
            <CardStack
              items={VIDEO_BLOCKS}
              initialIndex={0}
              autoAdvance
              intervalMs={3200}
              pauseOnHover
              showDots={false}
              maxVisible={5}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
            />
          )}
        </motion.div>

        {/* Innovative COI rail — clear gap from slider */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="mt-16 md:mt-24 lg:mt-28 relative overflow-hidden rounded-[2rem] border border-[#e5e3dc] bg-[#0f0e0d] text-white"
        >
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 55% 70% at 0% 50%, rgba(232,93,4,0.28), transparent 55%), radial-gradient(ellipse 40% 50% at 100% 0%, rgba(232,93,4,0.12), transparent 50%)",
            }}
          />

          <div className="relative z-10 p-7 md:p-10 lg:p-12">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-8 md:mb-10">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/35 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-primary-light mb-4">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                  Conflict of Interest (COI)
                </div>
                <h3 className="font-serif text-[clamp(1.85rem,3.2vw,2.75rem)] tracking-tight leading-[1.08]">
                  Two-gate COI before anyone sees your story
                </h3>
                <p className="mt-4 text-base md:text-lg text-white/70 leading-relaxed">
                  Not a static directory dump — a conflict workflow that keeps
                  privileged narrative locked until firms clear adverse parties
                  blind, then unlocks identity only after affirmation and
                  payment.
                </p>
              </div>
              <Link
                href="/security"
                className="inline-flex items-center justify-center rounded-full bg-[#f5f3ef] px-5 py-2.5 text-sm font-semibold !text-ink hover:bg-[#ebe7df] hover:!text-ink transition-colors"
              >
                How COI security works
              </Link>
            </div>

            {/* Two-gate COI + cryptographic hashing callout */}
            <div className="mb-8 md:mb-10 grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-5 md:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary">
                    <ShieldCheck className="h-5 w-5" aria-hidden />
                  </span>
                  <h4 className="font-serif text-xl md:text-[1.35rem] text-white tracking-tight">
                    Two-gate COI
                  </h4>
                </div>
                <p className="text-sm md:text-base text-white/70 leading-relaxed">
                  Parties first — narrative locked until clearance
                </p>
              </div>
              <div className="rounded-2xl border border-primary/35 bg-primary/15 p-5 md:p-6">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-primary-light mb-2">
                  Cryptographic hashing
                </p>
                <p className="text-sm md:text-base text-white/80 leading-relaxed">
                  Conflict checks are verified and protected with cryptographic
                  hashing — so clearance can’t be spoofed or quietly altered.
                </p>
              </div>
            </div>

            {/* Progress rail */}
            <div className="mb-6 flex gap-2" aria-hidden>
              {COI_GATES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveGate(i)}
                  className="h-1.5 flex-1 rounded-full overflow-hidden bg-white/15"
                  aria-label={`Show COI gate ${i + 1}`}
                >
                  <span
                    className={`block h-full rounded-full bg-primary transition-all duration-500 ${
                      i === activeGate ? "w-full" : i < activeGate ? "w-full opacity-50" : "w-0"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              <div className="lg:col-span-5 flex flex-col justify-center min-h-[180px]">
                {COI_GATES.map((gate, i) => {
                  const Icon = gate.icon;
                  if (i !== activeGate) return null;
                  return (
                    <motion.div
                      key={gate.title}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary mb-5">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-primary-light mb-2">
                        Gate {String(i + 1).padStart(2, "0")} of 04
                      </p>
                      <h4 className="font-serif text-[1.75rem] md:text-[2rem] tracking-tight">
                        {gate.title}
                      </h4>
                      <p className="mt-3 text-base md:text-lg text-white/70 leading-relaxed">
                        {gate.body}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              <ol className="lg:col-span-7 grid sm:grid-cols-2 gap-3 list-none p-0 m-0">
                {COI_GATES.map((gate, i) => {
                  const Icon = gate.icon;
                  const active = i === activeGate;
                  return (
                    <li key={gate.title}>
                      <button
                        type="button"
                        onClick={() => setActiveGate(i)}
                        className={`w-full text-left rounded-2xl border p-4 md:p-5 transition-all duration-300 ${
                          active
                            ? "border-primary/50 bg-primary/15 shadow-[0_0_0_1px_rgba(232,93,4,0.25)]"
                            : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-full ${
                              active
                                ? "bg-primary text-on-primary"
                                : "bg-white/10 text-white/80"
                            }`}
                          >
                            <Icon className="h-4 w-4" aria-hidden />
                          </span>
                          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/45">
                            0{i + 1}
                          </span>
                        </div>
                        <p className="font-serif text-lg text-white tracking-tight">
                          {gate.title}
                        </p>
                        <p className="mt-1.5 text-sm text-white/55 leading-relaxed line-clamp-2">
                          {gate.body}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </motion.div>

        {/* Supporting pillars */}
        <div className="mt-14 md:mt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 mb-7">
            Also protecting every match
          </p>
          <ul className="grid md:grid-cols-3 gap-0 md:gap-0 list-none p-0 m-0 md:divide-x divide-[#e5e3dc] border-y border-[#e5e3dc]">
            {PILLARS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.li
                  key={item.title}
                  initial={{ opacity: 0, y: 14 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.28 + i * 0.07 }}
                  className="py-8 md:px-8 first:md:pl-0 last:md:pr-0 border-b border-[#e5e3dc] md:border-b-0 last:border-b-0"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="font-serif text-2xl text-ink tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base text-gray-600 leading-relaxed">
                    {item.body}
                  </p>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
