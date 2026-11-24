import type { Metadata } from "next";
import Link from "next/link";
import DemoRequestForm from "@/components/marketing/demo-request-form";

export const metadata: Metadata = {
  title: "Contact Us — Get Legal Help in Dubai & the UAE",
  description:
    "Need a lawyer in Dubai or the UAE? Send a short message about your contract, company setup, will, retainer or dispute — we reply within 48 hours with your next step.",
  alternates: { canonical: "/request-demo" },
};

export default function ContactPage() {
  return (
    <section className="light-section pt-28 pb-20 md:pt-32 md:pb-28 border-b border-gray-200/80">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-5">
              Contact
            </p>
            <h1 className="font-serif text-[clamp(2.25rem,4vw,3.5rem)] text-ink tracking-tight leading-[1.08]">
              Tell us how we can help
            </h1>
            <p className="mt-5 text-lg text-gray-600 leading-relaxed">
              Share a short note about your situation. We reply within 48 hours
              with the clearest next step — a service recommendation, quote, or
              introduction to a vetted professional.
            </p>
            <ul className="mt-10 space-y-4 text-gray-600">
              {[
                "Reply within 48 hours",
                "Support across the UAE and GCC",
                "Clear prices before you decide",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-sm text-gray-500">
              Prefer to choose yourself?{" "}
              <Link
                href="/services"
                className="font-semibold text-primary hover:text-primary-hover"
              >
                Browse services
              </Link>
              {" · "}
              <Link
                href="/how-it-works"
                className="font-semibold text-primary hover:text-primary-hover"
              >
                How it works
              </Link>
            </p>
            <p className="mt-6 text-sm text-gray-600">
              support@barristrly.com
            </p>
          </div>
          <DemoRequestForm />
        </div>
      </div>
    </section>
  );
}
