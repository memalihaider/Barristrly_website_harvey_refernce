"use client";

import SectionHeading from "@/components/ui/section-heading";
import FaqItem from "@/components/ui/faq-item";

export default function FaqSection() {
  const faqs = [
    {
      question: "How does the AI intake process work?",
      answer: "Our natural language AI chatbot guides clients through case submission in plain English. It automatically extracts jurisdiction, case type, urgency level, and budget parameters. The system then runs conflict-of-interest screening before any lawyer sees the case details.",
    },
    {
      question: "Is my information truly anonymous?",
      answer: "Absolutely. Barristrly uses a double-blind system where neither clients nor lawyers see each other's identity until both parties explicitly grant dual consent. During consultations, we employ voice morphing and silhouette masking for complete anonymity.",
    },
    {
      question: "How does the escrow payment system work?",
      answer: "All payments are held in Stripe-protected milestone escrow. Funds are only released when both the client and lawyer confirm milestone completion through our dual-confirmation system. This protects both parties throughout the engagement.",
    },
    {
      question: "Which jurisdictions does Barristrly support?",
      answer: "We currently support UAE (Dubai, Abu Dhabi, DIFC, ADGM), GCC countries (Saudi Arabia, Kuwait, Bahrain, Oman, Qatar), Pakistan, and London (UK). Our global jurisdiction router automatically matches cases to the appropriate legal framework.",
    },
    {
      question: "How are lawyers vetted on the platform?",
      answer: "Every lawyer undergoes a rigorous verification process managed by our mediator team. This includes credential verification, license validation, conflict-of-interest clearance, and ongoing performance monitoring. Only approved lawyers appear in our directory.",
    },
    {
      question: "Can I try Barristrly for free?",
      answer: "Yes! Our Intake Starter plan is free forever and includes 5 AI intakes per month, basic jurisdiction routing, and standard COI screening. No credit card required to get started.",
    },
  ];

  return (
    <section id="faq" className="section-padding light-section relative overflow-hidden border-t border-black/5">
      <div className="container-tight relative z-10">
        <div className="mb-12">
          <SectionHeading
            eyebrow="Support"
            heading="Frequently asked questions"
            subtitle="Everything you need to know about our legal intake, double-blind matching, and payment guarantees."
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
