import type { Metadata } from "next";
import Link from "next/link";
import ClientIntakeForm from "@/components/intake/client-intake-form";
import {
  MarketingSection,
  PageHero,
} from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Free Lawyer Matching in the UAE — Submit Your Legal Brief",
  description:
    "Describe your legal issue in a few minutes and get matched with up to three vetted, UAE-licensed lawyers. Free to submit, confidential, and proposals within 48 hours.",
  alternates: { canonical: "/ai/intake" },
};

export default function AiIntakePage() {
  return (
    <>
      <PageHero
        eyebrow="Client intake"
        title="Submit Your Legal Brief"
        description="For individual litigants, expats, startups, and corporate clients seeking legal assistance. Free Match proposals within 24 business hours; Paid Strategy Sessions scheduled within 24–48 hours upon payment confirmation."
      />

      <MarketingSection tight>
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-start">
          <div className="space-y-8 max-w-md">
            <ol className="space-y-6 list-none p-0 m-0">
              {[
                {
                  step: "01",
                  title: "Your details",
                  body: "Tell us who you are and how to reach you.",
                },
                {
                  step: "02",
                  title: "Service & matter",
                  body: "Free matching or a Dedicated Consultation, plus practice area and jurisdiction.",
                },
                {
                  step: "03",
                  title: "Issue & documents",
                  body: "Describe the matter and flag what supporting documents you have.",
                },
              ].map((item) => (
                <li key={item.step} className="border-t border-gray-200 pt-5">
                  <p className="text-xs font-semibold text-primary tracking-wider">
                    {item.step}
                  </p>
                  <h2 className="font-serif text-2xl text-ink mt-1">{item.title}</h2>
                  <p className="mt-2 text-gray-600 leading-relaxed">{item.body}</p>
                </li>
              ))}
            </ol>
            <p className="text-sm text-gray-500">
              No account required. Prefer email?{" "}
              <Link
                href="/request-demo"
                className="font-semibold text-primary hover:text-primary-hover"
              >
                Contact us
              </Link>
            </p>
          </div>
          <ClientIntakeForm />
        </div>
      </MarketingSection>
    </>
  );
}
