"use client";

import { useState, type FormEvent } from "react";

const ROLES = [
  { value: "client", label: "Client / individual" },
  { value: "lawyer", label: "Lawyer" },
  { value: "firm", label: "Law firm" },
  { value: "enterprise", label: "Enterprise / in-house" },
  { value: "other", label: "Other" },
] as const;

export default function DemoRequestForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      organization: String(form.get("organization") ?? ""),
      role: String(form.get("role") ?? "other"),
      country: String(form.get("country") ?? ""),
      message: String(form.get("message") ?? ""),
    };

    try {
      const res = await fetch("/api/v1/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        setError(json?.error?.message ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("done");
      e.currentTarget.reset();
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-primary/30 bg-ivory p-8 md:p-10">
        <h2 className="font-serif text-2xl text-ink">Request received</h2>
        <p className="mt-3 text-gray-700 leading-relaxed">
          Thanks for your interest. A Barristrly teammate will follow up shortly.
        </p>
        <button
          type="button"
          className="mt-6 text-sm font-semibold text-primary hover:text-primary-hover"
          onClick={() => setStatus("idle")}
        >
          Submit another request
        </button>
      </div>
    );
  }

  const fieldClass =
    "mt-1.5 w-full rounded-lg border border-gray-300 bg-ivory px-3 py-2.5 text-ink text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-gray-200 bg-ivory p-8 md:p-10 space-y-5 shadow-sm"
    >
      <div>
        <label htmlFor="demo-name" className="text-sm font-medium text-ink">
          Full name
        </label>
        <input
          id="demo-name"
          name="name"
          required
          autoComplete="name"
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="demo-email" className="text-sm font-medium text-ink">
          Work email
        </label>
        <input
          id="demo-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="demo-org" className="text-sm font-medium text-ink">
          Organization
        </label>
        <input
          id="demo-org"
          name="organization"
          autoComplete="organization"
          className={fieldClass}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="demo-role" className="text-sm font-medium text-ink">
            Role
          </label>
          <select
            id="demo-role"
            name="role"
            required
            className={fieldClass}
            defaultValue="lawyer"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="demo-country" className="text-sm font-medium text-ink">
            Country
          </label>
          <input id="demo-country" name="country" className={fieldClass} />
        </div>
      </div>
      <div>
        <label htmlFor="demo-message" className="text-sm font-medium text-ink">
          What are you looking to solve?
        </label>
        <textarea
          id="demo-message"
          name="message"
          rows={4}
          className={fieldClass}
        />
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-primary px-7 py-3.5 text-[0.9375rem] font-semibold text-on-primary hover:bg-primary-hover transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Request a demo"}
      </button>
    </form>
  );
}
