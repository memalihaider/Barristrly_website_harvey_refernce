import { slugify } from "./text";

export type TocItem = { id: string; text: string; level: 2 | 3 };

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

/**
 * Adds stable ids to <h2>/<h3> headings in sanitized article HTML and returns
 * the table of contents. Runs after sanitizing, which strips heading ids.
 */
export function withHeadingAnchors(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const out = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g,
    (match, lvl: string, attrs: string, inner: string) => {
      if (/\bid=/.test(attrs)) return match;
      const text = decode(inner);
      if (!text) return match;
      const base = slugify(text) || "section";
      let id = base;
      for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
      used.add(id);
      toc.push({ id, text, level: lvl === "2" ? 2 : 3 });
      return `<h${lvl} id="${id}"${attrs}>${inner}</h${lvl}>`;
    },
  );
  return { html: out, toc };
}
