import type { Metadata } from "next";
import { getLegalPage } from "@/lib/content/legal";
import {
  MarketingSection,
  PageHero,
} from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Terms and Conditions | Barristrly",
  description:
    "Terms & Conditions for Barristrly's website and MVP matchmaking services — legal technology aggregator and client intake concierge platform operating under UAE law.",
};

export const revalidate = 300;

export default async function TermsPage() {
  const page = await getLegalPage("terms");

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={page.title}
        description="Terms & Conditions for Barristrly's website and MVP matchmaking services."
      />

      <MarketingSection tight>
        <div className="max-w-3xl rounded-2xl border border-primary/25 bg-primary/5 px-6 py-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Document summary & legal disclaimer
          </p>
          <p className="text-sm text-ink leading-relaxed">
            Effective Date: {page.effective_date}. Operating Entity: Barristrly
            Platform (United Arab Emirates).
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Key Provision: Barristrly is a legal technology aggregator and
            client intake concierge platform. We are NOT a law firm and do NOT
            provide direct legal representation.
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
