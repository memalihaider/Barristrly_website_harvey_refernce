import type { Metadata } from "next";
import Link from "next/link";
import DemoRequestForm from "@/components/marketing/demo-request-form";

export const metadata: Metadata = {
  title: "Schedule Meeting | Barristrly",
  description:
    "Schedule a walkthrough of Barristrly’s legal marketplace — directory, COI, BARRI intake, and PracticeOS.",
};

export default function RequestDemoPage() {
  return (
    <section className="light-section pt-28 pb-20 md:pt-32 md:pb-28 border-b border-gray-200/80">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-5">
              Schedule Meeting
            </p>
            <h1 className="font-serif text-[clamp(2.25rem,4vw,3.5rem)] text-ink tracking-tight leading-[1.08]">
              See the legal marketplace in action
            </h1>
            <p className="mt-5 text-lg text-gray-600 leading-relaxed">
              We walk through anonymous directory matching, COI clearance, BARRI
              intake, PracticeOS for providers, and corporate panels — tailored
              to your role and jurisdiction.
            </p>
            <ul className="mt-10 space-y-4 text-gray-600">
              {[
                "30–45 minute live walkthrough",
                "GCC corridor and practice-area focus",
                "Security and escrow questions welcome",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-sm text-gray-500">
              Prefer to try yourself?{" "}
              <Link
                href="/ai/intake"
                className="font-semibold text-primary hover:text-primary-hover"
              >
                Open BARRI
              </Link>
            </p>
          </div>
          <DemoRequestForm />
        </div>
      </div>
    </section>
  );
}
