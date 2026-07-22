import type { Metadata } from "next";
import Link from "next/link";
import {
  MarketingSection,
  PageHero,
} from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Privacy Policy | Barristrly",
  description:
    "Privacy Policy & Data Protection Master Agreement for the Barristrly anonymous consulting marketplace — data categories, conflict checks, ads, retention, and liability limits.",
};

type Clause = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  note?: string;
};

const SECTIONS: Clause[] = [
  {
    id: "1",
    title: "1. Categories of privacy data ingested",
    paragraphs: [
      "1.1 Segregation of Data Stores. The Company processes separate sets of user information to keep the tech directory functional. We handle account details differently from match processing info.",
    ],
    bullets: [
      "1.1.1 Expert Regulatory Metadata — real name, corporate registration, professional legal license credentials, verified email addresses, telephone numbers, and corporate bank routing profiles used strictly for identity verification, compliance checks, and access subscription processing.",
      "1.1.2 Client User Account Parameters — unique sign-in credentials, email handles (which may be masked/aliased via platform relays), and credit card/digital payment authorization tokens processed via independent PCI-DSS third-party clearing pipelines.",
      "1.1.3 Conflict Filtering Log Arrays — adverse party names, targeted corporate subsidiaries, transactional counterparty identifiers, and generalized legal classification parameters supplied manually by a Client.",
      "1.1.4 Tracking and Ad Delivery Telemetry — device IP footprints, browser technical profiles, geo-location data points, tracking cookie strings, and mobile device identifiers captured via native software kits to serve programmatic third-party ads.",
    ],
  },
  {
    id: "2",
    title: "2. The anonymous routing interface and session transfers",
    paragraphs: [
      "2.1 Architecture and Purpose. The primary technological offering of the Platform consists of a double-blind, metadata-stripped communications framework. The software routing layer is explicitly built to block the transmission of identity markers (such as specific account IDs or source email profiles) between the Client and the Expert during a scheduled online meeting.",
      "2.2 Absolute Exclusion for User-Driven Identity Leaks. Users recognize that video streams, audio lines, and real-time text logs are live transmissions. Barristrly does not actively monitor or scan live conversations for identity leaks. If a Client or Expert explicitly mentions their identity, screen-shares a corporate file with identifiable logos, or states an unmasked phone number, the Platform’s anonymity layer is instantly bypassed. The User and Service Providers waive all claims against Barristrly and the Company for any resulting loss of confidentiality, case compromise, or violation of professional secrecy laws.",
      "2.3 Permanent Session Erasure. Unless strictly compelled by local regulatory bodies, anti-money laundering authorities, or a final order from a court of competent jurisdiction, the Company will not archive, log, or record video/audio consultation streams. Neither party has a right to demand session recordings from the Platform or the Company. Video and audio consultation will only be recorded with the permission of both parties involved and will only be saved with express permission for the same.",
    ],
  },
  {
    id: "3",
    title: "3. Data mechanics of automated conflict of interest checks",
    paragraphs: [
      "3.1 Processing Foundations. To run the conflict of interest algorithm, the Client submits Conflict Filtering Log Arrays. This processing happens automatically through specialized software matching scripts before a referral is finalized.",
      "3.2 System Processing Limits. Conflict data provided by a Client is stripped of narrative case details and cross-referenced against data strings submitted by registered Experts. This processing occurs entirely inside an automated pipeline. This automated check does not guarantee compliance with local bar association regulations. The platform functions as a general tech tool; the comprehensive manual conflict search remains the sole ethical and legal duty of the Lawyer / Expert / Service Provider.",
      "3.3 Shielding of Conflict Data. The Company handles conflict lookup data through isolated databases, kept strictly separate from marketing platforms. If a Client inputs flawed information, Barristrly and the Company accept zero liability if an Expert accidentally reviews a case involving an adverse party due to a misspelled input string.",
    ],
  },
  {
    id: "4",
    title: "4. Programmatic third-party advertising integrations",
    paragraphs: [
      "4.1 Tracking Scripts and Ad Frameworks. The Platform integrates ad delivery code blocks provided by third-party ad networks, tailored for entities such as commercial retail banks, investment providers, corporate services platforms, and licensed real estate brokerages, among others.",
      "4.2 Target Audience Trapping. These tracking systems use cookies, web beacons, and mobile device advertising IDs (such as IDFA or AAID) to serve contextually relevant advertisements within the user experience. By using this platform, you grant explicit consent for these data-sharing practices.",
      "4.3 Isolation from Third-Party Ad Networks. Third-Party Advertisers process data under their own independent privacy terms. Barristrly and the Company exercise no operational control over how banks or real estate networks handle data if a User clicks an external ad banner. The Platform and the Company are completely insulated from any data misuse or fraudulent privacy actions carried out by third-party corporate advertisers.",
    ],
  },
  {
    id: "5",
    title: "5. Information expulsion, retention, and data rights",
    paragraphs: [
      "5.1 Operational Data Longevity. Barristrly and the Company retain personal data only as long as necessary to support active accounts, fulfill explicit corporate administrative tracking requirements, or satisfy statutory tax and security preservation laws.",
      "5.2 Purging Limitations. Users can request the deletion of their core account records at any time. However, certain transaction hashes, billing confirmation logs, and conflict metadata fields cannot be completely purged from active data systems. We retain these records to prevent platform policy circumvention, defend against litigation, or comply with local financial audit rules.",
    ],
  },
  {
    id: "6",
    title: "6. The privacy indemnification protocol",
    paragraphs: [
      "6.1 Indemnity Responsibilities. Clients and Lawyers / Experts / Service Providers agree to defend, protect, and hold harmless Barristrly and the Company, its founders, and technical operators from any financial penalties, regulatory investigations, or data litigation claims arising from:",
    ],
    bullets: [
      "Any intentional upload of malicious software or tracking blocks disguised as text or file shares during anonymous online meetings.",
      "A breach of professional confidentiality or attorney-client privilege caused by a Service Provider / Expert unmasking a Client or storing unauthorized data outside the platform environment.",
      "Any data protection complaints filed by adverse parties due to inaccurate or misleading data inputs provided during the conflict check process.",
    ],
  },
  {
    id: "7",
    title: "7. Global transfers and platform security limitations",
    paragraphs: [
      "7.1 Cross-Border Delivery Systems. The Company operates utilizing decentralized cloud-hosted infrastructure nodes. Information collected via the platform may be transferred across international borders for processing, backup redundancy, and automated routing purposes.",
      "7.2 Acknowledgment of Digital Vulnerabilities. The Company implements industry-standard transport security layers (TLS) and encryption for data at rest. However, no digital transmission channel is completely safe. The User explicitly acknowledges that data submission occurs at their own risk. The Company is completely insulated from liability for third-party cloud data leaks, national security wiretaps, or sophisticated server-side cyberattacks.",
    ],
  },
  {
    id: "8",
    title: "8. Jurisdiction and future adjustments",
    paragraphs: [
      "8.1 Legal Venues. This data policy is governed by and construed in accordance with the laws of the jurisdiction where the Company’s principal business office is incorporated. Any privacy claims or regulatory complaints against the platform must be brought exclusively before the competent courts of that localized city.",
      "8.2 Modifications. The Company reserves the right to update this document at its sole discretion. Continued use of the platform following an update constitutes explicit acceptance of the revised data management framework.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy & Data Protection"
        description="Master agreement governing collection, processing, storage, and cross-border transmission of data on the Barristrly Platform. This document operates concurrently with our Master Terms and Conditions."
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
            Limitation of corporate data compliance liability
          </p>
          <p className="text-sm text-ink leading-relaxed">
            Because this platform operates an anonymous preliminary consulting
            marketplace, data processing is restricted by automated software
            protocols. The ultimate legal burden to refrain from inputting
            unencrypted identity markers rests on the User. The Company
            explicitly disclaims liability under global data protection laws for
            files, messages, and speech contents voluntarily shared between
            Users.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            By interacting with, submitting information to, or scheduling
            consultations via the Platform, both Clients and Experts explicitly
            release Barristrly from data liabilities as specified in this Policy.
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
