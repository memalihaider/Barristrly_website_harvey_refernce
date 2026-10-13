import type { Metadata } from "next";
import {
  MarketingSection,
  PageHero,
} from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Terms and Conditions | Barristrly",
  description:
    "Terms & Conditions for Barristrly's website and MVP matchmaking services — legal technology aggregator and client intake concierge platform operating under UAE law.",
};

type Clause = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  note?: string;
};

const EFFECTIVE_DATE = "October 9, 2026";

const SECTIONS: Clause[] = [
  {
    id: "1",
    title: "1. Introduction and Acceptance of Terms",
    paragraphs: [
      "1.1 Contractual Agreement. These Terms and Conditions (\"Terms\") govern your access to and use of the website, mobile applications, intake wizards, and concierge services (collectively, the \"Platform\") provided by Barristrly (\"Company\", \"we\", \"us\", or \"our\").",
      "1.2 User Consent. By accessing the Platform, submitting a legal intake brief, or booking a consultation, you (\"User\", \"Client\", or \"Service Provider\") agree to be bound by these Terms, as well as our Privacy Policy. If you do not agree to these Terms, you must immediately cease using the Platform.",
      "1.3 Jurisdictional Applicability. The Platform operates under the laws and regulations of the United Arab Emirates (UAE).",
    ],
  },
  {
    id: "2",
    title: "2. Nature of Service & Disclaimer of Legal Representation",
    paragraphs: [
      "2.1 Matchmaking & Sourcing Platform Only. Barristrly is a legal technology aggregator and client intake concierge platform. Barristrly is not a law firm, does not provide legal representation, does not practice law, and does not render direct legal advice.",
      "2.2 No Attorney-Client Relationship. The transmission of information to or from the Platform, or the use of our intake questionnaire, does not establish an attorney-client relationship between you and Barristrly. An attorney-client relationship is strictly formed directly between you (the Client) and the independent, third-party UAE-licensed lawyer or service provider (\"Service Provider\") engaged by you through the Platform.",
      "2.3 Independent Service Providers. All legal advocates, law firms, arbitrators, tax consultants, AML specialists, notaries, and legal translators listed on or matched through the Platform are independent third parties. Barristrly does not employ these professionals directly, nor does it guarantee specific legal outcomes.",
    ],
  },
  {
    id: "3",
    title: "3. Client Intake & Service Options",
    paragraphs: ["Clients utilizing Barristrly can select from two distinct service routes:"],
    bullets: [
      "3.1 Option 1 — Free Lawyer Sourcing & Matching. Scope: Clients submit a legal intake brief via our guided wizard. Barristrly curates and transmits the brief to up to three (3) vetted UAE-licensed Service Providers matching the jurisdiction (Mainland Dubai/Abu Dhabi Courts, DIFC, ADGM, RDC, MOHRE) and practice area. Fees: This matching service is 100% free for Clients.",
      "3.2 Option 2 — Dedicated 45–60 Minute Legal Consultation. Scope: Clients book a 1-on-1 legal strategy session with a specialized senior practitioner. The consultation includes a pre-meeting document review and a summary roadmap provided post-meeting. Pricing & Taxes: The fixed fee for a Dedicated Consultation is AED 1,000 + 5% Value Added Tax (VAT), totaling AED 1,050. Payment Terms: Payment must be completed in full via our secure payment gateway prior to meeting confirmation. Rescheduling & Cancellation: Clients may reschedule a confirmed consultation with at least 24 hours' prior written notice. Cancellations made less than 24 hours prior to the scheduled meeting time, or client no-shows, are non-refundable.",
    ],
  },
  {
    id: "4",
    title: "4. Service Provider Network Onboarding & Obligations",
    paragraphs: [
      "4.1 Vetting & Licensing. All Advocates, Law Firms, Legal Consultants, Tax Agents, AML Consultants, Notaries, and Sworn Translators seeking to join the Barristrly network must complete our Provider Onboarding Form and upload valid credentials, including active UAE Trade Licenses and practicing certificates from the Ministry of Justice (MOJ), Dubai Legal Affairs Department, ADJD, DIFC Courts, ADGM Courts, or Federal Tax Authority (FTA).",
      "4.2 24-Hour SLA Commitment. Participating Service Providers agree to acknowledge incoming lead briefs and provide transparent, itemized fee proposals to Clients within 24 business hours.",
      "4.3 Origination & Administrative Structure. Service Providers participating in the Barristrly network agree that marketing, origination, or administrative platform fees payable to Barristrly are structured strictly in compliance with UAE legal practice frameworks as administrative technology, marketing, and lead generation charges.",
    ],
  },
  {
    id: "5",
    title: "5. Fees, Billing & Refund Policy",
    paragraphs: [
      "5.1 Currency. All prices on the Platform are stated in United Arab Emirates Dirhams (AED).",
      "5.2 VAT Compliance. In compliance with UAE Federal Decree-Law No. 8 of 2017 on Value Added Tax, a 5% VAT applies to all taxable services rendered by Barristrly and will be clearly itemized at checkout.",
    ],
    bullets: [
      "5.3 Refund Policy for Paid Consultations — If Barristrly fails to match or schedule a Client for a Dedicated Consultation within 48 business hours of payment, a 100% full refund will be processed back to the original payment method.",
      "Once a 45–60 minute consultation has been conducted by a Service Provider, the service is deemed rendered in full, and no refunds will be issued.",
    ],
  },
  {
    id: "6",
    title: "6. Confidentiality & Data Protection",
    paragraphs: [
      "6.1 Data Privacy. We handle all user data in accordance with UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL), as well as DIFC and ADGM Data Protection Regulations where applicable.",
      "6.2 Confidentiality of Briefs. Information submitted through our client intake form is treated as confidential. Barristrly discloses intake briefs only to vetted Service Providers who have signed confidentiality obligations and only to the extent necessary to evaluate and match the legal request.",
    ],
  },
  {
    id: "7",
    title: "7. Limitation of Liability & Indemnification",
    paragraphs: [
      "7.1 Platform \"As-Is\". The Platform and matchmaking services are provided on an \"AS IS\" and \"AS AVAILABLE\" basis. Barristrly makes no warranties, express or implied, regarding the accuracy, completeness, or suitability of any legal service provider matched through the Platform.",
      "7.2 Limitation of Damages. To the maximum extent permitted by UAE law, Barristrly, its directors, employees, and partners shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the advice, acts, or omissions of any third-party Service Provider hired through the Platform, or any technical interruptions on the website.",
      "7.3 Indemnification. You agree to defend, indemnify, and hold harmless Barristrly from any claims, damages, liabilities, and expenses arising out of your breach of these Terms or misuse of the Platform.",
    ],
  },
  {
    id: "8",
    title: "8. Governing Law and Dispute Resolution",
    paragraphs: [
      "8.1 Applicable Law. These Terms shall be governed by and construed in accordance with the federal laws of the United Arab Emirates.",
      "8.2 Dispute Resolution. In the event of any dispute arising out of or in connection with these Terms or the use of the Platform, the parties shall first attempt to resolve the dispute amicably through good-faith negotiations with Barristrly management within thirty (30) days. If unresolved, the dispute shall be submitted to the exclusive jurisdiction of the Courts of Dubai (or DIFC Courts / ADGM Courts where applicable).",
    ],
  },
  {
    id: "9",
    title: "9. Contact Information",
    paragraphs: [
      "For questions regarding these Terms, or to report an inquiry regarding a client match or consultation, please contact:",
    ],
    bullets: [
      "Legal & Operations Team: Barristrly",
      "Email: support@barristrly.com",
      "Location: Dubai, United Arab Emirates",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms and Conditions"
        description="Terms & Conditions for Barristrly's website and MVP matchmaking services."
      />

      <MarketingSection tight>
        <div className="max-w-3xl rounded-2xl border border-primary/25 bg-primary/5 px-6 py-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Document summary & legal disclaimer
          </p>
          <p className="text-sm text-ink leading-relaxed">
            Effective Date: {EFFECTIVE_DATE}. Operating Entity: Barristrly
            Platform (United Arab Emirates).
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Key Provision: Barristrly is a legal technology aggregator and
            client intake concierge platform. We are NOT a law firm and do NOT
            provide direct legal representation.
          </p>
        </div>
      </MarketingSection>

      <MarketingSection>
        <p className="max-w-3xl text-gray-600 leading-relaxed mb-12">
          These Terms and Conditions ("Terms") govern your access to and use of
          the website, mobile applications, intake wizards, and concierge
          services (collectively, the "Platform") provided by Barristrly
          ("Company", "we", "us", or "our").
        </p>

        <div className="max-w-3xl space-y-14">
          {SECTIONS.map((section) => (
            <article key={section.id} id={`section-${section.id}`}>
              <h2 className="font-serif text-2xl text-ink tracking-tight">
                {section.title}
              </h2>
              {section.paragraphs?.map((p) => (
                <p
                  key={p.slice(0, 48)}
                  className="mt-4 text-gray-600 leading-relaxed"
                >
                  {p}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mt-4 space-y-3 list-none p-0 m-0">
                  {section.bullets.map((b) => (
                    <li
                      key={b.slice(0, 48)}
                      className="text-gray-600 leading-relaxed pl-4 border-l border-gray-200"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.note ? (
                <p className="mt-4 text-gray-600 leading-relaxed">{section.note}</p>
              ) : null}
            </article>
          ))}
        </div>
      </MarketingSection>
    </>
  );
}
