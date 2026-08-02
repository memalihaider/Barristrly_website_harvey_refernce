"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { resolvePostAuthRedirect } from "@/lib/auth/portal";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const nextParam = search.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
        return;
      }

      const meRes = await fetch("/api/v1/auth/me");
      const meJson = await meRes.json();
      const role = meJson.ok
        ? (meJson.data.user?.role as string | undefined)
        : undefined;
      const onboardingCompleted = meJson.ok
        ? Boolean(meJson.data.user?.onboardingCompleted)
        : true;

      if (!onboardingCompleted) {
        router.push("/onboarding/welcome");
        router.refresh();
        return;
      }

      const dest = resolvePostAuthRedirect(role, nextParam);
      router.push(dest);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl border border-[#e5e3dc] bg-white/95 p-8 md:p-10 shadow-[0_24px_60px_-28px_rgba(15,14,13,0.35)] space-y-7">
        <div>
          <Link
            href="/"
            className="font-serif text-xl font-extrabold tracking-wider text-primary"
          >
            BARRISTRLY
          </Link>
          <h1 className="mt-5 font-serif text-[clamp(1.75rem,3vw,2.25rem)] text-ink tracking-tight leading-tight">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            Use your Barristrly account credentials. You will be taken to the
            right workspace after sign-in.
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm">
            <span className="font-medium text-ink">Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#e5e3dc] bg-[#faf9f6] px-3.5 py-3 text-sm text-ink placeholder:text-gray-400 outline-none focus:border-primary focus:bg-white transition-colors"
              placeholder="you@email.com"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-ink">Password</span>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#e5e3dc] bg-[#faf9f6] px-3.5 py-3 pr-11 text-sm text-ink placeholder:text-gray-400 outline-none focus:border-primary focus:bg-white transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ink"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </label>

          {error ? (
            <p
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-50 transition-colors"
          >
            <Lock className="h-4 w-4" aria-hidden />
            {loading ? "Signing in…" : "Continue"}
          </button>
        </form>

        <div className="pt-2 border-t border-[#e5e3dc]">
          <p className="text-sm text-gray-600">
            New here?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-primary-hover"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-dvh flex items-center justify-center px-4 py-16 overflow-hidden bg-[#f5f3ef]">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 10% 20%, rgba(232,93,4,0.12), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 80%, rgba(232,93,4,0.08), transparent 50%)",
        }}
      />
      <div className="relative z-10 w-full max-w-md">
        <Suspense
          fallback={
            <p className="text-center text-sm text-gray-500">Loading…</p>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
