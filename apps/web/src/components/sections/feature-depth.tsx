"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  EyeOff,
  Globe2,
  PhoneCall,
  ShieldCheck,
  Lock,
  Landmark,
  Users,
  Fingerprint,
  CreditCard,
  RefreshCw,
  Plane,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  label: string;
  title: string;
  lead: string;
  body: string[];
  photo: string;
};

const FEATURES: Feature[] = [
  {
    icon: ShieldCheck,
    label: "COI",
    title: "Two-gate conflict screening",
    lead: "Parties first — narrative locked until clearance.",
    body: [
      "Unlike a static directory dump, Barristrly runs a conflict workflow before anyone sees your story. Clients list themselves and adverse parties first. Case narrative and documents stay locked so privileged facts never enter the pool before COI runs.",
      "Firms see Case ID, practice area, claim value, and opposing-party nodes only. Accepting a lead requires mandatory conflict certification. Client name and documents unlock only after affirmation and payment. If a conflict surfaces after reveal, firms can report within 24 hours — access is revoked and the matter rematches.",
      "Conflict checks are verified and protected with cryptographic hashing — so clearance cannot be spoofed or quietly altered.",
    ],
    photo: "/testimonials/james.jpg",
  },
  {
    icon: EyeOff,
    label: "Directory",
    title: "Anonymous directory",
    lead: "Evaluate counsel on merit. Identity stays hidden until both sides opt in.",
    body: [
      "The anonymous directory is engineered to protect prospective clients from premature exposure, solicitation, and privacy risk. You evaluate credentials strictly on merit and strategic alignment. Personal data stays obscured during discovery. Practitioners assess cases on facts, legal viability, and practice-area fit — not financial capability.",
      "Traditional marketplaces expose contact details and invite spam. Barristrly keeps client information completely hidden until a mutual decision to connect is established. Contact details are shared only when both parties affirm intent.",
    ],
    photo: "/testimonials/priya.jpg",
  },
  {
    icon: PhoneCall,
    label: "Meetings",
    title: "Anonymous meetings",
    lead: "Speak first. Share identity only if you choose.",
    body: [
      "Consults run through Barristrly-held audio and video — not personal phone numbers, WhatsApp, or email. You book a timed 30, 45, or 60-minute session. Fees sit in escrow and release when the meeting is complete.",
      "The first meeting happens only after COI clearance. Identity and contacts remain masked, so there is no channel for unsolicited follow-up. After the consult, you decide whether to authorize release. Names and contacts unlock only when you accept counsel.",
    ],
    photo: "/testimonials/amira.jpg",
  },
  {
    icon: Globe2,
    label: "Corridors",
    title: "Global legal corridor",
    lead: "Hire UAE counsel from India or Pakistan — or hire worldwide from the UAE — without flying in.",
    body: [
      "Clients in India, Pakistan, and other countries can find lawyers and legal service providers on Barristrly without the heavy expense of travelling to the UAE or being physically present to hire them. Evaluate credentials, meet anonymously, and retain counsel on the platform — saving time, energy, and money.",
      "Clients in the UAE can do the same in any region of the world: browse forum-aligned counsel, clear conflicts, meet by secure session, and hire without leaving their market. Cross-border transactions, IP registrations, and international arbitration often demand secrecy long before contracts are signed. The corridor lets corporations and investors evaluate multi-jurisdictional expertise without revealing proprietary commercial intent.",
      "One aggregator path across UAE mainland, ADGM, DIFC, GCC corridors, India, Pakistan, and beyond — so matters match on forum, not on who can afford a flight.",
    ],
    photo: "/testimonials/neha.jpg",
  },
  {
    icon: Landmark,
    label: "Escrow",
    title: "Milestone escrow",
    lead: "Funds held until the session or milestone is verified.",
    body: [
      "Session fees and later engagement payments route through platform escrow. Money is safely held and released only upon milestone verification and client approval — so neither side is asked to trust a wire into the unknown.",
      "This removes the financial friction that usually sits between a first consult and formal retention, especially across borders where banking, currency, and collection risk would otherwise stall the hire.",
    ],
    photo: "/testimonials/omar.jpg",
  },
  {
    icon: Users,
    label: "Network",
    title: "Vetted counsel network",
    lead: "Firms, solo practitioners, and arbitrators aligned to your forum.",
    body: [
      "Access a vetted network of premium firm practices, independent lawyers, experts, and specialized arbitrators. Listings stay anonymous until unlock, so you compare practice fit, forum experience, and fee tier — not brand theater.",
      "Providers receive conflict-ready briefs instead of cold open inquiries, and compete on expertise rather than marketing spend.",
    ],
    photo: "/testimonials/james.jpg",
  },
];

const COI_GATES = [
  {
    icon: Lock,
    title: "Registration gate",
    body: "Clients list themselves and adverse parties first. Narrative and documents stay locked.",
  },
  {
    icon: Fingerprint,
    title: "Blind match & affirmation",
    body: "Firms see Case ID, practice, claim value, and opposing parties only.",
  },
  {
    icon: CreditCard,
    title: "Payment-gated unblind",
    body: "Name and documents unlock only after affirmation and payment succeed.",
  },
  {
    icon: RefreshCw,
    title: "Post-unlock quarantine",
    body: "If a conflict surfaces later, access is revoked and the matter rematches.",
  },
];

function FeaturePreview({ feature, index }: { feature: Feature; index: number }) {
  return (
    <div className="space-y-4">
      {feature.body.map((para) => (
        <p
          key={para.slice(0, 48)}
          className="text-sm md:text-base text-gray-600 leading-relaxed"
        >
          {para}
        </p>
      ))}

      {index === 1 ? (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                Masked matching
              </span>
            </div>
            <span className="text-[11px] text-gray-500">2 candidates</span>
          </div>
          {[
            {
              id: "COUNSEL–8390",
              match: "98%",
              line: "Dubai arbitrator · 14 yrs · DIFC commercial",
            },
            {
              id: "COUNSEL–4412",
              match: "94%",
              line: "Mainland counsel · lease & RDC disputes",
            },
          ].map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-[#e8e5df] bg-[#faf9f6] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs font-bold text-primary">
                  {c.id}
                </span>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  {c.match} merit
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                {c.line}
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
                <Lock className="h-3 w-3" aria-hidden />
                Identity encrypted until unlock
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {index === 3 ? (
        <div className="grid grid-cols-2 gap-3 pt-2">
          {[
            { from: "India / Pakistan", to: "UAE counsel" },
            { from: "UAE clients", to: "Worldwide" },
          ].map((row) => (
            <div
              key={row.from}
              className="rounded-xl border border-[#e8e5df] bg-[#faf9f6] p-4"
            >
              <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                <Plane className="h-3 w-3" aria-hidden />
                {row.from}
              </p>
              <p className="mt-2 font-serif text-xl text-ink tracking-tight leading-tight">
                {row.to}
              </p>
              <p className="mt-2 text-xs text-gray-600">
                Evaluate · meet · hire — no flight
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function FeatureDepth() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(3);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || !isInView) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % FEATURES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [paused, isInView]);

  const current = FEATURES[active];
  const Icon = current.icon;

  return (
    <section
      id="why-features"
      ref={ref}
      className="relative overflow-hidden light-section py-24 md:py-28 lg:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(165deg, #f7f5f1 0%, #faf9f6 40%, #ffffff 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 80% 8%, rgba(232,93,4,0.12), transparent 55%), radial-gradient(ellipse 40% 35% at 10% 70%, rgba(232,93,4,0.06), transparent 50%)",
        }}
      />

      <div className="container-wide relative z-10">
        <div className="max-w-3xl mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4"
          >
            Why it matters
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.05 }}
            className="font-serif text-[clamp(2.25rem,5vw,4rem)] text-ink tracking-tight leading-[1.05]"
          >
            Core protections,{" "}
            <span className="text-primary">global reach</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="mt-5 text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl"
          >
            COI, anonymous directory, confidential meetings, escrow, and a
            corridor that lets India, Pakistan, the UAE, and the rest of the
            world evaluate, meet, and hire without flying in.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          <div className="lg:col-span-5">
            <ol className="flex flex-col list-none p-0 m-0 border-t border-[#e5e3dc]">
              {FEATURES.map((item, i) => {
                const StepIcon = item.icon;
                const isActive = i === active;
                return (
                  <li key={item.title} className="border-b border-[#e5e3dc]">
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      className="group w-full flex gap-4 py-5 md:py-6 text-left"
                      aria-current={isActive ? "true" : undefined}
                    >
                      <span
                        className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
                          isActive
                            ? "bg-primary text-on-primary"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <StepIcon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/80 mb-1">
                          {String(i + 1).padStart(2, "0")} · {item.label}
                        </span>
                        <span
                          className={`block font-serif text-[1.45rem] md:text-[1.75rem] tracking-tight leading-tight transition-colors ${
                            isActive ? "text-ink" : "text-ink/35 group-hover:text-ink/60"
                          }`}
                        >
                          {item.title}
                        </span>
                        <AnimatePresence initial={false}>
                          {isActive ? (
                            <motion.span
                              key="lead"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 block text-base text-gray-600 leading-relaxed overflow-hidden"
                            >
                              {item.lead}
                            </motion.span>
                          ) : null}
                        </AnimatePresence>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="lg:col-span-7 relative min-h-[520px]">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#e5e3dc] bg-[#faf9f6] min-h-[520px] h-full">
              <div
                className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
                aria-hidden
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.photo}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-[0.12] grayscale"
                aria-hidden
              />

              <div className="relative z-10 flex h-full flex-col p-6 md:p-8 lg:p-10">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-[0_10px_28px_rgba(232,93,4,0.28)]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <span className="font-serif text-[clamp(3.5rem,8vw,6rem)] leading-none tracking-tighter text-ink/[0.07] select-none">
                    {String(active + 1).padStart(2, "0")}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 flex flex-col"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-2">
                      Feature {active + 1} · {current.label}
                    </p>
                    <h3 className="font-serif text-[clamp(1.85rem,3.4vw,2.75rem)] text-ink tracking-tight leading-[1.08] mb-4">
                      {current.title}
                    </h3>
                    <p className="text-lg md:text-xl text-ink/80 leading-relaxed mb-6 max-w-xl">
                      {current.lead}
                    </p>
                    <div className="rounded-2xl border border-[#e5e3dc] bg-white/92 p-5 md:p-6 shadow-[0_20px_50px_-30px_rgba(15,14,13,0.35)] mt-auto">
                      <FeaturePreview feature={current} index={active} />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Corridor emphasis band */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="mt-16 md:mt-20 rounded-[2rem] border border-[#e5e3dc] bg-[#faf9f6] p-8 md:p-12"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4">
            India · Pakistan · UAE · Worldwide
          </p>
          <h3 className="font-serif text-[clamp(1.85rem,3.6vw,3rem)] text-ink tracking-tight leading-[1.08] max-w-4xl">
            Hire across borders without the flight, the hotel, or the wasted week.
          </h3>
          <div className="mt-8 grid md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <h4 className="font-serif text-2xl text-ink tracking-tight mb-3">
                From India, Pakistan, and beyond
              </h4>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Find UAE lawyers and legal service providers without travelling
                to be present in the Emirates. Evaluate on merit, meet in a
                confidential session, and hire on-platform — avoiding heavy
                travel expense, lost working days, and the friction of
                in-person retainers.
              </p>
            </div>
            <div>
              <h4 className="font-serif text-2xl text-ink tracking-tight mb-3">
                From the UAE to any region
              </h4>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                UAE clients can do the same worldwide. Browse forum-aligned
                counsel in the GCC, India, Pakistan, the UK, and other
                corridors. Clear conflicts, meet anonymously, and retain
                without leaving your market — the same privacy and escrow
                controls in every direction.
              </p>
            </div>
          </div>
          <Link
            href="/find-lawyers"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary hover:bg-primary-hover transition-colors"
          >
            Browse the global directory
          </Link>
        </motion.div>

        {/* Compact COI gates */}
        <div className="mt-14 md:mt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 mb-6">
            Two-gate COI in four moves
          </p>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 list-none p-0 m-0">
            {COI_GATES.map((gate, i) => {
              const GateIcon = gate.icon;
              return (
                <li
                  key={gate.title}
                  className="rounded-2xl border border-[#e5e3dc] bg-white p-5"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                    <GateIcon className="h-4 w-4" aria-hidden />
                  </span>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-primary mb-1">
                    Gate {String(i + 1).padStart(2, "0")}
                  </p>
                  <h4 className="font-serif text-xl text-ink tracking-tight">
                    {gate.title}
                  </h4>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {gate.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
