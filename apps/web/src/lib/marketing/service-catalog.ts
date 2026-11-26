/**
 * Barristrly service catalog (7 services, fixed sequence).
 * Barristrly connects clients with vetted professionals — it is not a law firm.
 */

import type { LucideIcon } from "lucide-react";
import {
  Users,
  MessageSquare,
  Handshake,
  PenLine,
  ScrollText,
  Building2,
  FileText,
} from "lucide-react";

export type ServiceId =
  | "lawyer-matching"
  | "consultation"
  | "retainers"
  | "contract-drafting"
  | "wills-estate"
  | "company-formation"
  | "agreements-ebooks";

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
    id: "lawyer-matching",
    slug: "lawyer-matching",
    number: 1,
    name: "Lawyer Matching",
    shortName: "Lawyer Matching",
    eyebrow: "Absolutely free",
    tagline:
      "Find the right legal professional in the UAE — absolutely free.",
    description:
      "Tell us what you need. Barristrly matches you with vetted, licensed legal professionals suited to your matter, practice area, and location — at no charge for the match.",
    metaTitle: "Free Lawyer Matching in Dubai & UAE | Barristrly",
    metaDescription:
      "Find the right legal professional in the UAE — absolutely free. Get matched with vetted lawyers for your matter. Reply within 48 hours.",
    pricingModel: "Absolutely free",
    monetization: "Free matching · paid services optional after match",
    href: "/services/lawyer-matching",
    ctaLabel: "Get matched for free",
    ctaHref: "/services/lawyer-matching#request",
    secondaryCtaLabel: "Book a consultation",
    secondaryCtaHref: "/services/consultation",
    icon: Users,
    tiers: [
      {
        id: "free-match",
        name: "Free lawyer match",
        priceAed: 0,
        priceLabel: "Free",
        detail: "Matched introductions to vetted legal professionals",
        features: [
          "No matching fee",
          "Practice-area and location fit",
          "Reply within 48 hours",
        ],
      },
    ],
    deliverables: [
      "Short brief of your legal need",
      "Introductions to suitable vetted professionals",
      "Clear next steps — no obligation to hire",
    ],
    benefits: [
      {
        title: "Absolutely free",
        body: "You pay nothing for the match. Engage a lawyer only if the fit is right.",
      },
      {
        title: "Right specialist",
        body: "We match by matter type, not a random directory listing.",
      },
      {
        title: "Faster than referrals alone",
        body: "One request instead of chasing several contacts yourself.",
      },
    ],
    whoFor: [
      "Individuals who need the right lawyer for a personal matter",
      "Businesses looking for specialised counsel",
      "Anyone unsure where to start in the UAE",
    ],
    formSchema: [
      ...CONTACT_FIELDS,
      {
        key: "matterType",
        label: "What do you need help with?",
        type: "select",
        required: true,
        options: [
          "Contracts / commercial",
          "Company / corporate",
          "Employment",
          "Property / real estate",
          "Family / wills",
          "Dispute / debt",
          "Other",
        ],
      },
      {
        key: "summary",
        label: "Brief summary of your situation",
        type: "textarea",
        required: true,
        placeholder: "Keep it high-level — we will ask for details only as needed.",
      },
      {
        key: "location",
        label: "Preferred location",
        type: "select",
        options: ["Dubai", "Abu Dhabi", "Other UAE", "Remote / online", "Not sure"],
      },
    ],
    phase1Notes: "Free brief → match within 48h → introductions.",
  },
  {
    id: "consultation",
    slug: "consultation",
    number: 2,
    name: "Legal Consultation",
    shortName: "Legal Consultation",
    eyebrow: "From home or office",
    tagline:
      "Speak to qualified legal experts from the comfort of your home. Access the guidance you need, wherever you are.",
    description:
      "Book a private session with a vetted legal professional — online or by phone. Choose a short check-in or a detailed strategy session, with clear AED pricing before you pay.",
    metaTitle: "Legal Consultation Online in UAE | From AED 299 | Barristrly",
    metaDescription:
      "Speak to qualified legal experts from home. 15 min AED 299, 25–30 min AED 599, or 50–60 min detailed AED 1,199. Book through Barristrly.",
    pricingModel: "Fixed fee by session length",
    monetization: "Fixed consultation fees",
    href: "/services/consultation",
    ctaLabel: "Book a consultation",
    ctaHref: "/services/consultation#request",
    secondaryCtaLabel: "Free lawyer match",
    secondaryCtaHref: "/services/lawyer-matching",
    icon: MessageSquare,
    tiers: [
      {
        id: "express-15",
        name: "Express consultation",
        priceAed: 299,
        priceLabel: "AED 299",
        duration: "15 minutes",
        detail: "Quick questions and clear direction",
        features: ["Online or phone", "Focused advice", "Ideal for a first check"],
      },
      {
        id: "standard-30",
        name: "Standard consultation",
        priceAed: 599,
        priceLabel: "AED 599",
        duration: "25–30 minutes",
        detail: "Space to explain your situation and get practical next steps",
        features: ["Online or phone", "Document notes welcome", "Written follow-up summary on request"],
      },
      {
        id: "detailed-60",
        name: "Detailed consultation",
        priceAed: 1199,
        priceLabel: "AED 1,199",
        duration: "50–60 minutes",
        detail: "In-depth review for complex or multi-issue matters",
        features: [
          "Online or phone",
          "Pre-meeting document review where shared",
          "Clearer roadmap after the session",
        ],
      },
    ],
    deliverables: [
      "Confirmed time with a vetted legal professional",
      "Session focused on your questions",
      "Clear next steps after the call",
    ],
    benefits: [
      {
        title: "From wherever you are",
        body: "Speak to qualified experts without travelling to an office.",
      },
      {
        title: "Clear session pricing",
        body: "Choose 15, 25–30, or 50–60 minutes — know the fee before you book.",
      },
      {
        title: "Guidance you can act on",
        body: "Leave with practical next steps, not jargon.",
      },
    ],
    whoFor: [
      "People who want advice before deciding on full representation",
      "Founders and managers needing a quick expert view",
      "Anyone who prefers remote legal guidance",
    ],
    formSchema: [
      ...CONTACT_FIELDS,
      {
        key: "sessionLength",
        label: "Session length",
        type: "select",
        required: true,
        options: [
          "15 minutes — AED 299",
          "25–30 minutes — AED 599",
          "50–60 minutes detailed — AED 1,199",
        ],
      },
      {
        key: "topic",
        label: "What would you like to discuss?",
        type: "textarea",
        required: true,
      },
      {
        key: "preferredTime",
        label: "Preferred days / times",
        type: "text",
        placeholder: "e.g. weekday evenings, UAE time",
      },
    ],
    phase1Notes: "Select length → confirm fee → schedule with matched professional.",
  },
  {
    id: "retainers",
    slug: "retainers",
    number: 3,
    name: "Legal Retainers",
    shortName: "Legal Retainers",
    eyebrow: "Monthly support",
    tagline:
      "Choose an affordable monthly lawyers retainer plan to meet your ongoing legal needs.",
    description:
      "Growing companies need legal help often — contracts, HR, compliance, and early disputes. Barristrly offers flexible retainers with vetted professionals, the freedom to switch if the fit is wrong, and clear pro-rata billing for completed work.",
    metaTitle: "Flexible Legal Retainers for Startups & SMEs | Barristrly",
    metaDescription:
      "Affordable monthly lawyer retainer plans for startups and mid-size companies. Switch anytime. Pay fairly for completed work through Barristrly.",
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
        title: "Ongoing cover without lock-ins",
        body: "Continuous support at a fraction of full-time in-house counsel cost.",
      },
      {
        title: "Switch anytime",
        body: "If communication or fit is wrong, we help you move to another vetted professional.",
      },
      {
        title: "Fair billing",
        body: "Pay on a pro-rata basis for completed work.",
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
      },
    ],
    phase1Notes: "Company brief → match retainer counsel → scoped monthly terms.",
  },
  {
    id: "contract-drafting",
    slug: "contract-drafting",
    number: 4,
    name: "Contract Drafting",
    shortName: "Contract Drafting",
    eyebrow: "Clear agreements",
    tagline:
      "Get documentation done at reasonable charges — NDAs to shareholder, commercial, and investment agreements.",
    description:
      "Good deals need clear contracts. Barristrly connects you with vetted legal professionals for corporate, commercial, and individual investment drafting — with practical turnaround and transparent pricing.",
    metaTitle: "Contract Drafting Lawyers in Dubai & UAE | Barristrly",
    metaDescription:
      "Get NDAs, shareholder agreements, JV, MSA, and investment contracts drafted by vetted lawyers through Barristrly — clear rates and faster turnaround.",
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
        title: "Reasonable charges",
        body: "Pay for focused drafting — not unnecessary overhead on every agreement.",
      },
      {
        title: "Faster momentum",
        body: "Structured intake helps drafts move when your deal cannot wait.",
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
    id: "wills-estate",
    slug: "wills-estate",
    number: 5,
    name: "Wills and Estate",
    shortName: "Wills & Estate",
    eyebrow: "Protect your family",
    tagline:
      "Draft a clear Will with vetted lawyers — so your loved ones are not left fighting for what is already theirs.",
    description:
      "Without a proper Will, accounts can freeze, assets can stall, and families can face expensive disputes. Barristrly connects you with vetted legal professionals for clear, structured Will drafting and estate planning.",
    metaTitle: "Wills & Estate Planning with Vetted Lawyers | Barristrly",
    metaDescription:
      "Protect your children and family with proper Will drafting through vetted lawyers on Barristrly. Clear instructions, fewer disputes, lasting peace of mind.",
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
    id: "company-formation",
    slug: "company-formation",
    number: 6,
    name: "Company Formation and PRO",
    shortName: "Company Formation & PRO",
    eyebrow: "Setup from anywhere",
    tagline:
      "Company licensing, Corporate Tax, VAT, and PRO support with vetted professionals — inside or outside the UAE.",
    description:
      "Starting a UAE company is more than a trade licence. Barristrly helps you connect with vetted professionals for formation, Corporate Tax registration, VAT, and ongoing PRO formalities — whether you are in the UAE or abroad.",
    metaTitle: "UAE Company Formation, PRO & Tax Compliance | Barristrly",
    metaDescription:
      "Launch a UAE business from anywhere. Connect with vetted professionals for company formation, Corporate Tax, VAT registration, and PRO support.",
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
      },
    ],
    phase1Notes: "Brief → match to formation/PRO specialists → scoped quote.",
  },
  {
    id: "agreements-ebooks",
    slug: "agreements-ebooks",
    number: 7,
    name: "E-Books and Template Agreements",
    shortName: "E-Books & Templates",
    eyebrow: "Self-serve tools",
    tagline:
      "Ready agreement templates you can adapt, plus practical e-books for startups and mid-size companies.",
    description:
      "Move faster with structured agreement templates and clear business e-books made for startups and mid-size companies. When you need custom drafting or a lawyer later, Barristrly can connect you to vetted professionals.",
    metaTitle: "Agreement Templates & Business E-Books | Barristrly",
    metaDescription:
      "Buy practical agreement templates and e-books for startups and mid-size companies. Adapt documents as you need — upgrade to vetted legal help anytime.",
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
