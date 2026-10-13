"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import GradientButton from "@/components/ui/gradient-button";
import {
  FieldWrapper,
  TextField,
  TextAreaField,
  RadioGroupField,
  CheckboxGroupField,
} from "@/components/ui/form-fields";
import { LEGAL_SERVICES } from "@/lib/marketing/seo-slugs";
import {
  CLIENT_TYPES,
  EMIRATES,
  SERVICE_ROUTES,
  MEETING_FORMATS,
  JURISDICTIONS,
  LANGUAGE_REQUIREMENTS,
  CLAIM_VALUE_RANGES,
  URGENCY_LEVELS,
  SUPPORTING_DOCS,
} from "@/lib/marketing/intake-form";

const PRACTICE_AREA_OPTIONS = [...LEGAL_SERVICES.map((s) => s.label), "Other"];

type FormState = {
  clientType: string;
  fullName: string;
  tradeLicenseNo: string;
  contactPerson: string;
  email: string;
  phone: string;
  emirate: string;
  serviceRoute: string;
  meetingFormat: string;
  preferredDateTime: string;
  practiceArea: string;
  otherPracticeArea: string;
  jurisdiction: string;
  languageRequirement: string;
  issueSummary: string;
  claimValue: string;
  urgency: string;
  supportingDocs: string[];
};

const INITIAL_STATE: FormState = {
  clientType: "",
  fullName: "",
  tradeLicenseNo: "",
  contactPerson: "",
  email: "",
  phone: "",
  emirate: "",
  serviceRoute: "",
  meetingFormat: "",
  preferredDateTime: "",
  practiceArea: "",
  otherPracticeArea: "",
  jurisdiction: "",
  languageRequirement: "",
  issueSummary: "",
  claimValue: "",
  urgency: "",
  supportingDocs: [],
};

const STEPS = ["Your details", "Service & matter", "Issue & documents"];

export default function ClientIntakeForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const isCorporate = form.clientType === "Corporate / Business Entity";
  const isDedicatedConsultation = form.serviceRoute === SERVICE_ROUTES[1].label;

  function validateStep(current: number): string | null {
    if (current === 0) {
      if (!form.clientType) return "Please select a client type.";
      if (!form.fullName.trim()) return "Please enter your full name or entity name.";
      if (isCorporate && !form.tradeLicenseNo.trim())
        return "Please enter your trade license number.";
      if (!form.email.trim()) return "Please enter your email address.";
      if (!form.phone.trim()) return "Please enter your phone / WhatsApp number.";
      if (!form.emirate) return "Please select your primary location / emirate.";
    }
    if (current === 1) {
      if (!form.serviceRoute) return "Please select a service route.";
      if (isDedicatedConsultation && !form.meetingFormat)
        return "Please select a preferred meeting format.";
      if (!form.practiceArea) return "Please select a primary legal practice area.";
      if (form.practiceArea === "Other" && !form.otherPracticeArea.trim())
        return "Please specify your legal practice area.";
      if (!form.jurisdiction) return "Please select a jurisdiction / forum.";
      if (!form.languageRequirement) return "Please select a language requirement.";
    }
    if (current === 2) {
      if (!form.issueSummary.trim())
        return "Please provide a brief summary of your legal issue.";
      if (!form.claimValue) return "Please select an estimated claim / dispute value.";
      if (!form.urgency) return "Please select an urgency level.";
    }
    return null;
  }

  function handleNext() {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function handleSubmit() {
    const err = validateStep(2);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-[1.5rem] border border-[#e5e3dc] bg-[#faf9f6] p-8 md:p-10 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" aria-hidden />
        <h3 className="mt-4 font-serif text-2xl text-ink tracking-tight">
          Brief submitted
        </h3>
        <p className="mt-3 text-gray-600 leading-relaxed max-w-md mx-auto">
          {isDedicatedConsultation
            ? "Thank you. We'll confirm your Dedicated Consultation booking and send payment instructions within 24–48 business hours."
            : "Thank you. We're matching your brief with up to three vetted UAE-licensed providers — proposals typically arrive within 24 business hours."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.5rem] border border-[#e5e3dc] bg-[#faf9f6] p-6 md:p-8">
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1">
            <div
              className={`h-1.5 rounded-full ${
                i <= step ? "bg-primary" : "bg-gray-200"
              }`}
            />
            <p
              className={`mt-2 text-[11px] font-semibold uppercase tracking-wide ${
                i === step ? "text-primary" : "text-gray-400"
              }`}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {step === 0 ? (
        <div className="space-y-6">
          <FieldWrapper label="Client Type" required>
            <RadioGroupField
              name="clientType"
              options={CLIENT_TYPES}
              value={form.clientType}
              onChange={(v) => set("clientType", v)}
            />
          </FieldWrapper>

          <FieldWrapper label="Full Name / Entity Name" required>
            <TextField
              value={form.fullName}
              onChange={(v) => set("fullName", v)}
              placeholder="e.g. John Doe / Acme Tech FZ-LLC"
            />
          </FieldWrapper>

          {isCorporate ? (
            <FieldWrapper label="Trade License No." required>
              <TextField
                value={form.tradeLicenseNo}
                onChange={(v) => set("tradeLicenseNo", v)}
                placeholder="e.g. 12345/2024"
              />
            </FieldWrapper>
          ) : null}

          <FieldWrapper label="Contact Person & Title">
            <TextField
              value={form.contactPerson}
              onChange={(v) => set("contactPerson", v)}
              placeholder="e.g. Founder, CEO, General Counsel"
            />
          </FieldWrapper>

          <div className="grid sm:grid-cols-2 gap-6">
            <FieldWrapper label="Email Address" required>
              <TextField
                type="email"
                value={form.email}
                onChange={(v) => set("email", v)}
                placeholder="e.g. client@company.com"
              />
            </FieldWrapper>
            <FieldWrapper label="Phone / WhatsApp Number" required>
              <TextField
                type="tel"
                value={form.phone}
                onChange={(v) => set("phone", v)}
                placeholder="e.g. +971 50 123 4567"
              />
            </FieldWrapper>
          </div>

          <FieldWrapper label="Primary Location / Emirate" required>
            <RadioGroupField
              name="emirate"
              options={EMIRATES}
              value={form.emirate}
              onChange={(v) => set("emirate", v)}
            />
          </FieldWrapper>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-6">
          <FieldWrapper label="Selected Service Route" required>
            <RadioGroupField
              name="serviceRoute"
              options={SERVICE_ROUTES.map((r) => r.label)}
              value={form.serviceRoute}
              onChange={(v) => set("serviceRoute", v)}
              descriptions={Object.fromEntries(
                SERVICE_ROUTES.map((r) => [r.label, r.detail]),
              )}
            />
          </FieldWrapper>

          {isDedicatedConsultation ? (
            <>
              <FieldWrapper label="Preferred Meeting Format" required>
                <RadioGroupField
                  name="meetingFormat"
                  options={MEETING_FORMATS}
                  value={form.meetingFormat}
                  onChange={(v) => set("meetingFormat", v)}
                />
              </FieldWrapper>
              <FieldWrapper label="Preferred Consultation Date & Time Range">
                <TextField
                  value={form.preferredDateTime}
                  onChange={(v) => set("preferredDateTime", v)}
                  placeholder="e.g. Monday – Wednesday between 10:00 AM – 2:00 PM GST"
                />
              </FieldWrapper>
            </>
          ) : null}

          <FieldWrapper label="Primary Legal Practice Area" required>
            <RadioGroupField
              name="practiceArea"
              options={PRACTICE_AREA_OPTIONS}
              value={form.practiceArea}
              onChange={(v) => set("practiceArea", v)}
            />
          </FieldWrapper>

          {form.practiceArea === "Other" ? (
            <FieldWrapper label="Please specify" required>
              <TextField
                value={form.otherPracticeArea}
                onChange={(v) => set("otherPracticeArea", v)}
                placeholder="Describe your legal practice area"
              />
            </FieldWrapper>
          ) : null}

          <FieldWrapper label="Jurisdiction / Forum" required>
            <RadioGroupField
              name="jurisdiction"
              options={JURISDICTIONS}
              value={form.jurisdiction}
              onChange={(v) => set("jurisdiction", v)}
            />
          </FieldWrapper>

          <FieldWrapper label="Language Requirement" required>
            <RadioGroupField
              name="languageRequirement"
              options={LANGUAGE_REQUIREMENTS}
              value={form.languageRequirement}
              onChange={(v) => set("languageRequirement", v)}
            />
          </FieldWrapper>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-6">
          <FieldWrapper
            label="Brief Summary of Legal Issue / Dispute"
            required
            hint="Please describe the background, key dates, opposing parties, and your core objectives."
          >
            <TextAreaField
              value={form.issueSummary}
              onChange={(v) => set("issueSummary", v)}
              placeholder="Tell us what happened..."
            />
          </FieldWrapper>

          <FieldWrapper label="Estimated Claim / Dispute Value (If Applicable)" required>
            <RadioGroupField
              name="claimValue"
              options={CLAIM_VALUE_RANGES}
              value={form.claimValue}
              onChange={(v) => set("claimValue", v)}
            />
          </FieldWrapper>

          <FieldWrapper label="Urgency Level" required>
            <RadioGroupField
              name="urgency"
              options={URGENCY_LEVELS}
              value={form.urgency}
              onChange={(v) => set("urgency", v)}
            />
          </FieldWrapper>

          <FieldWrapper label="Supporting Documents Available">
            <CheckboxGroupField
              options={SUPPORTING_DOCS}
              values={form.supportingDocs}
              onChange={(v) => set("supportingDocs", v)}
            />
          </FieldWrapper>
        </div>
      ) : null}

      {error ? (
        <p className="mt-6 text-sm font-medium text-red-600">{error}</p>
      ) : null}

      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(s - 1, 0))}
          className={`text-sm font-semibold text-ink/70 hover:text-ink ${
            step === 0 ? "invisible" : ""
          }`}
        >
          ← Back
        </button>
        {step < STEPS.length - 1 ? (
          <GradientButton size="md" onClick={handleNext}>
            Continue
          </GradientButton>
        ) : (
          <GradientButton size="md" onClick={handleSubmit}>
            Submit Brief
          </GradientButton>
        )}
      </div>
    </div>
  );
}
