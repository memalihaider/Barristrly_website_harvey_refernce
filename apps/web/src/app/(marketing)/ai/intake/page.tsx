import type { Metadata } from "next";
import Link from "next/link";
import IntakeChat from "@/components/intake/intake-chat";
import {
  MarketingSection,
  PageHero,
} from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "BARRI Intake | Barristrly",
  description:
    "BARRI classifies your matter for Barristrly’s legal marketplace — then routes you toward matched providers with COI-aware matching.",
};

export default function AiIntakePage() {
  return (
    <>
      <PageHero
        eyebrow="BARRI"
        title="Classify your matter. Match the right provider."
        description="Describe what happened in your own words. BARRI structures practice area, jurisdiction, and urgency — then suggests counsel through marketplace matching, with COI before consult."
      />

      <MarketingSection tight>
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-start">
          <div className="space-y-8 max-w-md">
            <ol className="space-y-6 list-none p-0 m-0">
              {[
                {
                  step: "01",
                  title: "Tell your story",
                  body: "Facts in plain language — no legal jargon required.",
                },
                {
                  step: "02",
                  title: "We structure the matter",
                  body: "Practice area, jurisdiction, urgency, and a clear summary.",
                },
                {
                  step: "03",
                  title: "See matched lawyers",
                  body: "Sign in to save the lead and view ranked counsel with COI-aware matching.",
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
              Already registered?{" "}
              <Link
                href="/login?next=/client/intake"
                className="font-semibold text-primary hover:text-primary-hover"
              >
                Log in to continue in the portal
              </Link>
            </p>
          </div>
          <IntakeChat mode="public" />
        </div>
      </MarketingSection>
    </>
  );
}
