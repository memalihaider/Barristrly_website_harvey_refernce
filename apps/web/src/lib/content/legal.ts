import { createServiceClient, isDbConfigured } from "@/lib/db/client";
import { sanitizeRichText } from "@/lib/content/sanitize";
import {
  PRIVACY_EFFECTIVE_DATE,
  PRIVACY_SECTIONS,
  TERMS_EFFECTIVE_DATE,
  TERMS_SECTIONS,
  type Clause,
} from "@/lib/content/legal-defaults";

export const LEGAL_SLUGS = ["terms", "privacy"] as const;
export type LegalSlug = (typeof LEGAL_SLUGS)[number];

export const LEGAL_META: Record<
  LegalSlug,
  {
    title: string;
    path: string;
    sections: Clause[];
    effectiveDate: string;
    intro?: string;
  }
> = {
  terms: {
    title: "Terms and Conditions",
    path: "/terms",
    intro:
      'These Terms and Conditions ("Terms") govern your access to and use of the website, mobile applications, intake wizards, and concierge services (collectively, the "Platform") provided by Barristrly ("Company", "we", "us", or "our").',
    sections: TERMS_SECTIONS,
    effectiveDate: TERMS_EFFECTIVE_DATE,
  },
  privacy: {
    title: "Privacy Policy",
    path: "/privacy",
    sections: PRIVACY_SECTIONS,
    effectiveDate: PRIVACY_EFFECTIVE_DATE,
  },
};

export type LegalPage = {
  slug: LegalSlug;
  title: string;
  effective_date: string;
  content_html: string;
  updated_at: string | null;
  updated_by_name: string | null;
  /** False when nothing has been saved yet and defaults are shown. */
  customized: boolean;
};

export function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(value);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Converts the built-in clause data into editor HTML. */
export function clausesToHtml(sections: Clause[]): string {
  return sections
    .map((s) => {
      const parts = [`<h2 id="section-${s.id}">${escapeHtml(s.title)}</h2>`];
      for (const p of s.paragraphs ?? []) parts.push(`<p>${escapeHtml(p)}</p>`);
      if (s.bullets?.length) {
        parts.push(
          `<ul>${s.bullets.map((b) => `<li><p>${escapeHtml(b)}</p></li>`).join("")}</ul>`
        );
      }
      if (s.note) parts.push(`<p>${escapeHtml(s.note)}</p>`);
      return parts.join("");
    })
    .join("");
}

function defaults(slug: LegalSlug): LegalPage {
  const meta = LEGAL_META[slug];
  return {
    slug,
    title: meta.title,
    effective_date: meta.effectiveDate,
    content_html:
      (meta.intro ? `<p>${escapeHtml(meta.intro)}</p>` : "") + clausesToHtml(meta.sections),
    updated_at: null,
    updated_by_name: null,
    customized: false,
  };
}

/**
 * Gives numbered section headings ("2. …") a stable `section-2` id so
 * deep links like /terms#section-2 keep working after edits.
 */
function anchorHeadings(html: string): string {
  return html.replace(
    /<h2(?![^>]*\bid=)([^>]*)>(\s*(?:<[^>]+>\s*)*)(\d+)\./g,
    (_m, attrs: string, lead: string, num: string) =>
      `<h2 id="section-${num}"${attrs}>${lead}${num}.`
  );
}

/** Saved page content, or the built-in defaults when none is saved. */
export async function getLegalPage(slug: LegalSlug): Promise<LegalPage> {
  if (!isDbConfigured()) return defaults(slug);
  try {
    const { data } = await createServiceClient()
      .from("site_pages")
      .select("*")
      .eq("id", slug)
      .maybeSingle();
    if (!data?.content_html) return defaults(slug);
    return {
      slug,
      title: data.title || LEGAL_META[slug].title,
      effective_date: data.effective_date || LEGAL_META[slug].effectiveDate,
      content_html: anchorHeadings(sanitizeRichText(data.content_html)),
      updated_at: data.updated_at ?? null,
      updated_by_name: data.updated_by_name ?? null,
      customized: true,
    };
  } catch {
    return defaults(slug);
  }
}
