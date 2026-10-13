"use client";

import { useState } from "react";
import { CheckCircle2, Upload } from "lucide-react";
import GradientButton from "@/components/ui/gradient-button";
import {
  FieldWrapper,
  TextField,
  RadioGroupField,
  CheckboxGroupField,
} from "@/components/ui/form-fields";
import {
  PROVIDER_CLASSIFICATIONS,
  LICENSING_AUTHORITIES,
  PRACTITIONER_COUNTS,
  COURT_RIGHTS_OF_AUDIENCE,
  CORE_PRACTICE_AREAS_PROVIDER,
  PROVIDER_LANGUAGES,
  VERIFICATION_UPLOADS,
} from "@/lib/marketing/intake-form";

type FormState = {
  classifications: string[];
  firmName: string;
  tradeLicenseNo: string;
  licensingAuthority: string;
  officeAddress: string;
  websiteUrl: string;
  contactPerson: string;
  mobile: string;
  email: string;
  practitionerCount: string;
  courtRights: string[];
  corePracticeAreas: string[];
  industryExpertise: string;
  languages: string[];
  slaAcknowledge: boolean;
  slaFeeQuotes: boolean;
  paidConsultationParticipation: string;
  uploads: Record<string, File | null>;
};

const INITIAL_STATE: FormState = {
  classifications: [],
  firmName: "",
  tradeLicenseNo: "",
  licensingAuthority: "",
  officeAddress: "",
  websiteUrl: "",
  contactPerson: "",
  mobile: "",
  email: "",
  practitionerCount: "",
  courtRights: [],
  corePracticeAreas: [],
  industryExpertise: "",
  languages: [],
  slaAcknowledge: false,
  slaFeeQuotes: false,
  paidConsultationParticipation: "",
  uploads: {},
};

const PAID_CONSULTATION_OPTIONS = [
  "YES, our senior practitioners are available to conduct paid 45–60 min strategy meetings (AED 1,000 + VAT) assigned by Barristrly.",
  "NO, we only accept full case retentions and litigation mandates.",
];

export default function ProviderOnboardingForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function handleSubmit() {
    if (form.classifications.length === 0)
      return setError("Please select at least one provider classification.");
    if (!form.firmName.trim())
      return setError("Please enter your firm / company name.");
    if (!form.tradeLicenseNo.trim())
      return setError("Please enter your trade license / registration number.");
    if (!form.licensingAuthority)
      return setError("Please select your licensing authority.");
    if (!form.officeAddress.trim())
      return setError("Please enter your primary office address.");
    if (!form.contactPerson.trim())
      return setError("Please enter the managing partner / contact person.");
    if (!form.mobile.trim())
      return setError("Please enter a direct mobile / WhatsApp number.");
    if (!form.email.trim())
      return setError("Please enter an official email for lead delivery.");
    if (!form.practitionerCount)
      return setError("Please select the number of licensed practicing lawyers / advisors.");
    if (form.corePracticeAreas.length === 0)
      return setError("Please select at least one core practice area.");
    if (form.languages.length === 0)
      return setError("Please select at least one supported language.");
    if (!form.slaAcknowledge || !form.slaFeeQuotes)
      return setError("Please accept both SLA commitment statements to proceed.");
    if (!form.paidConsultationParticipation)
      return setError("Please confirm your paid consultation participation.");

    setError(null);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-[1.5rem] border border-[#e5e3dc] bg-[#faf9f6] p-8 md:p-10 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" aria-hidden />
        <h3 className="mt-4 font-serif text-2xl text-ink tracking-tight">
          Application received
        </h3>
        <p className="mt-3 text-gray-600 leading-relaxed max-w-md mx-auto">
          Thank you for applying to the Barristrly network. We'll review your
          credentials and verification uploads and follow up at the email
          provided once your profile is activated.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <h3 className="font-serif text-xl text-ink tracking-tight">
          Section A — Service Provider Profile &amp; Entity Type
        </h3>

        <FieldWrapper label="Provider Classification" required hint="Select all that apply">
          <CheckboxGroupField
            options={PROVIDER_CLASSIFICATIONS}
            values={form.classifications}
            onChange={(v) => set("classifications", v)}
          />
        </FieldWrapper>

        <FieldWrapper label="Firm / Company Name" required>
          <TextField
            value={form.firmName}
            onChange={(v) => set("firmName", v)}
            placeholder="e.g. Al Hashmi Advocates & Legal Consultants"
          />
        </FieldWrapper>

        <div className="grid sm:grid-cols-2 gap-6">
          <FieldWrapper label="Trade License / Registration No." required>
            <TextField
              value={form.tradeLicenseNo}
              onChange={(v) => set("tradeLicenseNo", v)}
              placeholder="e.g. DED-789012"
            />
          </FieldWrapper>
          <FieldWrapper label="Website URL / LinkedIn Page">
            <TextField
              value={form.websiteUrl}
              onChange={(v) => set("websiteUrl", v)}
              placeholder="e.g. www.lawfirm.ae"
            />
          </FieldWrapper>
        </div>

        <FieldWrapper label="Licensing Authority" required>
          <RadioGroupField
            name="licensingAuthority"
            options={LICENSING_AUTHORITIES}
            value={form.licensingAuthority}
            onChange={(v) => set("licensingAuthority", v)}
          />
        </FieldWrapper>

        <FieldWrapper label="Primary Office Address" required>
          <TextField
            value={form.officeAddress}
            onChange={(v) => set("officeAddress", v)}
            placeholder="Building Name, Office No., Emirate"
          />
        </FieldWrapper>
      </section>

      <section className="space-y-6">
        <h3 className="font-serif text-xl text-ink tracking-tight">
          Section B — Primary Contact &amp; Key Practitioner Information
        </h3>

        <FieldWrapper label="Managing Partner / Contact Person" required>
          <TextField
            value={form.contactPerson}
            onChange={(v) => set("contactPerson", v)}
            placeholder="Full Name & Title"
          />
        </FieldWrapper>

        <div className="grid sm:grid-cols-2 gap-6">
          <FieldWrapper label="Direct Mobile / WhatsApp" required>
            <TextField
              type="tel"
              value={form.mobile}
              onChange={(v) => set("mobile", v)}
              placeholder="e.g. +971 50 987 6543"
            />
          </FieldWrapper>
          <FieldWrapper label="Official Email for Lead Delivery" required>
            <TextField
              type="email"
              value={form.email}
              onChange={(v) => set("email", v)}
              placeholder="e.g. intake@lawfirm.ae"
            />
          </FieldWrapper>
        </div>

        <FieldWrapper label="Number of Licensed Practicing Lawyers / Advisors" required>
          <RadioGroupField
            name="practitionerCount"
            options={PRACTITIONER_COUNTS}
            value={form.practitionerCount}
            onChange={(v) => set("practitionerCount", v)}
          />
        </FieldWrapper>

        <FieldWrapper label="Court Right of Audience" hint="For advocates">
          <CheckboxGroupField
            options={COURT_RIGHTS_OF_AUDIENCE}
            values={form.courtRights}
            onChange={(v) => set("courtRights", v)}
          />
        </FieldWrapper>
      </section>

      <section className="space-y-6">
        <h3 className="font-serif text-xl text-ink tracking-tight">
          Section C — Specialization &amp; Practice Area Selection
        </h3>

        <FieldWrapper label="Core Practice Areas Covered" required hint="Check all that apply">
          <CheckboxGroupField
            options={CORE_PRACTICE_AREAS_PROVIDER}
            values={form.corePracticeAreas}
            onChange={(v) => set("corePracticeAreas", v)}
          />
        </FieldWrapper>

        <FieldWrapper label="Specialized Industry Expertise">
          <TextField
            value={form.industryExpertise}
            onChange={(v) => set("industryExpertise", v)}
            placeholder="e.g. Real Estate Developers, Tech Startups, Crypto/Web3, Logistics"
          />
        </FieldWrapper>

        <FieldWrapper label="Languages Supported in Practice" required>
          <CheckboxGroupField
            options={PROVIDER_LANGUAGES}
            values={form.languages}
            onChange={(v) => set("languages", v)}
          />
        </FieldWrapper>
      </section>

      <section className="space-y-6">
        <h3 className="font-serif text-xl text-ink tracking-tight">
          Section D — Platform SLA Commitment &amp; Verification Terms
        </h3>

        <FieldWrapper label="Service Level Agreement (SLA) Acceptance" required>
          <div className="space-y-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm hover:border-primary/30">
              <input
                type="checkbox"
                checked={form.slaAcknowledge}
                onChange={(e) => set("slaAcknowledge", e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]"
              />
              <span className="text-ink">
                YES, we commit to acknowledging and responding to client lead
                briefs within 24 business hours.
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm hover:border-primary/30">
              <input
                type="checkbox"
                checked={form.slaFeeQuotes}
                onChange={(e) => set("slaFeeQuotes", e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]"
              />
              <span className="text-ink">
                YES, we agree to provide transparent, itemized fee quotes for
                matched client inquiries.
              </span>
            </label>
          </div>
        </FieldWrapper>

        <FieldWrapper label="Paid Consultation Participation" required>
          <RadioGroupField
            name="paidConsultationParticipation"
            options={PAID_CONSULTATION_OPTIONS}
            value={form.paidConsultationParticipation}
            onChange={(v) => set("paidConsultationParticipation", v)}
          />
        </FieldWrapper>

        <FieldWrapper label="Required Verification Uploads" hint="To be attached">
          <div className="space-y-2">
            {VERIFICATION_UPLOADS.map((label, i) => (
              <label
                key={label}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
              >
                <span className="text-ink">
                  {i + 1}. {label}
                </span>
                <span className="relative inline-flex items-center gap-2 text-xs font-semibold text-primary">
                  <Upload className="h-3.5 w-3.5" aria-hidden />
                  {form.uploads[label]?.name ?? "Choose file"}
                  <input
                    type="file"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={(e) =>
                      set("uploads", {
                        ...form.uploads,
                        [label]: e.target.files?.[0] ?? null,
                      })
                    }
                  />
                </span>
              </label>
            ))}
          </div>
        </FieldWrapper>
      </section>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <div className="flex justify-end">
        <GradientButton size="md" onClick={handleSubmit}>
          Submit Application
        </GradientButton>
      </div>
    </div>
  );
}
