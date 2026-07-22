import type { Metadata } from "next";
import GradientButton from "@/components/ui/gradient-button";
import {
  CertGrid,
  MarketingCtaBand,
  MarketingSection,
  PageHero,
  SectionIntro,
} from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Security | Barristrly",
  description:
    "Two-gate conflict architecture — client data isolation, blind firm affirmation, and post-unlock quarantine for confidential legal matching.",
};

const FAQS = [
  {
    q: "What is the Two-Gate conflict architecture?",
    a: "Gate 1 collects only matching parameters — client entities and opposing parties — while narrative and documents stay locked. Gate 2 notifies matched firms with a blind payload; client identity and files unlock only after mandatory COI affirmation and successful payment.",
  },
  {
    q: "What do law firms see before they accept a lead?",
    a: "Only an anonymized Case ID, practice area and claim value, and opposing-party / third-party nodes. Client name, narrative, and documents remain hidden until the firm certifies no conflict and payment clears.",
  },
  {
    q: "How are conflicts screened before matching?",
    a: "The COI engine runs fuzzy matching and deterministic ID checks (Emirates ID / passport indexes) on Step A and Step B data held in an isolated Pending Matching store — before any narrative enters the system or maps to firm visibility.",
  },
  {
    q: "What if a conflict appears after unlock?",
    a: "Firms get a 24-hour Report Post-Unlock Conflict control. It revokes case access, clears cached previews, issues a refund or credit, and re-enters the client into the matching pool for the next non-conflicted firm.",
  },
  {
    q: "How do you handle multi-party and name-variation risk?",
    a: "Associated third parties (co-defendant, guarantor, expert, funder) are multi-hop filtered so firms connected within 2–3 degrees are excluded. Individual names use Levenshtein and phonetic matching adapted for Arabic–English transliteration.",
  },
  {
    q: "Do you support enterprise reviews?",
    a: "Yes — security questionnaires, reverse firm whitelists for corporates, and roadmap items (SSO/API, hashed conflict checks) are handled through sales and compliance.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Security"
        title="Trust is part of the product"
        description="Two-gate conflict architecture: isolate matching data before privileged facts enter the system, then unblind counsel only after firm affirmation and payment."
      >
        <GradientButton href="/request-demo" size="lg">
          Request security brief
        </GradientButton>
      </PageHero>

      <MarketingSection tone="soft">
        <SectionIntro title="Controls" />
        <CertGrid
          items={[
            {
              title: "Client registration gate",
              detail:
                "Step A (client entities) and Step B (adverse parties) run first. Narrative and document upload stay hidden until clearance.",
            },
            {
              title: "Pending Matching isolation",
              detail:
                "Early COI data lives in an isolated pending store — not mapped to any firm visibility matrix.",
            },
            {
              title: "Blind firm notification",
              detail:
                "Matched firms see Case ID, practice area, claim value, and opposing-party nodes — never client identity yet.",
            },
            {
              title: "Mandatory COI affirmation",
              detail:
                "Accept Lead opens a blocking modal: the firm certifies internal conflict clearance before any reveal.",
            },
            {
              title: "Payment-gated unblind",
              detail:
                "Checkbox true + payment success unlocks client name and documents. Escrow and access stay coupled.",
            },
            {
              title: "Post-unlock quarantine",
              detail:
                "24-hour conflict report revokes access, clears cached previews, refunds or credits, and rematches the client.",
            },
          ]}
        />
      </MarketingSection>

      <MarketingSection>
        <SectionIntro title="FAQ" />
        <div className="space-y-10 max-w-3xl">
          {FAQS.map((item) => (
            <div key={item.q} className="border-t border-gray-200 pt-5">
              <h3 className="font-serif text-xl text-ink tracking-tight">{item.q}</h3>
              <p className="mt-2.5 text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingCtaBand
        title="Need a questionnaire completed?"
        description="Send your security pack — we respond with two-gate COI architecture and control mapping."
        primaryHref="/request-demo"
        primaryLabel="Contact us"
      />
    </>
  );
}
