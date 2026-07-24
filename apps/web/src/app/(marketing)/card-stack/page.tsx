"use client";

import { CardStack, CardStackItem } from "@/components/ui/card-stack";

const items: CardStackItem[] = [
  {
    id: 1,
    title: "Conflict of Interest Screening",
    description: "Instant blind screening runs before consultations begin.",
    videoSrc: "/bg-video.mp4",
    href: "https://barristrly.com/",
  },
  {
    id: 2,
    title: "Anonymous Directory Triage",
    description: "Merit-only profiles masked from brand and geography bias.",
    videoSrc: "/bg-video.mp4",
    href: "https://barristrly.com/",
  },
  {
    id: 3,
    title: "Protected VoIP Meetings",
    description: "Conduct consultations via encrypted VoIP sessions with escrow protection.",
    videoSrc: "/bg-video.mp4",
    href: "https://barristrly.com/",
  },
  {
    id: 4,
    title: "Escrow Financial Safeguards",
    description: "Funds are securely routed and released on milestone verification.",
    videoSrc: "/bg-video.mp4",
    href: "https://barristrly.com/",
  },
  {
    id: 5,
    title: "Global Legal Corridor",
    description: "Seamless cross-border matching between UAE, GCC, and India.",
    videoSrc: "/bg-video.mp4",
    href: "https://barristrly.com/",
  },
];

export default function CardStackDemoPage() {
  return (
    <main className="min-h-screen bg-black py-28 md:py-36">
      <div className="container-wide">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden />
            Interactive Demo
          </div>
          <h1 className="font-serif text-[clamp(2rem,4vw,3.25rem)] text-white tracking-tight leading-[1.1] mb-6">
            3D Card Stack Component
          </h1>
          <p className="text-base text-gray-400 max-w-lg mx-auto leading-relaxed">
            Drag cards left or right, or use the navigation dots below to rotate through the secure platform layers.
          </p>
        </div>

        <div className="mx-auto w-full max-w-3xl flex justify-center">
          <CardStack
            items={items}
            initialIndex={0}
            autoAdvance
            intervalMs={3000}
            pauseOnHover
            showDots
            cardWidth={520}
            cardHeight={320}
          />
        </div>
      </div>
    </main>
  );
}
