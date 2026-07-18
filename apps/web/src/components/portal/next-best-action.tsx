"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { NextBestAction } from "@/features/intelligence";

const DISMISS_KEY = "nba_dismissed";

function readDismissed(): Set<string> {
  if (typeof sessionStorage === "undefined") return new Set();
  try {
    const raw = sessionStorage.getItem(DISMISS_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function writeDismissed(ids: Set<string>) {
  sessionStorage.setItem(DISMISS_KEY, JSON.stringify([...ids]));
}

async function trackNba(
  actionId: string,
  event: "click" | "dismiss",
  leadId?: string
) {
  try {
    await fetch("/api/v1/insights/nba-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actionId, event, leadId }),
    });
  } catch {
    // best-effort
  }
}

export default function NextBestActionBanner({
  primary,
  secondary = [],
  title = "Next best action",
}: {
  primary: NextBestAction | null;
  secondary?: NextBestAction[];
  title?: string;
}) {
  const router = useRouter();
  const [hidden, setHidden] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!primary) {
      setReady(true);
      return;
    }
    const dismissed = readDismissed();
    setHidden(dismissed.has(primary.id));
    setReady(true);
  }, [primary]);

  if (!ready || !primary || hidden) return null;

  async function onPrimaryClick(e: React.MouseEvent) {
    e.preventDefault();
    await trackNba(primary!.id, "click", primary!.leadId);
    router.push(primary!.href);
  }

  async function onDismiss() {
    await trackNba(primary!.id, "dismiss", primary!.leadId);
    const dismissed = readDismissed();
    dismissed.add(primary!.id);
    writeDismissed(dismissed);
    setHidden(true);
  }

  return (
    <section className="mb-8 max-w-2xl border border-black/10 bg-white p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h2 className="font-serif text-lg">{title}</h2>
        <button
          type="button"
          onClick={() => void onDismiss()}
          className="text-xs text-text-on-light-muted hover:text-ink"
        >
          Dismiss
        </button>
      </div>
      <p className="font-medium">{primary.title}</p>
      <p className="text-sm text-text-on-light-muted mt-1">{primary.detail}</p>
      <button
        type="button"
        onClick={(e) => void onPrimaryClick(e)}
        className="mt-4 inline-flex px-4 py-2 bg-ink text-ivory text-sm"
      >
        Continue →
      </button>
      {secondary.length > 0 && (
        <ul className="mt-4 space-y-2 border-t border-black/5 pt-3">
          {secondary.map((s) => (
            <li key={s.id}>
              <Link
                href={s.href}
                className="text-sm text-primary"
                onClick={() => void trackNba(s.id, "click", s.leadId)}
              >
                {s.title}
              </Link>
              <span className="text-xs text-text-on-light-muted ml-2">
                {s.priority}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
