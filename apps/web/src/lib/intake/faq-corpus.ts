export interface FaqEntry {
  keywords: string[];
  answer: string;
}

export const FAQ_ENTRIES: FaqEntry[] = [
  {
    keywords: ["anonymous", "privacy", "identity", "who sees", "hidden", "mask", "masked"],
    answer:
      "Lead Data Masking is active. Your name, phone, and email stay completely hidden from lawyers during matching and the first consultation. They only unlock after the meeting ends and you explicitly authorize release.",
  },
  {
    keywords: ["phone", "email", "contact details", "personal details", "will lawyers see"],
    answer:
      "Lawyers never receive your phone or email during matchmaking. The directory shows placeholders such as Client #DXB-**** until you click Accept/Authorize Release after your consultation.",
  },
  {
    keywords: ["fee", "cost", "price", "pay", "charge", "how much", "budget"],
    answer:
      "During intake we capture your budget tier (Premium / Mid-Range / Budget / Quote Collection) so we route to firms aligned with your fee expectations. Platform consult fees are shown before payment; law-firm retainers are separate and quoted by the matched specialist.",
  },
  {
    keywords: ["coi", "conflict", "conflict of interest", "quarantine"],
    answer:
      "After intake we run conflict-of-interest screening before identity reveal. Matching uses a two-gate flow: party data first, then blind firm affirmation — narrative and docs stay locked until clearance.",
  },
  {
    keywords: ["when", "share", "release", "unmask", "after consultation"],
    answer:
      "Contact release is Stage 3 of our pipeline: only after the consultation concludes and you grant explicit permission does the platform unlock your unmasked contact details for that attorney.",
  },
  {
    keywords: ["match", "matching", "how does matching", "lawyer pick", "assign", "routing"],
    answer:
      "We map your practice area, sub-category, jurisdiction, budget tier, and urgency flags to verified lawyer profiles. You then choose from ranked matches — identities stay masked until you approve.",
  },
  {
    keywords: ["meeting", "video", "call", "consultation", "voip"],
    answer:
      "Initial consultations run through the platform’s masked VoIP or in-app video portal so the lawyer can advise without storing your direct contact identifiers.",
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
      "UAE matters split between Mainland civil-law forums (Dubai Courts, ADJD, MoHRE, RDC, GDRFA/ICP, Police) and English common-law free zones (DIFC / ADGM). If you are unsure, choose Automated Matching and we infer the forum from your description.",
  },
  {
    keywords: ["immigration", "visa", "golden visa", "absconding", "overstay"],
    answer:
      "Immigration matters are routed using federal ICP vs Emirate GDRFA tags — including Golden Visa, employment/green/partner visas, absconding clearance, overstay fines, and security clearance updates.",
  },
  {
    keywords: ["travel ban", "border", "interpol", "arrest warrant", "detained"],
    answer:
      "Travel ban and border matters are high-priority. Tell us if you are detained or facing a border restriction — we flag urgency and route to criminal / execution-court specialists while keeping your identity masked.",
  },
  {
    keywords: ["legal notice", "notice", "cease and desist", "notary"],
    answer:
      "Legal notice matters cover drafting/sending notices, replies to received notices, cease-and-desist, and notary attestation. We tag whether the posture is offensive or defensive for drafting desks.",
  },
  {
    keywords: ["how long", "2 minutes", "time", "duration"],
    answer:
      "The structured intake is designed to finish in under two minutes: practice area → engagement model → jurisdiction → budget → short details → secure contact (still masked from lawyers).",
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
