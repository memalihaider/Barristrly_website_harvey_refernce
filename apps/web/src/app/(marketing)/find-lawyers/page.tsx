import type { Metadata } from "next";
import Link from "next/link";
import LegalDirectory from "@/components/marketing/legal-directory";

export const metadata: Metadata = {
  title: "Anonymous Legal Directory | Barristrly",
  description:
    "Browse Barristrly’s anonymous legal directory — filter by practice, location, languages, and session fee. Match after COI.",
};

export default function FindLawyersPage() {
  return (
    <div className="light-section min-h-dvh">
      <header className="border-b border-gray-200/80 bg-ivory pt-28 pb-10 md:pt-32 md:pb-12">
        <div className="container-wide">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-3">
            Browse providers like a marketplace
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="font-serif text-[clamp(2rem,4vw,3.25rem)] text-ink tracking-tight leading-[1.1]">
                Anonymous Legal Directory
              </h1>
              <p className="mt-4 text-base md:text-lg text-gray-600 leading-relaxed">
                Filter vetted lawyers, arbitrators, and legal service providers
                by expertise and corridor. Profiles stay masked until conflict
                clearance and escrow booking.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/ai/intake"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-hover transition-colors"
              >
                Ask BARRI
              </Link>
              <Link
                href="/request-demo"
                className="inline-flex items-center justify-center rounded-full border border-ink/20 px-5 py-2.5 text-sm font-semibold text-ink hover:border-primary hover:text-primary transition-colors"
              >
                Schedule Meeting
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-10 md:pt-12">
        <LegalDirectory />
      </div>
    </div>
  );
}
