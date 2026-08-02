"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  Building2,
  Check,
  CreditCard,
  Landmark,
  Scale,
  UserRound,
} from "lucide-react";
import {
  ROLE_OPTIONS,
  plansForRole,
  type OnboardingRole,
} from "@/lib/marketing/onboarding-plans";

type Step = "role" | "details" | "plans" | "checkout" | "pending";

type Draft = {
  role: OnboardingRole | null;
  organizationId: string | null;
  agency: {
    companyName: string;
    businessEmail: string;
    phone: string;
    vatId: string;
    employeeCount: string;
    location: string;
  };
  solo: {
    fullName: string;
    phone: string;
    email: string;
    lawyerId: string;
  };
  customer: {
    fullName: string;
    idNumber: string;
  };
  planId: string | null;
  paymentMethod: "stripe" | "paypal" | "bank_transfer" | null;
};

const INITIAL: Draft = {
  role: null,
  organizationId: null,
  agency: {
    companyName: "",
    businessEmail: "",
    phone: "",
    vatId: "",
    employeeCount: "1",
    location: "",
  },
  solo: { fullName: "", phone: "", email: "", lawyerId: "" },
  customer: { fullName: "", idNumber: "" },
  planId: null,
  paymentMethod: null,
};

function stepIndex(step: Step) {
  return ["role", "details", "plans", "checkout", "pending"].indexOf(step);
}

function OnboardingWizard() {
  const router = useRouter();
  const search = useSearchParams();
  const [step, setStep] = useState<Step>("role");
  const [draft, setDraft] = useState<Draft>(INITIAL);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  useEffect(() => {
    const s = search.get("step") as Step | null;
    if (s && ["role", "details", "plans", "checkout", "pending"].includes(s)) {
      setStep(s);
    }
  }, [search]);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/v1/onboarding/status");
      const json = await res.json();
      if (res.status === 401) {
        router.replace("/login?next=/onboarding");
        return;
      }
      if (!json.ok) return;
      if (json.data.completed && json.data.portal) {
        router.replace(json.data.portal);
        return;
      }
      if (json.data.pendingRequest?.status === "pending_approval") {
        setPendingMessage(
          "Your payment request is awaiting Super Admin confirmation."
        );
        setStep("pending");
      }
      setDraft((d) => ({
        ...d,
        solo: {
          ...d.solo,
          fullName: json.data.displayName ?? d.solo.fullName,
          email: json.data.email ?? d.solo.email,
        },
        customer: {
          ...d.customer,
          fullName: json.data.displayName ?? d.customer.fullName,
        },
        agency: {
          ...d.agency,
          businessEmail: json.data.email ?? d.agency.businessEmail,
        },
      }));
    })();
  }, [router]);

  const plans = useMemo(
    () => (draft.role ? plansForRole(draft.role) : []),
    [draft.role]
  );

  async function submitRole(role: OnboardingRole) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/onboarding/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message ?? "Failed");
      setDraft((d) => ({ ...d, role }));
      setStep("details");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function submitDetails() {
    if (!draft.role) return;
    setLoading(true);
    setError(null);
    try {
      let payload: Record<string, unknown> = { role: draft.role };
      if (draft.role === "firm_admin") {
        payload = {
          role: "firm_admin",
          ...draft.agency,
          employeeCount: Number(draft.agency.employeeCount) || 1,
        };
      } else if (draft.role === "lawyer") {
        payload = { role: "lawyer", ...draft.solo };
      } else {
        payload = { role: "client", ...draft.customer };
      }

      const res = await fetch("/api/v1/onboarding/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message ?? "Failed");
      setDraft((d) => ({
        ...d,
        organizationId: json.data.organizationId ?? d.organizationId,
      }));
      setStep("plans");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function submitCheckout() {
    if (!draft.role || !draft.planId || !draft.paymentMethod) return;
    setLoading(true);
    setError(null);
    try {
      const profileSnapshot =
        draft.role === "firm_admin"
          ? draft.agency
          : draft.role === "lawyer"
            ? draft.solo
            : draft.customer;

      const res = await fetch("/api/v1/onboarding/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: draft.role,
          planId: draft.planId,
          paymentMethod: draft.paymentMethod,
          profileSnapshot,
          organizationId: draft.organizationId,
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message ?? "Checkout failed");

      if (json.data.checkoutUrl) {
        window.location.href = json.data.checkoutUrl;
        return;
      }

      if (json.data.status === "active" && json.data.portal) {
        router.push(json.data.portal);
        return;
      }

      setPendingMessage(json.data.message ?? "Request submitted for approval.");
      setStep("pending");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-[#e5e3dc] bg-[#faf9f6] px-3.5 py-3 text-sm text-ink outline-none focus:border-primary focus:bg-white";

  return (
    <div className="relative min-h-dvh px-4 py-12 md:py-16 overflow-hidden bg-[#f5f3ef]">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 10% 0%, rgba(232,93,4,0.1), transparent 50%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-serif text-lg font-extrabold tracking-wider text-primary"
          >
            BARRISTRLY
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
            Step {Math.min(stepIndex(step) + 1, 4)} of 4
          </p>
        </div>

        <div className="mb-8 flex gap-2">
          {(["role", "details", "plans", "checkout"] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full ${
                stepIndex(step) >= i ? "bg-primary" : "bg-[#e5e3dc]"
              }`}
            />
          ))}
        </div>

        <div className="rounded-3xl border border-[#e5e3dc] bg-white/95 p-6 md:p-10 shadow-[0_24px_60px_-28px_rgba(15,14,13,0.3)]">
          {error ? (
            <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {step === "role" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-3xl text-ink tracking-tight">
                  How will you use Barristrly?
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Choose the option that fits you. You can only set this during
                  onboarding.
                </p>
              </div>
              <div className="grid gap-4">
                {ROLE_OPTIONS.map((opt) => {
                  const Icon =
                    opt.id === "firm_admin"
                      ? Building2
                      : opt.id === "lawyer"
                        ? Scale
                        : UserRound;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={loading}
                      onClick={() => void submitRole(opt.id)}
                      className="flex items-start gap-4 rounded-2xl border border-[#e5e3dc] bg-[#faf9f6] p-5 text-left transition-all hover:border-primary/40 hover:shadow-[0_12px_32px_-18px_rgba(232,93,4,0.35)]"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block font-serif text-xl text-ink tracking-tight">
                          {opt.title}
                        </span>
                        <span className="mt-1 block text-sm text-gray-600">
                          {opt.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === "details" && draft.role === "firm_admin" && (
            <div className="space-y-5">
              <h1 className="font-serif text-3xl text-ink tracking-tight">
                Business details
              </h1>
              <p className="text-sm text-gray-600">
                Tell us about your agency so we can verify your organization.
              </p>
              {(
                [
                  ["companyName", "Company name"],
                  ["businessEmail", "Business email"],
                  ["phone", "Phone number"],
                  ["vatId", "Company VAT ID"],
                  ["employeeCount", "Number of employees"],
                  ["location", "Location"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block text-sm">
                  <span className="font-medium text-ink">{label}</span>
                  <input
                    className={inputClass}
                    type={key === "businessEmail" ? "email" : key === "employeeCount" ? "number" : "text"}
                    required
                    value={draft.agency[key]}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        agency: { ...d.agency, [key]: e.target.value },
                      }))
                    }
                  />
                </label>
              ))}
              <button
                type="button"
                disabled={loading}
                onClick={() => void submitDetails()}
                className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-50"
              >
                {loading ? "Saving…" : "Continue to plans"}
              </button>
            </div>
          )}

          {step === "details" && draft.role === "lawyer" && (
            <div className="space-y-5">
              <h1 className="font-serif text-3xl text-ink tracking-tight">
                Lawyer profile
              </h1>
              <p className="text-sm text-gray-600">
                Confirm your details. Email comes from your account.
              </p>
              <label className="block text-sm">
                <span className="font-medium text-ink">Full name</span>
                <input
                  className={inputClass}
                  required
                  value={draft.solo.fullName}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      solo: { ...d.solo, fullName: e.target.value },
                    }))
                  }
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-ink">Phone number</span>
                <input
                  className={inputClass}
                  required
                  value={draft.solo.phone}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      solo: { ...d.solo, phone: e.target.value },
                    }))
                  }
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-ink">Email</span>
                <input
                  className={`${inputClass} opacity-80`}
                  readOnly
                  value={draft.solo.email}
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-ink">Lawyer ID</span>
                <input
                  className={inputClass}
                  required
                  placeholder="License / registration ID"
                  value={draft.solo.lawyerId}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      solo: { ...d.solo, lawyerId: e.target.value },
                    }))
                  }
                />
              </label>
              <button
                type="button"
                disabled={loading}
                onClick={() => void submitDetails()}
                className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-50"
              >
                {loading ? "Saving…" : "Continue to plans"}
              </button>
            </div>
          )}

          {step === "details" && draft.role === "client" && (
            <div className="space-y-5">
              <h1 className="font-serif text-3xl text-ink tracking-tight">
                Your details
              </h1>
              <p className="text-sm text-gray-600">
                No business information needed — just confirm identity basics.
              </p>
              <label className="block text-sm">
                <span className="font-medium text-ink">Full name</span>
                <input
                  className={inputClass}
                  required
                  value={draft.customer.fullName}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      customer: { ...d.customer, fullName: e.target.value },
                    }))
                  }
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-ink">ID number</span>
                <input
                  className={inputClass}
                  required
                  placeholder="Emirates ID / national ID"
                  value={draft.customer.idNumber}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      customer: { ...d.customer, idNumber: e.target.value },
                    }))
                  }
                />
              </label>
              <button
                type="button"
                disabled={loading}
                onClick={() => void submitDetails()}
                className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-50"
              >
                {loading ? "Saving…" : "Continue to plans"}
              </button>
            </div>
          )}

          {step === "plans" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-3xl text-ink tracking-tight">
                  Choose a plan
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Placeholder pricing — we will refine these packages later.
                </p>
              </div>
              <div className="grid gap-4">
                {plans.map((plan) => {
                  const selected = draft.planId === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() =>
                        setDraft((d) => ({ ...d, planId: plan.id }))
                      }
                      className={`rounded-2xl border p-5 text-left transition-all ${
                        selected
                          ? "border-primary bg-primary/5 shadow-[0_12px_32px_-18px_rgba(232,93,4,0.4)]"
                          : "border-[#e5e3dc] bg-[#faf9f6] hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-serif text-xl text-ink tracking-tight">
                            {plan.name}
                          </p>
                          {plan.kind === "meeting" ? (
                            <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider text-primary">
                              Meeting booking
                            </span>
                          ) : null}
                        </div>
                        <div className="text-right">
                          <p className="font-serif text-lg font-semibold text-primary">
                            {plan.price}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            {plan.period}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{plan.detail}</p>
                      <ul className="mt-3 space-y-1.5">
                        {plan.features.map((f) => (
                          <li
                            key={f}
                            className="flex items-start gap-2 text-xs text-gray-600"
                          >
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                disabled={!draft.planId}
                onClick={() => setStep("checkout")}
                className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-50"
              >
                Continue to checkout
              </button>
            </div>
          )}

          {step === "checkout" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-3xl text-ink tracking-tight">
                  Checkout
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Select how you want to pay. Bank transfer and PayPal require
                  Super Admin confirmation after clearance.
                </p>
              </div>
              <div className="grid gap-3">
                {(
                  [
                    {
                      id: "stripe" as const,
                      label: "Stripe",
                      detail: "Pay securely by card (activates immediately).",
                      icon: CreditCard,
                    },
                    {
                      id: "paypal" as const,
                      label: "PayPal",
                      detail: "Submit payment request for admin confirmation.",
                      icon: CreditCard,
                    },
                    {
                      id: "bank_transfer" as const,
                      label: "Bank Transfer",
                      detail:
                        "Submit a transfer request — Super Admin confirms after invoice clearance.",
                      icon: Landmark,
                    },
                  ] as const
                ).map((m) => {
                  const Icon = m.icon;
                  const selected = draft.paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        setDraft((d) => ({ ...d, paymentMethod: m.id }))
                      }
                      className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                        selected
                          ? "border-primary bg-primary/5"
                          : "border-[#e5e3dc] bg-[#faf9f6]"
                      }`}
                    >
                      <Icon className="mt-0.5 h-5 w-5 text-primary" />
                      <span>
                        <span className="block text-sm font-semibold text-ink">
                          {m.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-gray-600">
                          {m.detail}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              {draft.paymentMethod === "bank_transfer" ? (
                <div className="rounded-xl border border-[#e5e3dc] bg-[#faf9f6] p-4 text-sm text-gray-600 leading-relaxed">
                  <p className="font-semibold text-ink mb-1">
                    Transfer instructions
                  </p>
                  Transfer to Barristrly Operations (AED). Include your account
                  email as the payment reference. After funds clear, Super Admin
                  will activate your subscription.
                </div>
              ) : null}
              <button
                type="button"
                disabled={loading || !draft.paymentMethod}
                onClick={() => void submitCheckout()}
                className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-50"
              >
                {loading ? "Processing…" : "Confirm & continue"}
              </button>
            </div>
          )}

          {step === "pending" && (
            <div className="space-y-5 text-center py-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Landmark className="h-6 w-6" />
              </div>
              <h1 className="font-serif text-3xl text-ink tracking-tight">
                Request submitted
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
                {pendingMessage ??
                  "Your subscription request is pending Super Admin approval. You will get portal access once confirmed."}
              </p>
              <Link
                href="/"
                className="inline-flex rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink hover:border-primary hover:text-primary"
              >
                Back to home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <p className="min-h-dvh flex items-center justify-center text-sm text-gray-500">
          Loading…
        </p>
      }
    >
      <OnboardingWizard />
    </Suspense>
  );
}
