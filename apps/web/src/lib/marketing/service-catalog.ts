/**
 * Barristrly finalized service catalog (6 services).
 * Client-friendly copy + SEO fields. Barristrly connects clients with vetted
 * professionals — it is not a law firm or legal consultancy.
 */

import type { LucideIcon } from "lucide-react";
import {
  Scale,
  FileText,
  Building2,
  ScrollText,
  PenLine,
  Handshake,
} from "lucide-react";

export type ServiceId =
  | "arbitration"
  | "agreements-ebooks"
  | "company-formation"
  | "wills-estate"
  | "contract-drafting"
  | "retainers";

export type CatalogTier = {
  id: string;
  name: string;
  priceAed: number | null;
  priceLabel: string;
  detail?: string;
  duration?: string;
  scope?: string;
  features?: string[];
};

export type FormFieldType =
  | "text"
  | "email"
  | "tel"
  | "textarea"
  | "select"
  | "number"
  | "file"
  | "checkbox";

export type ServiceFormField = {
  key: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  options?: string[];
  accept?: string;
  placeholder?: string;
  helpText?: string;
};

export type ContentBlock = {
  title: string;
  body: string;
};

export type CatalogService = {
  id: ServiceId;
  slug: string;
  number: number;
  name: string;
  shortName: string;
  eyebrow: string;
  tagline: string;
  description: string;
  /** SEO */
  metaTitle: string;
  metaDescription: string;
  pricingModel: string;
  monetization: string;
  href: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  icon: LucideIcon;
  tiers: CatalogTier[];
  deliverables: string[];
  benefits: ContentBlock[];
  whoFor: string[];
  formSchema: ServiceFormField[];
  phase1Notes: string;
  isNew?: boolean;
};

const CONTACT_FIELDS: ServiceFormField[] = [
  { key: "clientName", label: "Full name", type: "text", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "phone", label: "WhatsApp / phone", type: "tel", required: true },
];

export const SERVICE_CATALOG: CatalogService[] = [
  {
    id: "arbitration",
    slug: "arbitration",
    number: 1,
    name: "Arbitration Connections",
    shortName: "Arbitration",
    eyebrow: "Arbitrators & specialists",
    tagline:
      "Connect with arbitrators, technical experts, and arbitration professionals in one place.",
    description:
      "Arbitration often needs several specialists — tribunal members, technical experts, valuation specialists, and support professionals. Barristrly gives you one clear starting point to connect with the right people for your matter.",
    metaTitle: "Arbitration Lawyers & Expert Witnesses in Dubai, UAE",
    metaDescription:
      "Find arbitrators, arbitration lawyers and technical or quantum experts for DIAC, DIFC and ADGM disputes. One request, matched specialists, reply within 48 hours.",
    pricingModel: "Connection request · quote by matter",
    monetization: "Matched introductions to vetted specialists",
    href: "/services/arbitration",
    ctaLabel: "Request arbitration support",
    ctaHref: "/services/arbitration#request",
    secondaryCtaLabel: "How it works",
    secondaryCtaHref: "/how-it-works",
    icon: Scale,
    tiers: [
      {
        id: "arbitrators",
        name: "Arbitrators",
        priceAed: null,
        priceLabel: "On request",
        detail: "Connect with arbitration practitioners suited to your dispute",
      },
      {
        id: "experts",
        name: "Technical & financial experts",
        priceAed: null,
        priceLabel: "On request",
        detail: "Engineering, construction, valuation, accounting, and quantum",
      },
      {
        id: "professionals",
        name: "Arbitration professionals",
        priceAed: null,
        priceLabel: "On request",
        detail: "Specialists who support preparation and proceedings",
      },
    ],
    deliverables: [
      "One place to start discovering contributors",
      "Introductions matched to your matter type",
      "Clearer early coordination across roles",
    ],
    benefits: [
      {
        title: "One organised hub",
        body: "Explore arbitrators, experts, and support professionals without starting a separate search for every role.",
      },
      {
        title: "Save time early",
        body: "Spend less time hunting contacts and more time preparing for deadlines and hearings.",
      },
      {
        title: "Clearer fit",
        body: "Compare relevant experience and availability before you commit to conversations.",
      },
      {
        title: "Clear role boundaries",
        body: "Barristrly helps you connect. Independent professionals carry out their own work.",
      },
    ],
    whoFor: [
      "Companies in commercial or cross-border disputes",
      "Teams needing technical or financial experts",
      "Parties preparing for or already in arbitration",
    ],
    formSchema: [
      ...CONTACT_FIELDS,
      {
        key: "roleNeeded",
        label: "Who do you need?",
        type: "select",
        required: true,
        options: [
          "Arbitrator / tribunal candidate",
          "Technical or industry expert",
          "Financial / valuation / quantum expert",
          "Arbitration support professional",
          "Not sure — advise me",
        ],
      },
      {
        key: "matterSummary",
        label: "Brief summary of the matter",
        type: "textarea",
        required: true,
        placeholder: "Type of dispute, stage, and what help you need…",
      },
      {
        key: "timeline",
        label: "Key dates or timing needs",
        type: "text",
        placeholder: "e.g. hearing in 3 months, expert report soon",
      },
    ],
    phase1Notes: "Request → team matches vetted specialists → client introductions.",
  },
  {
    id: "agreements-ebooks",
    slug: "agreements-ebooks",
    number: 2,
    name: "Agreements & E-Books",
    shortName: "Agreements & E-Books",
    eyebrow: "For startups & mid-size companies",
    tagline:
      "Ready agreement templates you can adapt, plus practical e-books for growing teams.",
    description:
      "Move faster with structured agreement templates and clear business e-books made for startups and mid-size companies. When you need custom drafting or a lawyer later, Barristrly can connect you to vetted professionals.",
    metaTitle: "Legal Agreement Templates & Business E-Books for UAE Startups",
    metaDescription:
      "Ready-to-use NDA, service, contractor and commercial agreement templates plus practical e-books for UAE startups and SMEs. Upgrade to a vetted lawyer anytime.",
    pricingModel: "Fixed prices per template / e-book",
    monetization: "Digital purchase · upgrade to custom help anytime",
    href: "/services/agreements-ebooks",
    ctaLabel: "Browse agreements & e-books",
    ctaHref: "/services/agreements-ebooks#request",
    icon: FileText,
    tiers: [
      {
        id: "templates",
        name: "Agreement templates",
        priceAed: null,
        priceLabel: "From catalog",
        detail: "NDAs, services, contractor, and commercial starters",
        features: [
          "Structured clauses you can edit",
          "Faster deal kick-off",
          "More consistent paperwork",
        ],
      },
      {
        id: "ebooks",
        name: "Business & legal e-books",
        priceAed: null,
        priceLabel: "From catalog",
        detail: "Practical guides for founders and managers",
        features: [
          "Written for lean teams",
          "Topics across the growth journey",
          "Easy to share with your team",
        ],
      },
    ],
    deliverables: [
      "Templates you can adapt to your deal",
      "E-books with practical takeaways",
      "Path to custom legal help when deals get complex",
    ],
    benefits: [
      {
        title: "Built for speed",
        body: "Get a solid starting document without waiting weeks for every routine need.",
      },
      {
        title: "Built for budget",
        body: "A practical middle ground between random free downloads and full custom projects.",
      },
      {
        title: "Grow with Barristrly",
        body: "When a deal is high-stakes, upgrade to vetted professionals for drafting or advice.",
      },
    ],
    whoFor: [
      "Founders and co-founders",
      "Ops and finance leads in mid-size companies",
      "Teams standardising everyday contracts",
    ],
    formSchema: [
      ...CONTACT_FIELDS,
      {
        key: "interest",
        label: "What are you looking for?",
        type: "select",
        required: true,
        options: [
          "Agreement templates",
          "E-books / guides",
          "Both templates and e-books",
          "Custom drafting instead",
        ],
      },
      {
        key: "topic",
        label: "Topic or document type",
        type: "text",
        required: true,
        placeholder: "e.g. NDA, contractor agreement, startup contracting guide",
      },
      {
        key: "notes",
        label: "Anything else we should know?",
        type: "textarea",
      },
    ],
    phase1Notes: "Catalog request → payment link for digital items → email delivery.",
  },
  {
    id: "company-formation",
    slug: "company-formation",
    number: 3,
    name: "UAE Company Formation, PRO & Tax",
    shortName: "Company Formation & PRO",
    eyebrow: "Setup from anywhere",
    tagline:
      "Company licensing, Corporate Tax, VAT, and PRO support with vetted professionals — inside or outside the UAE.",
    description:
      "Starting a UAE company is more than a trade licence. Barristrly helps you connect with vetted professionals for formation, Corporate Tax registration, VAT, and ongoing PRO formalities — whether you are in the UAE or abroad.",
    metaTitle: "UAE Company Formation, PRO Services & Corporate Tax Registration",
    metaDescription:
      "Set up your company in Dubai mainland or a UAE free zone from anywhere. Trade licence, Corporate Tax & VAT registration and PRO services by vetted specialists.",
    pricingModel: "Quoted by structure & scope",
    monetization: "Matched to vetted formation & PRO specialists",
    href: "/services/company-formation",
    ctaLabel: "Start company setup",
    ctaHref: "/services/company-formation#request",
    icon: Building2,
    tiers: [
      {
        id: "formation",
        name: "Company formation",
        priceAed: null,
        priceLabel: "Custom quote",
        detail: "Mainland or Free Zone licensing guidance",
      },
      {
        id: "tax",
        name: "Corporate Tax & VAT",
        priceAed: null,
        priceLabel: "Custom quote",
        detail: "Registration and compliance readiness with the FTA",
      },
      {
        id: "pro",
        name: "PRO & government formalities",
        priceAed: null,
        priceLabel: "Custom quote",
        detail: "Renewals, portals, visas, and day-to-day filings",
      },
    ],
    deliverables: [
      "Help choosing the right licence path",
      "Support for tax registrations",
      "Ongoing PRO coordination options",
    ],
    benefits: [
      {
        title: "Remote-friendly",
        body: "Start setup steps from inside the UAE or overseas with clear guidance.",
      },
      {
        title: "Connected roadmap",
        body: "Treat licensing, tax, and PRO as one journey — not three separate puzzles.",
      },
      {
        title: "Fewer costly mistakes",
        body: "Reduce the risk of wrong activities, missed deadlines, or unverified middlemen.",
      },
    ],
    whoFor: [
      "Founders launching in the UAE",
      "Overseas entrepreneurs expanding to the region",
      "Businesses needing PRO and tax follow-through",
    ],
    formSchema: [
      ...CONTACT_FIELDS,
      {
        key: "location",
        label: "Where are you based?",
        type: "select",
        required: true,
        options: ["Inside the UAE", "Outside the UAE", "Both / relocating"],
      },
      {
        key: "need",
        label: "What do you need help with?",
        type: "select",
        required: true,
        options: [
          "New company formation",
          "Corporate Tax registration",
          "VAT registration",
          "PRO / renewals / government formalities",
          "Full setup package",
        ],
      },
      {
        key: "businessModel",
        label: "Brief business description",
        type: "textarea",
        required: true,
        placeholder: "What you sell, who you serve, Mainland vs Free Zone preference…",
      },
    ],
    phase1Notes: "Brief → match to formation/PRO specialists → scoped quote.",
  },
  {
    id: "wills-estate",
    slug: "wills-estate",
    number: 4,
    name: "Wills & Estate Planning",
    shortName: "Wills & Estate",
    eyebrow: "Protect your family",
    tagline:
      "Draft a clear Will with vetted lawyers — so your loved ones are not left fighting for what is already theirs.",
    description:
      "Without a proper Will, accounts can freeze, assets can stall, and families can face expensive disputes. Barristrly connects you with vetted legal professionals for clear, structured Will drafting and estate planning.",
    metaTitle: "Will Drafting & Estate Planning Lawyers in Dubai, UAE",
    metaDescription:
      "Protect your family with a properly drafted Will in the UAE. Vetted lawyers for DIFC, ADGM and non-Muslim wills, guardianship and cross-border assets.",
    pricingModel: "Quoted by complexity",
    monetization: "Matched to vetted Wills & estate lawyers",
    href: "/services/wills-estate",
    ctaLabel: "Start Will drafting",
    ctaHref: "/services/wills-estate#request",
    icon: ScrollText,
    tiers: [
      {
        id: "will",
        name: "Will drafting",
        priceAed: null,
        priceLabel: "Custom quote",
        detail: "Clear distribution instructions with vetted lawyers",
      },
      {
        id: "guardianship",
        name: "Guardianship & care wishes",
        priceAed: null,
        priceLabel: "Included where relevant",
        detail: "Guidance for minor children and trusted caregivers",
      },
      {
        id: "cross-border",
        name: "Cross-border assets",
        priceAed: null,
        priceLabel: "Custom quote",
        detail: "Planning across UAE, India, GCC, and other holdings",
      },
    ],
    deliverables: [
      "Connection to vetted Wills lawyers",
      "Drafting around your real family and assets",
      "Clearer instructions that reduce later disputes",
    ],
    benefits: [
      {
        title: "Protect your children",
        body: "Reduce the risk of frozen accounts, delays, and hardship when your family needs stability most.",
      },
      {
        title: "Avoid costly fights later",
        body: "A clear Will helps spare loved ones expensive legal battles over what should already be settled.",
      },
      {
        title: "Drafted properly",
        body: "Work with vetted professionals — not guesswork or mismatched templates.",
      },
    ],
    whoFor: [
      "Parents and caregivers",
      "Business owners with shares or property",
      "Expatriates with assets in more than one country",
    ],
    formSchema: [
      ...CONTACT_FIELDS,
      {
        key: "familyContext",
        label: "Family situation",
        type: "select",
        required: true,
        options: [
          "Married with children",
          "Single parent",
          "No children",
          "Prefer to discuss privately",
        ],
      },
      {
        key: "assetsSummary",
        label: "Main assets to cover",
        type: "textarea",
        required: true,
        placeholder: "Property, bank accounts, business shares, overseas assets…",
      },
      {
        key: "jurisdictions",
        label: "Where are assets / family based?",
        type: "text",
        required: true,
        placeholder: "e.g. UAE and India",
      },
    ],
    phase1Notes: "Sensitive brief → match to Wills lawyer → scoped drafting engagement.",
  },
  {
    id: "contract-drafting",
    slug: "contract-drafting",
    number: 5,
    name: "Corporate & Investment Contract Drafting",
    shortName: "Contract Drafting",
    eyebrow: "Clear agreements",
    tagline:
      "NDAs to shareholder, commercial, and investment agreements — drafted by vetted lawyers at fair rates.",
    description:
      "Good deals need clear contracts. Barristrly connects you with vetted legal professionals for corporate, commercial, and individual investment drafting — with practical turnaround and transparent pricing.",
    metaTitle: "Contract Drafting Lawyers in Dubai — NDAs & Shareholder Agreements",
    metaDescription:
      "Get NDAs, shareholder agreements, JV, MSA and investment contracts drafted by vetted UAE lawyers. Fixed AED rates, fast turnaround, quote within 48 hours.",
    pricingModel: "Fixed or scoped by agreement type",
    monetization: "One-time drafting fee via matched lawyers",
    href: "/services/contract-drafting",
    ctaLabel: "Request contract drafting",
    ctaHref: "/services/contract-drafting#request",
    icon: PenLine,
    tiers: [
      {
        id: "foundational",
        name: "Foundational agreements",
        priceAed: null,
        priceLabel: "From quote",
        detail: "NDAs, MOUs, LOIs, consultancy and employment contracts",
      },
      {
        id: "corporate",
        name: "Corporate & commercial",
        priceAed: null,
        priceLabel: "From quote",
        detail: "SHA, JVA, MSA/SOW, supply, distribution, IP/SaaS",
      },
      {
        id: "investment",
        name: "Investment agreements",
        priceAed: null,
        priceLabel: "From quote",
        detail: "Equity, convertibles/SAFE terms, loans, co-investment",
      },
    ],
    deliverables: [
      "Draft or redline tailored to your deal",
      "Clear commercial and risk language",
      "Revision rounds as agreed in scope",
    ],
    benefits: [
      {
        title: "Fair rates",
        body: "Pay for focused drafting — not unnecessary law-firm overhead on every agreement.",
      },
      {
        title: "Faster momentum",
        body: "Structured intake and matching help drafts move when your deal cannot wait.",
      },
      {
        title: "Right specialist",
        body: "Different contracts need different expertise — we match accordingly.",
      },
    ],
    whoFor: [
      "Startups and SMEs closing deals",
      "Founders raising or investing capital",
      "Companies standardising commercial paperwork",
    ],
    formSchema: [
      ...CONTACT_FIELDS,
      {
        key: "agreementType",
        label: "Agreement type",
        type: "select",
        required: true,
        options: [
          "NDA / confidentiality",
          "Shareholders Agreement",
          "Joint Venture",
          "MSA / SOW",
          "Employment / consultancy",
          "Investment / SAFE / loan",
          "Other commercial agreement",
        ],
      },
      {
        key: "keyTerms",
        label: "Key terms or deal summary",
        type: "textarea",
        required: true,
      },
      {
        key: "sourceFile",
        label: "Upload existing draft (optional)",
        type: "file",
        accept: ".pdf,.docx,.doc",
        helpText: "Word or PDF · up to 25MB",
      },
    ],
    phase1Notes: "Brief + optional file → match drafter → scoped fee + turnaround.",
  },
  {
    id: "retainers",
    slug: "retainers",
    number: 6,
    name: "Flexible Legal Retainers",
    shortName: "Legal Retainers",
    eyebrow: "Ongoing support",
    tagline:
      "Ongoing vetted legal support for startups and mid-size companies — switch anytime, pay fairly for completed work.",
    description:
      "Growing companies need legal help often — contracts, HR, compliance, and early disputes. Barristrly offers flexible retainers with vetted professionals, the freedom to switch if the fit is wrong, and clear pro-rata billing for completed work.",
    metaTitle: "Monthly Legal Retainer for Startups & SMEs in the UAE",
    metaDescription:
      "Ongoing legal support from vetted UAE lawyers on a flexible monthly retainer — contracts, HR, compliance and disputes. Switch anytime, pay pro-rata.",
    pricingModel: "Monthly retainer · pro-rata for completed work",
    monetization: "Recurring matched counsel with fair exit terms",
    href: "/services/retainers",
    ctaLabel: "Enquire about a retainer",
    ctaHref: "/services/retainers#request",
    icon: Handshake,
    tiers: [
      {
        id: "startup",
        name: "Startup retainer",
        priceAed: null,
        priceLabel: "Custom quote",
        detail: "Ongoing contracts, NDAs, and growth support",
      },
      {
        id: "midsize",
        name: "Mid-size retainer",
        priceAed: null,
        priceLabel: "Custom quote",
        detail: "Higher volume commercial, HR, and governance support",
      },
    ],
    deliverables: [
      "Matched vetted legal professional",
      "Clear scope and turnaround expectations",
      "Ability to switch with pro-rata billing",
    ],
    benefits: [
      {
        title: "End trial-and-error hiring",
        body: "Get matched to suitable, vetted practitioners instead of testing random referrals at your expense.",
      },
      {
        title: "Switch anytime",
        body: "If communication or fit is wrong, Barristrly helps you move to another vetted professional.",
      },
      {
        title: "Fair billing",
        body: "Pay on a pro-rata basis for completed work — protecting your cash flow.",
      },
    ],
    whoFor: [
      "Startups closing frequent contracts",
      "Mid-size companies needing steady legal cover",
      "Teams that outgrew ad-hoc lawyer hiring",
    ],
    formSchema: [
      { key: "companyName", label: "Company name", type: "text", required: true },
      { key: "contactName", label: "Contact name", type: "text", required: true },
      { key: "email", label: "Work email", type: "email", required: true },
      { key: "phone", label: "Phone", type: "tel", required: true },
      {
        key: "focus",
        label: "Main legal needs",
        type: "select",
        required: true,
        options: [
          "Commercial contracts",
          "Employment / HR",
          "Corporate governance",
          "Early disputes / notices",
          "Mix of the above",
        ],
      },
      {
        key: "needs",
        label: "Tell us about your company and volume",
        type: "textarea",
        required: true,
        placeholder: "Team size, typical contracts per month, jurisdictions…",
      },
    ],
    phase1Notes: "Company brief → match retainer counsel → scoped monthly terms.",
  },
];

export function getServiceBySlug(slug: string): CatalogService | undefined {
  return SERVICE_CATALOG.find((s) => s.slug === slug);
}

export function serviceNavLinks(): {
  name: string;
  href: string;
  description: string;
}[] {
  return SERVICE_CATALOG.map((s) => ({
    name: s.shortName,
    href: s.href,
    description: s.tagline,
  }));
}

export type ServiceRequestPayload = {
  schemaVersion: "barristrly.service-request.v1";
  serviceId: ServiceId;
  serviceSlug: string;
  submittedAt: string;
  source: "web-phase1";
  fields: Record<string, string | number | boolean | null>;
};
