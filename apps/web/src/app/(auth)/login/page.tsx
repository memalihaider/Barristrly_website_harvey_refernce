"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { resolvePostAuthRedirect } from "@/lib/auth/portal";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const nextParam = search.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const role = meJson.ok ? (meJson.data.user?.role as string | undefined) : undefined;
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
    <div className="w-full max-w-md border border-black/10 bg-ivory p-8 space-y-6">
      <div>
        <Link href="/" className="font-serif text-2xl">
          Layers
        </Link>
        <h1 className="mt-4 font-serif text-3xl tracking-tight">Log in</h1>
        <p className="mt-2 text-sm text-text-on-light-muted">
          Signed in via Supabase Auth.
        </p>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm">
          <span className="font-medium">Email</span>
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-black/15 px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
            placeholder="you@firm.com"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Password</span>
          <input
            type="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-black/15 px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
          />
        </label>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Continue"}
        </button>
      </form>
      <p className="text-sm text-text-muted">
        New here?{" "}
        <Link href="/register" className="text-primary font-semibold">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-ivory flex items-center justify-center px-4">
      <Suspense
        fallback={
          <p className="text-sm text-text-on-light-muted">Loading…</p>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
