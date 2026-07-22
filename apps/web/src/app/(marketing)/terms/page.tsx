import type { Metadata } from "next";
import {
  MarketingSection,
  PageHero,
} from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Terms and Conditions | Barristrly",
  description:
    "Master User Agreement for the Barristrly legal tech aggregator marketplace — tech-only intermediary status, liability shield, anonymity, and conflict engine terms.",
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
    title: "1. Definitions and defined parties",
    bullets: [
      "1.1 “The Company” (also “the Platform”, “We”, “Us”, “Our”): the corporate legal owner, developers, co-founders, joint operators, managers, subsidiaries, parent companies, and technical service networks managing this aggregator engine.",
      "1.2 “Client”: any natural person, corporate group, legal department, representative, or organizational entity registering an account or utilizing system links to purchase, evaluate, or seek exploratory advice or consultation from independent providers.",
      "1.3 “Service Provider” or “Expert” or “Lawyer”: any independent external attorney, legal consultant, jurist, industry technical advisor, certified practitioner, or professional registered on the platform network to offer anonymous scheduling, compatibility evaluation, or consultation services.",
      "1.4 “Third-Party Advertisers”: independent institutional entities buying banner space, native scripts, hyperlinks, or lead redirection paths through the Platform, including retail banks, mortgage brokers, real estate agencies, asset brokers, and corporate setup operators.",
      "1.5 “User”: collectively any Client, Lawyer, Expert, Service Provider, or Advertiser who enters the digital infrastructure of the site.",
    ],
  },
  {
    id: "2",
    title: "2. Tech-only aggregator matrices & exclusion of attorney relationships",
    paragraphs: [
      "2.1 Pure Passive Intermediary Status. Barristrly functions solely as an infrastructure and discovery aggregator connecting Clients with independent licensed Lawyers and other Service Providers. The platform operates strictly as a digital technology tool, not a professional practice provider. The User acknowledges that the platform is a technology conduit and legal tech aggregator directory. The platform does not operate as a law firm, does not possess a professional practice license, does not provide legal representation, and is structurally incapable of delivering legal counsel or strategic intervention.",
      "2.2 Complete Absence of Platform Fiduciary Obligations. Barristrly holds zero liability for professional legal malpractice, negligence, missed filing deadlines, erroneous advice, or ethical breaches by Lawyers or Experts engaged via the platform. Similarly, Barristrly is not liable for fraudulent credentials, default on financial obligations, or bad-faith representations by Client Users. Scheduling a compatibility evaluation or holding a video, phone, or text consultation never establishes an attorney-client relationship between the Company and any Client or User. The Company has zero fiduciary, ethical, or administrative duties toward the Client concerning case files or legal positions discussed.",
      "2.3 Total Separation from Professional Output. No administrative communications with Barristrly corporate staff or triage support trigger attorney-client privilege. Legal privilege is exclusively restricted to private client–lawyer / Service Provider workspaces established post-contract. Every Service Provider operates under their own professional responsibility. The platform does not control, edit, micro-manage, review, or verify the procedural strategy, content, quality, legal accuracy, or completeness of assessments delivered by an Expert.",
    ],
  },
  {
    id: "3",
    title: "3. Exclusion of liability for difficulties between Clients and Service Providers",
    paragraphs: [
      "3.1 Absolute Operational Separation. The platform is structurally, financially, and legally insulated from disputes, administrative complaints, reputational losses, financial breakdowns, or professional errors within independent relationships formed through its anonymous matching pipelines. Clients and Service Providers agree the platform is not a party to their interactions, agreements, or transactions, and cannot be held liable under any circumstances.",
      "3.2 Scope of Specific Inter-User Exclusions. The Company is completely insulated from liability for issues, damages, or claims arising from:",
    ],
    bullets: [
      "3.2.1 Professional Misconduct or Performance Failures — missed consultations, lateness, unprofessional behavior, or poor communication.",
      "3.2.2 Malpractice and Negligent Legal Evaluation — inaccurate opinions, missed limitation periods, incorrect documentation, or professional negligence.",
      "3.2.3 Client Payment Evasion or Abusive Conduct — unpaid fees, chargebacks, altered case details, or abusive conduct during consultation.",
      "3.2.4 Billing and Hourly Rate Disagreements — billing transparency, unearned retainers, or fee splitting between Client and Expert.",
    ],
    note: "3.3 Refusal of Platform Intervention. The platform will not act as a mediator, judge, arbitrator, or escrow referee for issues between users. Parties must resolve disputes through independent legal channels. The platform will not freeze user fees, hold funds, or provide refunds based on a Client’s subjective assessment of a provider’s performance.",
  },
  {
    id: "4",
    title: "4. Anonymous merit-based directory & technical unmasking boundaries",
    paragraphs: [
      "4.1 Pre-Match Anonymization. To eliminate geographic or firm branding bias and support a meritocratic selection process, the Platform operates an anonymous directory framework. A Lawyer’s firm identity, personal name, brand logos, and specific biographical markers remain hidden from the Client until mutual invitation and acceptance of the matter is formally unlocked.",
      "4.2 Selection on Merit. Clients must select professionals based on objective merit metrics: verified practice areas, historical success counts, language capabilities, and aggregated marketplace performance ratings.",
      "4.3 Review Integrity. Barristrly retains absolute authority to edit, moderate, shadow-ban, or remove client-generated reviews that are defamatory, anticompetitive, malicious, or used for economic extortion against a registered professional.",
      "4.4 System Safeguards. The platform features a double-blind, metadata-stripped connection layer designed to keep identities hidden during initial exploratory meetings. While these security features are built into the product, the Company accepts zero liability if a user’s identity is revealed due to:",
    ],
    bullets: [
      "4.4.1 Voluntary Identity Disclosures — a User reveals name, corporate identity, personal email, phone number, or LinkedIn via chat, live speech, or file transfers. Masking protects platform neutrality; Lawyers or Service Providers exposing their identity in breach of this rule may face a fine of AED 20,000 and immediate ban from the Platform Directory.",
    ],
    note: "4.5 Post-Consultation Data Transition. If the parties agree to step outside the anonymous pipeline and exchange formal retainer documents, personal emails, or real identity elements, all platform protections cease immediately, and the Users assume all associated risks.",
  },
  {
    id: "5",
    title: "5. Mandatory platform-integrated conflict engine",
    paragraphs: [
      "5.1 Automated Screening Interface. Before sensitive case facts are disclosed, documents uploaded, or identities unlocked, the Platform enforces an integrated, multi-party conflict-of-interest check. Clients must input truthful identification metadata for themselves and all opposing/adverse parties before being matched.",
      "5.2 Vetting Limitations. This automated check is an auxiliary technical filter for convenience. It does NOT replace or fulfill the manual conflict verification duties required of licensed Lawyers by their respective regulatory bars and licensing associations.",
      "5.3 Client Input Risk. The Client is entirely responsible for the accuracy of conflict entries. The platform is not liable for missed conflicts, disqualified cases, or wasted fees caused by misspelled names, alias omissions, or fraudulent entry strings.",
      "5.4 Provider Ethical Waiver. The Service Provider bears final regulatory responsibility to confirm they are conflict-free. The User waives the right to bring civil lawsuit, claim indemnity, or file administrative data complaints against the platform if the automated script fails to flag a conflict.",
      "5.5 Professional Responsibility. Adverse metadata is securely routed via an encrypted compliance pipeline to the Lawyer’s portal. The individual Lawyer bears the sole professional, ethical, and legal duty to cross-reference their firm’s active and historical database. Barristrly disclaims all structural or legal responsibility for faulty, negligent, or omitted conflict checks executed by a Lawyer or Service Provider.",
    ],
  },
  {
    id: "6",
    title: "6. Third-party banner advertising and financial services integrations",
    paragraphs: [
      "6.1 Ad Networks. The platform may contain banner slots, programmatic text ads, and redirect links managed by Third-Party Advertisers, including commercial retail banks, mortgage brokers, corporate setup providers, and licensed real estate brokerages.",
      "6.2 No Endorsement. The presence of these advertisements does not constitute an endorsement, operational guarantee, or warranty by the Company regarding the financial health, legal compliance, or suitability of the advertiser’s offers.",
      "6.3 Complete Separation of Third-Party Ad Risks. Transactions, account registrations, loan applications, or property purchases with an advertiser are strictly between that User and the Third-Party Advertiser. The platform is insulated from financial losses, deceptive marketing claims, or operational problems resulting from these connections.",
    ],
  },
  {
    id: "7",
    title: "7. Multi-party civil indemnification framework",
    paragraphs: [
      "7.1 Client Obligations to Hold Harmless. To the maximum extent permitted by law, the Client and Users agree to defend, indemnify, and hold harmless the Company, its co-founders, technical staff, and directors from losses, damages, or legal expenses (including attorney fees) arising from: any breach of this User Agreement; reliance on or case losses caused by advice, files, or strategy from an independent Service Provider matched through the platform; or fraudulent or deceptive entries within the automated conflict-checking module.",
      "7.2 Service Provider Obligations to Hold Harmless. To the maximum extent permitted by law, Service Providers and Users agree to defend, indemnify, and hold harmless the Company, its corporate parents, and directors from malpractice judgments, bar complaints, administrative fines, or civil litigation expenses arising from: professional negligence, malpractice, ethical violations, omissions, or misrepresentations during a platform session or subsequent engagement; violations of local bar rules regarding client acquisition, fee splitting, or unauthorized digital legal practice; and fee-related disputes, collection actions, or private escrow challenges initiated against the Client.",
    ],
  },
  {
    id: "8",
    title: "8. Limitation of liability and maximum indemnity financial ceiling",
    paragraphs: [
      "Under no circumstances and under no legal theory (whether contract, tort, negligence, strict liability, or equitable principle) shall the Company, its co-founders, owners, shareholders, or directors be liable to any User for any indirect, consequential, incidental, special, exemplary, or punitive damages. This recovery shield applies to claims for loss of business revenue, operational profits, client case dissolution, system timeouts, or emotional distress.",
      "Maximum Monetary Indemnity Ceiling. The total aggregate civil liability of the Company for any validated claims, actions, judgments, or proven damages shall under no circumstances exceed the total amount of tech utility fees actually paid by the specific disputing User to the Company during the exact three (3) month period immediately preceding the event giving rise to liability. If no platform utility fees have been transferred, the total cumulative financial ceiling is fixed at a maximum of 500 AED.",
    ],
  },
  {
    id: "9",
    title: "9. System protection and right to suspend",
    paragraphs: [
      "9.1 Enforcement Privileges. The Company maintains an unreviewable right to suspend, lock, or permanently delete any User account without prior notice or refund if we detect activities that threaten platform operation, including: (a) attempts to reverse-engineer matching or conflict screening algorithms; (b) circumvention of billing systems to avoid fees; or (c) toxic, abusive, or unprofessional actions directed at platform staff or other users.",
    ],
  },
  {
    id: "10",
    title: "10. Proprietary VoIP scheduler & anti-circumvention covenants",
    paragraphs: [
      "10.1 Embedded VoIP Environment. All discovery online consultations, meetings, and video calls must take place strictly within Barristrly’s proprietary, end-to-end encrypted Voice over IP (VoIP) and digital scheduling workspace.",
      "10.2 Anti-Circumvention Restraints. Both Clients and Lawyers are strictly prohibited from moving communication or billing off-platform to external services (e.g., personal Zoom, Microsoft Teams, WhatsApp Business, standard telephony, or off-market physical offices) prior to logging a formal engagement contract or without the platform’s prior permission. Bypassing the platform architecture will result in immediate permanent account termination and liquidated damages of 50,000 AED per violation payable to Barristrly by the firm engaging in such violations.",
      "10.3 Network Disclaimer. Barristrly makes no warranty regarding absolute uptime or audio/video packet perfection. The Platform is insulated from missed court appearances or lapsed deadlines resulting from localized network disconnects or cloud routing errors.",
    ],
  },
  {
    id: "11",
    title: "11. Financial isolation & billing dispute protection",
    paragraphs: [
      "11.1 Complete Separation of Retainers. Barristrly collects platform licensing, subscription tier, qualified lead acquisition, online meeting, and booking software fees only. The platform never holds, manages, or escrows client legal retainers within its corporate operational accounts.",
      "11.2 Dispute Insulation. All financial contract disagreements, unearned fee recoveries, or chargeback actions are strictly isolated between the contracting Client and Lawyer or Service Provider. Barristrly is clear of all localized billing arbitration.",
    ],
  },
  {
    id: "12",
    title: "12. Governing law, forum selection, and severability",
    paragraphs: [
      "12.1 Governing Law. This Agreement and any legal disputes emerging from its terms shall be interpreted, governed, and enforced according to the laws of the jurisdiction where the Company is formally incorporated and domiciled, disregarding conflict of laws principles.",
      "12.2 Forum Selection. Any legal filing, arbitration request, or court petition initiated by a User against the Company must be submitted exclusively to the competent judicial courts of the city where the Company holds its registered principal corporate headquarters. Users waive any rights to claim an inconvenient forum or move venues.",
      "12.3 Structural Severability. If any clause of this text is found by an authorized court to be legally invalid, void, or unenforceable, that finding shall not alter the legality and validity of the remaining segments of this Agreement, which shall remain in full force.",
    ],
  },
  {
    id: "13",
    title: "13. Updates to these Terms and Conditions",
    paragraphs: [
      "We may update these Terms and Conditions from time to time in response to changing legal, regulatory, technical, or business developments. When we update this notice, we will take appropriate measures to inform you, consistent with the significance of the changes we make.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms and Conditions of Service"
        description="Master User Agreement for the Barristrly Legal Tech Aggregator Marketplace Platform — operational terms of service and liability shield."
      />

      <MarketingSection tight>
        <div className="max-w-3xl rounded-2xl border border-primary/25 bg-primary/5 px-6 py-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Important notice
          </p>
          <p className="text-sm text-ink leading-relaxed">
            Barristrly is a technology aggregator platform. It is not a law firm,
            does not provide formal legal advice, does not employ lawyers, and
            does not participate in any attorney-client relationship. All legal
            services are provided exclusively by independent licensed
            practitioners registered on the marketplace index.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            This platform functions exclusively as a passive technology
            infrastructure facilitator, legal tech aggregator, and scheduling
            vector. Under no circumstances does the platform control, guarantee,
            underwrite, or referee the performance, conduct, communication
            quality, billing honesty, or strategic outcomes of independent
            relationships formed through its anonymous match pipelines.
            Difficulties between Clients and Service Providers (including
            lawyers, experts, banks, and real estate agencies) must be handled
            entirely away from the platform.
          </p>
        </div>
      </MarketingSection>

      <MarketingSection>
        <p className="max-w-3xl text-gray-600 leading-relaxed mb-12">
          These Terms and Conditions constitute a legally binding agreement made
          between you, whether personally or on behalf of an entity (“User”,
          “Client”, or “Lawyer”) and Barristrly (“Platform”, “we”, “us”, or
          “our”), concerning your access to and use of the Barristrly online
          legal technology aggregator marketplace, integrated compliance tools,
          and communication infrastructure.
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
