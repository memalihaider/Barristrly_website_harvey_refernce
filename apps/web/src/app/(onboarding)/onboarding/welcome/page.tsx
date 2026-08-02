"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OnboardingWelcomePage() {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/v1/onboarding/status");
        const json = await res.json();
        if (!json.ok) {
          if (res.status === 401) {
            router.replace("/login?next=/onboarding/welcome");
            return;
          }
          setError(json.error?.message ?? "Unable to load");
          return;
        }
        if (json.data.completed && json.data.portal) {
          router.replace(json.data.portal);
          return;
        }
        setName(json.data.displayName ?? null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unable to load");
      }
    })();
  }, [router]);

  return (
    <div className="relative min-h-dvh flex items-center justify-center px-4 py-16 overflow-hidden bg-[#f5f3ef]">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 15% 20%, rgba(232,93,4,0.12), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 80%, rgba(232,93,4,0.08), transparent 50%)",
        }}
      />
      <div className="relative z-10 w-full max-w-lg">
        <div className="rounded-3xl border border-[#e5e3dc] bg-white/95 p-8 md:p-12 shadow-[0_24px_60px_-28px_rgba(15,14,13,0.35)] text-center">
          <Link
            href="/"
            className="font-serif text-xl font-extrabold tracking-wider text-primary"
          >
            BARRISTRLY
          </Link>
          <h1 className="mt-8 font-serif text-[clamp(2rem,4vw,2.75rem)] text-ink tracking-tight leading-tight">
            Welcome{name ? `, ${name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-4 text-base text-gray-600 leading-relaxed">
            Your account is ready. Next we will set up how you use Barristrly —
            as an agency owner, solo lawyer, or customer seeking counsel — then
            choose a plan and complete checkout.
          </p>
          {error ? (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => router.push("/onboarding")}
            className="mt-10 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-on-primary hover:bg-primary-hover transition-colors"
          >
            Let&apos;s get started
          </button>
        </div>
      </div>
    </div>
  );
}
