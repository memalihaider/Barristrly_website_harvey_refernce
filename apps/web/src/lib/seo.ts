/**
 * Shared SEO constants and JSON-LD helpers for the marketing site.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://barristrly.com).
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://barristrly.com"
).replace(/\/$/, "");

export const SITE_NAME = "Barristrly";

export const DEFAULT_TITLE =
  "Find Vetted Lawyers & Legal Services in Dubai, UAE | Barristrly";

export const DEFAULT_DESCRIPTION =
  "Get matched with vetted UAE lawyers in 48 hours. Contract drafting, company formation & PRO, wills, legal retainers and arbitration support across Dubai, Abu Dhabi, DIFC & ADGM — with clear AED pricing.";

export const SEO_KEYWORDS = [
  "lawyers in Dubai",
  "UAE lawyers",
  "legal services Dubai",
  "find a lawyer UAE",
  "contract drafting Dubai",
  "company formation UAE",
  "PRO services Dubai",
  "will drafting UAE",
  "DIFC wills",
  "legal retainer UAE",
  "arbitration lawyers Dubai",
  "Corporate Tax registration UAE",
  "ADGM lawyers",
  "Abu Dhabi lawyers",
];

export const SUPPORT_EMAIL = "support@barristrly.com";

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/icon-512.png"),
    image: absoluteUrl("/icon-512.png"),
    email: SUPPORT_EMAIL,
    description: DEFAULT_DESCRIPTION,
    areaServed: [
      { "@type": "City", name: "Dubai" },
      { "@type": "City", name: "Abu Dhabi" },
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Place", name: "GCC" },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    priceRange: "AED",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SUPPORT_EMAIL,
      areaServed: "AE",
      availableLanguage: ["English", "Arabic"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    serviceType: input.serviceType ?? input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
  };
}
