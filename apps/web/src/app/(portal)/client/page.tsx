"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/app/app-shell";
import Link from "next/link";
import NextBestActionBanner from "@/components/portal/next-best-action";
import type { NextBestAction } from "@/features/intelligence";

export default function ClientHome() {
  const [matterCount, setMatterCount] = useState<number | null>(null);
  const [primary, setPrimary] = useState<NextBestAction | null>(null);
  const [secondary, setSecondary] = useState<NextBestAction[]>([]);

  useEffect(() => {
    fetch("/api/v1/matters")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setMatterCount(json.data.count ?? 0);
      })
      .catch(() => setMatterCount(null));

    fetch("/api/v1/client/insights")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) {
          setPrimary(json.data.primary ?? null);
          setSecondary(json.data.secondary ?? []);
        }
      })
      .catch(() => {
        setPrimary(null);
        setSecondary([]);
      });
  }, []);

  return (
    <AppShell role="client" title="Client overview">
      <p className="text-text-on-light-muted mb-8 max-w-2xl">
        Start with AI intake, get conflict-safe matches, book a consult, and
        manage matters — marketplace MVP path.
      </p>

      <NextBestActionBanner primary={primary} secondary={secondary} />

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { href: "/client/intake", title: "AI Intake", desc: "Describe your legal issue" },
          { href: "/client/matches", title: "Matches", desc: "Ranked lawyers after COI" },
          { href: "/client/bookings", title: "Bookings", desc: "Schedule & pay" },
          {
            href: "/client/matters",
            title: "Matters",
            desc:
              matterCount == null
                ? "Collaboration portal"
                : `${matterCount} active matter${matterCount === 1 ? "" : "s"}`,
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="border border-black/10 bg-white p-5 hover:border-primary transition-colors"
          >
            <h2 className="font-serif text-xl mb-1">{card.title}</h2>
            <p className="text-sm text-text-muted">{card.desc}</p>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
