"use client";

import { useState, type FormEvent } from "react";
import type {
  CatalogService,
  ServiceRequestPayload,
} from "@/lib/marketing/service-catalog";

type Props = {
  /** Serializable service data (no icon component — this is a client component). */
  service: Omit<CatalogService, "icon">;
};

export default function ServiceRequestForm({ service }: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const fields: Record<string, string | number | boolean | null> = {};

    for (const field of service.formSchema) {
      if (field.type === "checkbox") {
        fields[field.key] = fd.get(field.key) === "on";
        continue;
      }
      if (field.type === "file") {
        const file = fd.get(field.key);
        fields[field.key] =
          file instanceof File && file.name
            ? `[file:${file.name};${file.size}]`
            : null;
        continue;
      }
      if (field.type === "number") {
        const raw = String(fd.get(field.key) ?? "");
        fields[field.key] = raw === "" ? null : Number(raw);
        continue;
      }
      fields[field.key] = String(fd.get(field.key) ?? "").trim() || null;
    }

    const payload: ServiceRequestPayload = {
      schemaVersion: "barristrly.service-request.v1",
      serviceId: service.id,
      serviceSlug: service.slug,
      submittedAt: new Date().toISOString(),
      source: "web-phase1",
      fields,
    };

    try {
      const res = await fetch("/api/v1/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json?.error?.message ?? "Submission failed");
      }
      setStatus("done");
      setMessage(
        "Request received. You will get a confirmation within our 48-hour SLA via email/WhatsApp.",
      );
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form
      id="request"
      onSubmit={onSubmit}
      className="scroll-mt-28 rounded-2xl border border-[#e5e3dc] bg-white p-6 md:p-8 space-y-5"
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          Service request
        </p>
        <h3 className="mt-1 font-serif text-2xl text-ink tracking-tight">
          {service.shortName}
        </h3>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          Send this short request. We will reply within 48 hours with next steps
          and pricing if payment is needed.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {service.formSchema.map((field) => {
          const id = `${service.slug}-${field.key}`;
          const common =
            "w-full rounded-xl border border-black/10 bg-[#faf9f6] px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

          if (field.type === "checkbox") {
            return (
              <label
                key={field.key}
                className="sm:col-span-2 flex items-start gap-3 text-sm text-ink/90"
              >
                <input
                  id={id}
                  name={field.key}
                  type="checkbox"
                  required={field.required}
                  className="mt-1 h-4 w-4 rounded border-black/20 text-primary focus:ring-primary"
                />
                <span>{field.label}</span>
              </label>
            );
          }

          return (
            <label
              key={field.key}
              className={`block space-y-1.5 ${
                field.type === "textarea" || field.type === "file"
                  ? "sm:col-span-2"
                  : ""
              }`}
            >
              <span className="text-xs font-semibold text-ink">
                {field.label}
                {field.required ? (
                  <span className="text-primary"> *</span>
                ) : null}
              </span>
              {field.type === "textarea" ? (
                <textarea
                  id={id}
                  name={field.key}
                  required={field.required}
                  rows={4}
                  placeholder={field.placeholder}
                  className={common}
                />
              ) : field.type === "select" ? (
                <select
                  id={id}
                  name={field.key}
                  required={field.required}
                  className={common}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {(field.options ?? []).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === "file" ? (
                <input
                  id={id}
                  name={field.key}
                  type="file"
                  required={field.required}
                  accept={field.accept}
                  className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary"
                />
              ) : (
                <input
                  id={id}
                  name={field.key}
                  type={field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  className={common}
                />
              )}
              {field.helpText ? (
                <span className="block text-[11px] text-gray-500">
                  {field.helpText}
                </span>
              ) : null}
            </label>
          );
        })}
      </div>

      {message ? (
        <p
          role="status"
          className={`text-sm rounded-xl px-3 py-2 ${
            status === "error"
              ? "bg-red-50 text-red-700"
              : "bg-emerald-50 text-emerald-800"
          }`}
        >
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-60 transition-colors"
      >
        {status === "submitting" ? "Sending…" : service.ctaLabel}
      </button>
    </form>
  );
}
