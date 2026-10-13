import type { Metadata } from "next";
import Link from "next/link";
import {
  MarketingSection,
  PageHero,
} from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Privacy Policy | Barristrly",
  description:
    "Privacy Policy for Barristrly's legal technology aggregator and client intake concierge platform — how we collect, use, disclose, and protect your data under UAE PDPL.",
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
    title: "1. Introduction and Scope",
    paragraphs: [
      "1.1 Applicability. This Privacy Policy (\"Policy\") describes how Barristrly (\"Company\", \"we\", \"us\", or \"our\") collects, uses, discloses, and protects information when you access our website, mobile applications, intake wizards, and concierge services (collectively, the \"Platform\"). This Policy operates alongside, and should be read together with, our Terms and Conditions.",
      "1.2 Consent. By submitting a legal intake brief, booking a Dedicated Consultation, or otherwise using the Platform, you consent to the collection and processing of your information as described in this Policy.",
      "1.3 Regulatory Framework. We process personal data in accordance with UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL), and, where applicable to a given matter or Service Provider, the DIFC Data Protection Law and the ADGM Data Protection Regulations.",
    ],
  },
  {
    id: "2",
    title: "2. Information We Collect",
    paragraphs: [
      "We collect only the information reasonably necessary to operate the Platform, match Clients with Service Providers, and process payments:",
    ],
    bullets: [
      "2.1 Client Account & Contact Information — name, email address, phone number, and sign-in credentials.",
      "2.2 Legal Intake Brief Content — jurisdiction, practice area, matter description, supporting documents, and any other information you voluntarily submit through our guided wizard.",
      "2.3 Consultation & Payment Information — booking details for Dedicated Consultations and payment card or digital wallet authorization tokens, processed via our PCI-DSS-compliant third-party payment gateway. Barristrly does not store full card numbers.",
      "2.4 Service Provider Credentials — for Advocates, Law Firms, Legal Consultants, Tax Agents, AML Consultants, Notaries, and Sworn Translators: trade license details, practicing certificates (MOJ, Dubai Legal Affairs Department, ADJD, DIFC Courts, ADGM Courts, or FTA), and related onboarding documentation.",
      "2.5 Technical & Usage Data — IP address, browser type, device identifiers, and cookies used to operate and improve the Platform (see Section 5).",
    ],
  },
  {
    id: "3",
    title: "3. How We Use Your Information",
    paragraphs: [
      "We use the information collected to:",
    ],
    bullets: [
      "3.1 Curate and transmit legal intake briefs to up to three (3) vetted, jurisdiction- and practice-area-matched Service Providers under the Free Lawyer Sourcing & Matching option.",
      "3.2 Schedule, confirm, and process payment for Dedicated Consultations.",
      "3.3 Vet and onboard Service Providers, including verifying licensing and credentials.",
      "3.4 Comply with UAE legal, tax (VAT), and anti-money-laundering obligations.",
      "3.5 Operate, secure, and improve the Platform, including fraud prevention and customer support.",
    ],
  },
  {
    id: "4",
    title: "4. Confidentiality of Intake Briefs & Disclosure to Service Providers",
    paragraphs: [
      "4.1 Confidential Treatment. As stated in our Terms, information submitted through the client intake form is treated as confidential.",
      "4.2 Limited Disclosure. Barristrly discloses intake briefs only to vetted Service Providers who have signed confidentiality obligations with Barristrly, and only to the extent necessary for them to evaluate and respond to the request. Barristrly does not sell intake brief content to third parties.",
      "4.3 No Attorney-Client Privilege with Barristrly. Submitting a brief to Barristrly does not create an attorney-client relationship or privilege with Barristrly. Any privilege applicable to your matter arises only once you engage a Service Provider directly.",
      "4.4 Third-Party Handling. Once a Service Provider receives your brief, that Service Provider's own confidentiality and data-handling practices govern their use of your information; Barristrly is not responsible for a Service Provider's independent data practices.",
    ],
  },
  {
    id: "5",
    title: "5. Cookies and Analytics",
    paragraphs: [
      "5.1 We use cookies and similar technologies to operate the Platform, remember preferences, and understand how the Platform is used through analytics tools.",
      "5.2 You can control or disable cookies through your browser settings; disabling certain cookies may limit some Platform features.",
    ],
  },
  {
    id: "6",
    title: "6. Data Retention",
    paragraphs: [
      "6.1 We retain personal data only for as long as necessary to provide the Platform, fulfill the purposes described in this Policy, and comply with UAE tax, financial, and legal record-keeping obligations.",
      "6.2 Billing records and transaction logs required for VAT and audit compliance may be retained beyond account closure as required by law.",
    ],
  },
  {
    id: "7",
    title: "7. Your Rights",
    paragraphs: [
      "Subject to applicable UAE PDPL (and DIFC/ADGM rules where relevant), you may request to:",
    ],
    bullets: [
      "7.1 Access the personal data we hold about you.",
      "7.2 Request correction of inaccurate data.",
      "7.3 Request deletion of your account data, subject to our legal retention obligations under Section 6.",
      "7.4 Withdraw consent to non-essential processing, such as marketing communications.",
    ],
    note: "To exercise any of these rights, contact us using the details in Section 10.",
  },
  {
    id: "8",
    title: "8. Data Security and Cross-Border Transfers",
    paragraphs: [
      "8.1 Security Measures. We apply industry-standard safeguards, including encryption in transit (TLS) and access controls, to protect your information. No system is completely secure, and we cannot guarantee absolute security of data transmitted to or stored on the Platform.",
      "8.2 Cross-Border Processing. Data may be processed or stored on cloud infrastructure located outside the UAE. Where this occurs, we require appropriate contractual and technical safeguards consistent with PDPL requirements.",
    ],
  },
  {
    id: "9",
    title: "9. Changes to this Policy",
    paragraphs: [
      "We may update this Policy from time to time to reflect changes in our practices or legal requirements. Material changes will be indicated by updating the Effective Date above, and continued use of the Platform after such changes constitutes acceptance of the revised Policy.",
    ],
  },
  {
    id: "10",
    title: "10. Contact Information",
    paragraphs: [
      "For questions regarding this Privacy Policy, or to exercise your data rights, please contact:",
    ],
    bullets: [
      "Legal & Operations Team: Barristrly",
      "Email: support@barristrly.com",
      "Location: Dubai, United Arab Emirates",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How Barristrly collects, uses, discloses, and protects your data across our website and MVP matchmaking services."
      >
        <Link
          href="/terms"
          className="text-sm font-semibold text-primary hover:text-primary-hover"
        >
          View Terms and Conditions →
        </Link>
      </PageHero>

      <MarketingSection tight>
        <div className="max-w-3xl rounded-2xl border border-primary/25 bg-primary/5 px-6 py-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Document summary
          </p>
          <p className="text-sm text-ink leading-relaxed">
            Effective Date: {EFFECTIVE_DATE}. Operating Entity: Barristrly
            Platform (United Arab Emirates).
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Barristrly is a legal technology aggregator and client intake
            concierge platform. This Policy explains what information we
            collect through our intake wizard and consultation booking flow,
            how it is shared with independent Service Providers, and your
            rights under UAE data protection law.
          </p>
        </div>
      </MarketingSection>

      <MarketingSection>
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
