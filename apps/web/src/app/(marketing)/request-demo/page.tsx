import type { Metadata } from "next";
import Link from "next/link";
import DemoRequestForm from "@/components/marketing/demo-request-form";

export const metadata: Metadata = {
  title: "Contact | Barristrly",
  description:
    "Contact Barristrly for lawyer matching, consultations, retainers, drafting, and other legal services across UAE & GCC.",
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
              Tell us what service you need
            </h1>
            <p className="mt-5 text-lg text-gray-600 leading-relaxed">
              Share your matter or business need. We respond within 24 hours with
              the right service path — matching, consultation, retainer, drafting,
              or a specialist desk.
            </p>
            <ul className="mt-10 space-y-4 text-gray-600">
              {[
                "Response within 24 hours",
                "UAE & GCC service coverage",
                "Clear AED pricing before you proceed",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-sm text-gray-500">
              Prefer self-serve?{" "}
              <Link
                href="/services"
                className="font-semibold text-primary hover:text-primary-hover"
              >
                Browse all services
              </Link>
              {" · "}
              <Link
                href="/services/consultation#request"
                className="font-semibold text-primary hover:text-primary-hover"
              >
                Book consultation
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
