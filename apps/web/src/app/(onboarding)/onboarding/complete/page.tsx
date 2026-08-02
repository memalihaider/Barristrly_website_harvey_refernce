"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function CompleteInner() {
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const sessionId = search.get("session_id");
        const res = await fetch("/api/v1/onboarding/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const json = await res.json();
        if (!json.ok) {
          setError(json.error?.message ?? "Could not complete onboarding");
          return;
        }
        router.replace(json.data.portal ?? "/");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not complete");
      }
    })();
  }, [router, search]);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#f5f3ef] px-4">
      <div className="max-w-md text-center space-y-4">
        <Link href="/" className="font-serif text-xl font-extrabold tracking-wider text-primary">
          BARRISTRLY
        </Link>
        {error ? (
          <>
            <p className="text-sm text-red-600">{error}</p>
            <Link href="/onboarding" className="text-sm font-semibold text-primary">
              Return to onboarding
            </Link>
          </>
        ) : (
          <p className="text-sm text-gray-600">Finalizing your account…</p>
        )}
      </div>
    </div>
  );
}

export default function OnboardingCompletePage() {
  return (
    <Suspense fallback={<p className="p-10 text-center text-sm">Loading…</p>}>
      <CompleteInner />
    </Suspense>
  );
}
