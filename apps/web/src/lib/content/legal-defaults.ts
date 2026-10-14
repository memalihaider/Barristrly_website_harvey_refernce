/**
 * Default Terms & Privacy content. Used when no edited version has been
 * saved from the Super Admin portal, and as the editor's starting point.
 */

export type Clause = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  note?: string;
};

export const TERMS_EFFECTIVE_DATE = "October 9, 2026";

export const TERMS_SECTIONS: Clause[] = [
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

export const PRIVACY_EFFECTIVE_DATE = "October 9, 2026";

export const PRIVACY_SECTIONS: Clause[] = [
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
