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
    "Privacy-first architecture, escrow controls, and security practices for legal work.",
};

const FAQS = [
  {
    q: "How is client data handled?",
    a: "Matter data is access-scoped by role. Portals enforce client, lawyer, and admin boundaries.",
  },
  {
    q: "Are consultations encrypted?",
    a: "Consult meetings are designed for encrypted sessions with consent recorded before engagement.",
  },
  {
    q: "What about conflicts?",
    a: "COI workflows support double-blind screening before counsel sees full client identity where required.",
  },
  {
    q: "Do you support enterprise reviews?",
    a: "Yes — security questionnaires and roadmap items (SSO/API) are handled through sales and compliance.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Security"
        title="Trust is part of the product"
        description="Barristrly is built for confidential legal work — role gates, escrow, COI-aware matching, and audit trails."
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
              title: "Role-based access",
              detail:
                "Client, lawyer, firm, and platform admin portals with middleware gates.",
            },
            {
              title: "Escrow controls",
              detail: "Fees held until milestones clear — reducing payment disputes.",
            },
            {
              title: "Audit events",
              detail: "Analytics and admin audit surfaces for sensitive actions.",
            },
            {
              title: "Document vault",
              detail:
                "Matter documents stored with scoped access for engagement parties.",
            },
            {
              title: "Privacy-first matching",
              detail:
                "COI screening before full exposure of party identities.",
            },
            {
              title: "Enterprise roadmap",
              detail:
                "SSO and deeper identity controls available via enterprise engagement.",
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
        description="Send your security pack — we respond with architecture and control mapping."
        primaryHref="/request-demo"
        primaryLabel="Contact us"
      />
    </>
  );
}
