import sanitizeHtml from "sanitize-html";

/**
 * Allow-list for rich text produced by the admin editor. Everything stored
 * or rendered from the CMS goes through here, so scripts, event handlers
 * and unknown tags never reach the public site.
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "p", "br", "hr",
    "strong", "b", "em", "i", "u", "s", "mark", "code", "pre", "sub", "sup",
    "ul", "ol", "li", "blockquote", "a", "img", "span",
    "table", "thead", "tbody", "tr", "th", "td", "colgroup", "col",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel", "title"],
    img: ["src", "alt", "title", "width", "height"],
    th: ["colspan", "rowspan", "colwidth"],
    td: ["colspan", "rowspan", "colwidth"],
    col: ["style"],
    ol: ["start", "type"],
    mark: ["data-color"],
    "*": ["style", "id"],
  },
  allowedStyles: {
    "*": {
      "text-align": [/^(left|right|center|justify)$/],
      "min-width": [/^\d+px$/],
      width: [/^\d+px$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https"] },
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        ...(attribs.href && /^https?:/i.test(attribs.href)
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {}),
      },
    }),
  },
};

export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html ?? "", OPTIONS).trim();
}

/** Plain-text version (for excerpts, read time, search). */
export function htmlToText(html: string): string {
  return sanitizeHtml(html ?? "", { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}
