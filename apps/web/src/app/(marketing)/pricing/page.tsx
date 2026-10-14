import type { Metadata } from "next";
import GradientButton from "@/components/ui/gradient-button";
import {
  FeatureList,
  MarketingCtaBand,
  MarketingSection,
  PageHero,
  SectionIntro,
} from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Pricing | Barristrly",
  description:
    "Free Lawyer Sourcing & Matching, a Dedicated Legal Consultation at AED 1,000 + 5% VAT, Legal Retainers from AED 6,999/month, and Fixed-Fee Legal Solutions.",
};

const OPTIONS = [
  {
    eyebrow: "Option 1",
    title: "Free Lawyer Sourcing & Matching",
    price: "FREE",
    priceDetail: "0 AED",
    body: "Submit a legal intake brief via our guided wizard. We curate and transmit it to up to three (3) vetted UAE-licensed Service Providers matching your jurisdiction (Mainland Dubai/Abu Dhabi Courts, DIFC, ADGM, RDC, MOHRE) and practice area.",
    deliverables: [
      "Up to 3 curated fee proposals from vetted advocates",
      "24-hour SLA response from Service Providers",
      "Zero platform charge for Clients",
    ],
    ctaLabel: "Submit Brief — Get Matched",
    ctaHref: "/ai/intake",
    variant: "outline" as const,
  },
  {
    eyebrow: "Option 2",
    title: "Dedicated 45–60 Minute Legal Consultation",
    price: "AED 1,000",
    priceDetail: "+ 5% VAT = AED 1,050 total",
    body: "Book a 1-on-1 legal strategy session with a specialized senior practitioner. Payment is completed in full via our secure payment gateway prior to meeting confirmation.",
    deliverables: [
      "Private 45–60 min meeting (video/in-person)",
      "Pre-meeting document review",
      "Post-meeting summary roadmap",
    ],
    ctaLabel: "Book Consultation Now",
    ctaHref: "/ai/intake",
    variant: "primary" as const,
  },
  {
    id: "retainers",
    eyebrow: "Option 3",
    title: "Legal Retainer Services",
    price: "AED 6,999",
    priceDetail: "/ month",
    body: "Enjoy ongoing, dedicated legal support to safeguard your business operations.",
    deliverables: [
      "10 Hours of Monthly Legal Expertise: Dedicated consultation and advisory on demand.",
      "Contract & Agreement Drafting: Custom drafting, review, and tailored contract solutions.",
      "Priority Access: Streamlined legal assistance with fast turnaround times.",
      "Custom Solutions: Contact us to learn more about tailored retainers for your business.",
    ],
    ctaLabel: "Enquire About Retainers",
    ctaHref: "/request-demo",
    variant: "primary" as const,
  },
  {
    id: "fixed-fee",
    eyebrow: "Option 4",
    title: "Fixed-Fee Legal Solutions",
    price: "Custom",
    priceDetail: "Fixed Pricing",
    body: "Predictable, transparent legal advice without hidden costs or surprises.",
    deliverables: [
      "Fixed-Price Legal Consultation: Expert advice tailored to your specific legal queries.",
      "Bespoke Agreement & Document Drafting: Standard and complex legal drafting at agreed fixed rates.",
      "Project-Based Advisory: Contact us to request a customized quote for your needs.",
    ],
    ctaLabel: "Request a Fixed-Fee Quote",
    ctaHref: "/request-demo",
    variant: "outline" as const,
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Clear, transparent pricing options"
        description="All prices are stated in AED. A 5% VAT applies to taxable services and is itemized at checkout, in compliance with UAE Federal Decree-Law No. 8 of 2017."
      />

      <MarketingSection>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {OPTIONS.map((option) => (
            <div
              key={option.title}
              id={"id" in option ? option.id : undefined}
              className="scroll-mt-28 rounded-2xl border border-gray-200 bg-[#fafaf9] p-7 md:p-8 flex flex-col"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary mb-3">
                {option.eyebrow}
              </span>
              <h2 className="font-serif text-2xl text-ink tracking-tight">
                {option.title}
              </h2>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="font-serif text-3xl text-ink tracking-tight">
                  {option.price}
                </span>
                <span className="text-sm text-gray-500">{option.priceDetail}</span>
              </div>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                {option.body}
              </p>
              <ul className="mt-6 space-y-2.5 list-none p-0 m-0">
                {option.deliverables.map((f) => {
                  const [label, detail] = f.includes(": ")
                    ? [f.slice(0, f.indexOf(": ")), f.slice(f.indexOf(": ") + 2)]
                    : [null, f];
                  return (
                    <li key={f} className="text-sm text-ink/80 flex gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span>
                        {label && (
                          <span className="font-semibold text-ink">{label}: </span>
                        )}
                        {detail}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-8">
                <GradientButton
                  href={option.ctaHref}
                  size="sm"
                  variant={option.variant}
                  className="w-full justify-center"
                >
                  {option.ctaLabel}
                </GradientButton>
              </div>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection tone="soft">
        <SectionIntro
          title="Billing & refunds"
          description="Rescheduling, cancellations, and refund policy for Dedicated Consultations."
        />
        <FeatureList
          items={[
            {
              title: "Rescheduling & cancellation",
              body: "You may reschedule a confirmed consultation with at least 24 hours' prior written notice. Cancellations made less than 24 hours before the scheduled meeting, or no-shows, are non-refundable.",
            },
            {
              title: "Failure to match within 48 hours",
              body: "If we fail to match or schedule you for a Dedicated Consultation within 48 business hours of payment, you receive a 100% full refund to your original payment method.",
            },
            {
              title: "Once the consultation is held",
              body: "After a 45–60 minute consultation has been conducted by a Service Provider, the service is deemed rendered in full, and no refunds will be issued.",
            },
            {
              title: "VAT compliance",
              body: "A 5% VAT applies to all taxable services rendered by Barristrly and is clearly itemized at checkout, per UAE Federal Decree-Law No. 8 of 2017.",
            },
          ]}
        />
      </MarketingSection>

      <MarketingCtaBand
        title="Not sure which option fits?"
        description="Submit your brief for a free match, or go straight to booking a dedicated consultation."
        primaryHref="/ai/intake"
        primaryLabel="Submit Your Legal Brief — Free Match"
        secondaryHref="/request-demo"
        secondaryLabel="Talk to us"
      />
    </>
  );
}
