export interface FaqEntry {
  keywords: string[];
  answer: string;
}

export const FAQ_ENTRIES: FaqEntry[] = [
  {
    keywords: ["privacy", "confidential", "identity", "who sees", "safe", "secure"],
    answer:
      "Your details are handled confidentially. Barristrly uses them to match you with vetted professionals and to contact you about your request — we do not publish your information.",
  },
  {
    keywords: ["phone", "email", "contact details", "personal details", "will lawyers see"],
    answer:
      "We collect your contact details so our team can follow up. Matched professionals only receive what is needed to help with your matter after we arrange the introduction.",
  },
  {
    keywords: ["fee", "cost", "price", "pay", "charge", "how much", "budget"],
    answer:
      "Lawyer matching is free. Consultations are fixed by length — AED 299 (15 min), AED 599 (25–30 min), or AED 1,199 (50–60 min detailed). Other services are quoted before you commit. See the Pricing page for details.",
  },
  {
    keywords: ["match", "matching", "how does matching", "lawyer pick", "assign", "routing"],
    answer:
      "Tell us your practice area, location preference, and a short summary. We match you with vetted UAE professionals suited to your matter and reply within 48 hours.",
  },
  {
    keywords: ["meeting", "video", "call", "consultation", "voip"],
    answer:
      "You can book a legal consultation online or by phone from wherever you are — 15, 25–30, or 50–60 minutes at clear AED rates.",
  },
  {
    keywords: [
      "jurisdiction",
      "dubai",
      "abu dhabi",
      "difc",
      "adgm",
      "gdrfa",
      "mainland",
      "free zone",
      "court",
    ],
    answer:
      "We cover mainland UAE (including Dubai and Abu Dhabi), DIFC, and ADGM. If you are unsure which forum applies, describe your situation and we will route you accordingly.",
  },
  {
    keywords: ["immigration", "visa", "golden visa", "absconding", "overstay"],
    answer:
      "Immigration and visa matters can be included in your brief — including Golden Visa, employment/partner visas, overstay issues, and related applications. We match you with suitable professionals.",
  },
  {
    keywords: ["travel ban", "border", "interpol", "arrest warrant", "detained"],
    answer:
      "Travel ban and border matters are treated as high priority. Tell us if you are detained or facing a border restriction so we can flag urgency in your request.",
  },
  {
    keywords: ["legal notice", "notice", "cease and desist", "notary"],
    answer:
      "Legal notices, replies, cease-and-desist drafts, and notary attestation can all be requested through intake — we match you to the right specialist.",
  },
  {
    keywords: ["how long", "2 minutes", "time", "duration"],
    answer:
      "The structured intake is designed to finish in a few minutes: practice area → service type → jurisdiction → budget → short details → contact information.",
  },
  {
    keywords: ["account", "login", "register", "sign up", "dashboard"],
    answer:
      "You do not need to create an account. Submit your brief here and our team will follow up by email or phone within 48 hours.",
  },
];

export function matchFaq(text: string): string | null {
  const lower = text.toLowerCase();
  let best: { score: number; answer: string } | null = null;
  for (const entry of FAQ_ENTRIES) {
    const score = entry.keywords.reduce(
      (n, k) => (lower.includes(k.toLowerCase()) ? n + 1 : n),
      0
    );
    if (score > 0 && (!best || score > best.score)) {
      best = { score, answer: entry.answer };
    }
  }
  return best?.answer ?? null;
}

export function faqContextBlock(): string {
  return FAQ_ENTRIES.map(
    (e, i) => `${i + 1}. (${e.keywords.join(", ")}): ${e.answer}`
  ).join("\n");
}
