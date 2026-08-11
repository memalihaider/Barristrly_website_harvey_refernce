"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  PhoneCall,
  Lock,
  Timer,
  ShieldCheck,
  UserRoundCheck,
  Ban,
} from "lucide-react";
import Link from "next/link";

const POINTS = [
  {
    icon: Lock,
    step: "01",
    title: "Contacts stay on the platform",
    body: "Anonymous meetings run through Barristrly-held audio and video — not personal phone numbers, WhatsApp, or email. Counsel advise on the matter without storing your direct identifiers. The consult can proceed fully without either side exchanging contact details.",
  },
  {
    icon: Timer,
    step: "02",
    title: "Timed, escrow-protected sessions",
    body: "You book a defined 30, 45, or 60-minute consult. Session fees sit in escrow and release only when the meeting is complete. You pay for focused advice — not an open-ended relationship — and can meet more than one specialist before you commit.",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "COI already cleared before you speak",
    body: "The first meeting happens only after adverse parties are screened and the firm has affirmed no conflict. Privileged narrative and documents stay locked until that clearance. You never brief a conflicted practice by accident on a live call.",
  },
  {
    icon: Ban,
    step: "04",
    title: "No off-platform chase",
    body: "Because identity and contacts remain masked, there is no channel for unsolicited follow-up after a scoping call. If the fit is wrong, the session ends and your details stay hidden. If the fit is right, both sides opt in to continue — not one side pursuing the other.",
  },
  {
    icon: UserRoundCheck,
    step: "05",
    title: "Unmask only on mutual consent",
    body: "After the consult, you decide whether to authorize release. Names, firm identity, and contact details unlock only when you accept counsel — or when both parties affirm the next step. Until then, the meeting leaves no competitive footprint and no public trail of who sought advice.",
  },
];

const FLOW = [
  { label: "Book", detail: "Escrow the session" },
  { label: "Meet", detail: "Masked audio / video" },
  { label: "Advise", detail: "Identity still hidden" },
  { label: "Unmask", detail: "Only if you accept" },
];

export default function AnonymousMeeting() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="why-anonymous-meeting"
      ref={ref}
      className="relative overflow-hidden light-section py-24 md:py-32 lg:py-36"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, #ffffff 0%, #faf9f6 48%, #f7f5f1 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 100% 0%, rgba(232,93,4,0.10), transparent 55%), radial-gradient(ellipse 40% 35% at 0% 80%, rgba(232,93,4,0.06), transparent 50%)",
        }}
      />

      <div className="container-wide relative z-10">
        <div className="mx-auto max-w-5xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45 }}
            className="mb-5 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gray-500"
          >
            <PhoneCall className="h-3.5 w-3.5 text-primary" aria-hidden />
            Equally important
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="font-serif text-[clamp(2.75rem,6.5vw,5rem)] text-primary tracking-tight leading-[1.02]"
          >
            Why Anonymous Meeting
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 font-serif text-[clamp(1.35rem,2.4vw,1.85rem)] text-ink tracking-tight"
          >
            Speak first. Share identity only if you choose.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-gray-600 leading-relaxed"
          >
            Directory anonymity is incomplete without a confidential consult.
            Barristrly meetings keep contacts platform-held, sessions timed and
            escrowed, and unmasking behind your explicit consent.
          </motion.p>
        </div>

        <motion.ol
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-14 md:mt-16 mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-0 list-none p-0 m-0
            md:rounded-full md:border md:border-[#e5e3dc] md:bg-white/75 md:backdrop-blur-sm md:px-2 md:py-2
            md:shadow-[0_20px_50px_-28px_rgba(15,14,13,0.18)]"
          aria-label="Anonymous meeting flow"
        >
          {FLOW.map((item, i) => (
            <li
              key={item.label}
              className="relative flex flex-col items-center justify-center rounded-2xl border border-[#e5e3dc] bg-white/90 px-4 py-5 md:rounded-full md:border-0 md:bg-transparent md:py-4"
            >
              {i > 0 ? (
                <span
                  className="pointer-events-none absolute left-0 top-1/2 hidden h-px w-full -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/35 to-transparent md:block"
                  aria-hidden
                />
              ) : null}
              <span className="relative z-10 font-serif text-2xl md:text-[1.65rem] text-ink tracking-tight">
                {item.label}
              </span>
              <span className="relative z-10 mt-1 text-sm md:text-[0.95rem] text-gray-500">
                {item.detail}
              </span>
            </li>
          ))}
        </motion.ol>

        <div className="mt-16 md:mt-20 max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 mb-8 md:mb-10">
            Why meetings stay anonymous
          </p>
          <ul className="space-y-0 list-none p-0 m-0 divide-y divide-[#e5e3dc] border-y border-[#e5e3dc]">
            {POINTS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.li
                  key={item.title}
                  initial={{ opacity: 0, y: 14 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.22 + i * 0.06 }}
                  className="group grid md:grid-cols-[5.5rem_1fr] gap-4 md:gap-8 py-8 md:py-10"
                >
                  <div className="flex md:flex-col items-center md:items-start gap-3">
                    <span className="font-serif text-2xl md:text-3xl text-primary/80 tracking-tight tabular-nums">
                      {item.step}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif text-[1.65rem] md:text-[2rem] text-ink tracking-tight leading-tight transition-colors duration-300 group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-3xl text-base md:text-lg text-gray-600 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.4 }}
          className="mt-12 md:mt-14 flex justify-center"
        >
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-on-primary hover:bg-primary-hover transition-colors shadow-[0_16px_36px_-18px_rgba(232,93,4,0.65)]"
          >
            Start an Anonymous Meeting
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
