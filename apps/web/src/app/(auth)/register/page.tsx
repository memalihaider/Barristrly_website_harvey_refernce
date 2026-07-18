"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { homeForRole, resolvePostAuthRedirect } from "@/lib/auth/portal";

type RoleChoice = "client" | "lawyer";

function RegisterForm() {
  const router = useRouter();
  const search = useSearchParams();
  const nextParam = search.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RoleChoice>("client");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role },
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      if (data.session) {
        await fetch("/api/v1/auth/me");
        const dest =
          resolvePostAuthRedirect(role, nextParam) || homeForRole(role);
        router.push(dest);
        router.refresh();
        return;
      }
      setMessage("Check your email to confirm your account, then log in.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-up failed");
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
        <h1 className="mt-4 font-serif text-3xl tracking-tight">Get started</h1>
        <p className="mt-2 text-sm text-text-on-light-muted">
          Create an account with Supabase Auth.
        </p>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-2">
          {(["client", "lawyer"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold border ${
                role === r
                  ? "bg-primary text-white border-primary"
                  : "bg-ivory text-ink border-black/15"
              }`}
            >
              I am a {r}
            </button>
          ))}
        </div>
        <label className="block text-sm">
          <span className="font-medium">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-black/15 px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Password</span>
          <input
            type="password"
            required
            minLength={6}
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
        {message && (
          <p className="text-sm text-green-700" role="status">
            {message}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>
      <p className="text-sm text-text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-semibold">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-dvh bg-ivory flex items-center justify-center px-4">
      <Suspense
        fallback={
          <p className="text-sm text-text-on-light-muted">Loading…</p>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
