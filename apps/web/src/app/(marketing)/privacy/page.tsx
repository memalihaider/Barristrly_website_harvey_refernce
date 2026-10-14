import type { Metadata } from "next";
import { getLegalPage } from "@/lib/content/legal";
import Link from "next/link";
import {
  MarketingSection,
  PageHero,
} from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Privacy Policy | Barristrly",
  description:
    "Privacy Policy for Barristrly's legal technology aggregator and client intake concierge platform — how we collect, use, disclose, and protect your data under UAE PDPL.",
};

export const revalidate = 300;

export default async function PrivacyPage() {
  const page = await getLegalPage("privacy");

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={page.title}
        description="How Barristrly collects, uses, discloses, and protects your data across our website and MVP matchmaking services."
      >
        <Link
          href="/terms"
          className="text-sm font-semibold text-primary hover:text-primary-hover"
        >
          View Terms and Conditions →
        </Link>
      </PageHero>

      <MarketingSection tight>
        <div className="max-w-3xl rounded-2xl border border-primary/25 bg-primary/5 px-6 py-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Document summary
          </p>
          <p className="text-sm text-ink leading-relaxed">
            Effective Date: {page.effective_date}. Operating Entity: Barristrly
            Platform (United Arab Emirates).
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Barristrly is a legal technology aggregator and client intake
            concierge platform. This Policy explains what information we
            collect through our intake wizard and consultation booking flow,
            how it is shared with independent Service Providers, and your
            rights under UAE data protection law.
          </p>
        </div>
      </MarketingSection>

      <MarketingSection>
        <div
          className="rich-content max-w-3xl"
          dangerouslySetInnerHTML={{ __html: page.content_html }}
        />
      </MarketingSection>
    </>
  );
}
