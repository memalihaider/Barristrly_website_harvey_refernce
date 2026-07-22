"use client";

import SectionHeading from "@/components/ui/section-heading";
import FaqItem from "@/components/ui/faq-item";

export default function FaqSection() {
  const faqs = [
    {
      question: "How does the AI intake process work?",
      answer:
        "Clients complete a multi-step registration gate first: client entities, then adverse parties. Narrative and document upload stay locked until the COI engine clears matching. Structured practice area, jurisdiction, and urgency feed ranking — without exposing privileged facts early.",
    },
    {
      question: "Is my information truly anonymous?",
      answer:
        "Yes at Gate 2. Matched firms receive only an anonymized Case ID, practice area, claim value, and opposing-party nodes. Client name and documents unlock only after mandatory firm COI affirmation and successful payment.",
    },
    {
      question: "How does conflict screening work?",
      answer:
        "The system runs deterministic ID checks (Emirates ID / passport) and fuzzy / phonetic matching for name variants, plus multi-hop filtering for associated third parties. Firms must certify internal clearance in a blocking Accept Lead modal before unblind.",
    },
    {
      question: "How does the escrow payment system work?",
      answer:
        "Payment success is the reveal trigger with COI affirmation. Funds stay in milestone escrow and release only when both sides confirm completion — protecting both parties through engagement.",
    },
    {
      question: "Which jurisdictions does Barristrly support?",
      answer:
        "We currently support UAE (Dubai, Abu Dhabi, DIFC, ADGM), GCC countries (Saudi Arabia, Kuwait, Bahrain, Oman, Qatar), Pakistan, and London (UK). Our global jurisdiction router matches cases to the appropriate legal framework.",
    },
    {
      question: "What if a conflict appears after unlock?",
      answer:
        "Firms have 24 hours to report a post-unlock conflict. Barristrly revokes case access, clears cached previews, issues a refund or credit, and rematches the client to the next non-conflicted firm.",
    },
  ];

  return (
    <section id="faq" className="section-padding light-section relative overflow-hidden border-t border-black/5">
      <div className="container-tight relative z-10">
        <div className="mb-12">
          <SectionHeading
            eyebrow="Support"
            heading="Frequently asked questions"
            subtitle="Everything you need to know about two-gate conflict clearing, blind matching, and payment-gated reveal."
          />
        </div>

        <div className="mt-12 border-t border-black/10">
          {faqs.map((faq, idx) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
