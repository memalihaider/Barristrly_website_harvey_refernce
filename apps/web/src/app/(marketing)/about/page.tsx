import type { Metadata } from "next";
import {
  MarketingCtaBand,
  MarketingSection,
  PageHero,
} from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "About | Barristrly",
  description:
    "Barristrly is the legal operating system — Marketplace, AI, PracticeOS, and Enterprise.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Legal work deserves an operating system"
        description="Barristrly connects clients who need counsel with lawyers who can deliver — then keeps the work in one system through AI, practice tools, and enterprise controls."
      />

      <MarketingSection>
        <div className="max-w-2xl space-y-6 text-gray-600 leading-relaxed text-lg">
          <p>
            We started with a marketplace-first belief: hiring a lawyer should
            feel as clear as booking a consult, with conflict checks, escrow,
            and a real path into the matter.
          </p>
          <p>
            Around that core we built PracticeOS for lawyers, AI assistants
            grounded in matter context — including conversational AI Intake —
            and Enterprise modules for teams that need CLM, compliance, and
            analytics.
          </p>
          <p>
            Our focus corridor spans the GCC and connected markets — Dubai,
            Abu Dhabi, DIFC/ADGM, Saudi, and beyond — with ontology designed for
            those jurisdictions from day one.
          </p>
        </div>
      </MarketingSection>

      <MarketingCtaBand
        title="Build with us"
        description="Whether you are hiring counsel, growing a practice, or running legal ops — we would like to hear from you."
        primaryHref="/request-demo"
        primaryLabel="Request a demo"
        secondaryHref="/ai/intake"
        secondaryLabel="Try AI Intake"
      />
    </>
  );
}
