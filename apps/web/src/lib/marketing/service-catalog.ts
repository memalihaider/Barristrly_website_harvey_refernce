/**
 * Barristrly service catalog — source of truth for public pages and request forms.
 * Keep customer-facing copy plain and consistent.
 */

export type ServiceId =
  | "lawyer-matching"
  | "consultation"
  | "retainers"
  | "contract-drafting"
  | "wills-estate"
  | "ebooks-pro"
  | "banking-capital"
  | "marketing-pr"
  | "vlo-fractional-gc"
  | "ip-brand";

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

/** Phase-1 form field — maps 1:1 into webhook / Airtable payloads */
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

export type CatalogService = {
  id: ServiceId;
  slug: string;
  number: number;
  name: string;
  shortName: string;
  eyebrow: string;
  tagline: string;
  description: string;
  pricingModel: string;
  monetization: string;
  href: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  tiers: CatalogTier[];
  deliverables: string[];
  formSchema: ServiceFormField[];
  phase1Notes: string;
  isNew?: boolean;
};

const JURISDICTION_OPTIONS = [
  "Mainland UAE Courts",
  "DIFC",
  "ADGM",
  "Tax / FTA",
  "Unsure",
];

const CATEGORY_OPTIONS = [
  "Corporate",
  "Real Estate",
  "Litigation",
  "Tax",
  "Employment",
  "IP / Brand",
  "Private Client",
  "Other",
];

const URGENCY_OPTIONS = [
  "Urgent (within 48 hours)",
  "High (within 1 week)",
  "Standard (planning)",
];

export const SERVICE_CATALOG: CatalogService[] = [
  {
    id: "lawyer-matching",
    slug: "lawyer-matching",
    number: 1,
    name: "Lawyer Matching",
    shortName: "Lawyer Matching",
    eyebrow: "Free for clients",
    tagline: "Tell us what you need. We introduce you to the right lawyer — at no cost to you.",
    description:
      "Share a short summary of your legal need. We review it and connect you with up to three carefully checked lawyers in the UAE — including mainland, DIFC, and ADGM matters. You receive clear options, usually within 24 hours.",
    pricingModel: "Free for clients",
    monetization: "Covered by our provider network",
    href: "/services/lawyer-matching",
    ctaLabel: "Get matched for free",
    ctaHref: "/services/lawyer-matching#request",
    secondaryCtaLabel: "How matching works",
    secondaryCtaHref: "/how-it-works",
    tiers: [
      {
        id: "free",
        name: "Free matching",
        priceAed: 0,
        priceLabel: "FREE",
        detail: "Reply within 24 hours · up to 3 lawyer introductions",
      },
    ],
    deliverables: [
      "A simple form for your details and legal need",
      "Confirmation by email or WhatsApp",
      "Up to three proposals from checked lawyers",
    ],
    formSchema: [
      { key: "clientName", label: "Full name", type: "text", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "phone", label: "WhatsApp / phone", type: "tel", required: true },
      {
        key: "serviceCategory",
        label: "Service category",
        type: "select",
        required: true,
        options: CATEGORY_OPTIONS,
      },
      {
        key: "jurisdiction",
        label: "Jurisdiction",
        type: "select",
        required: true,
        options: JURISDICTION_OPTIONS,
      },
      {
        key: "matterSummary",
        label: "Tell us about your matter",
        type: "textarea",
        required: true,
        placeholder: "Facts, parties, deadlines, desired outcome…",
      },
      {
        key: "urgency",
        label: "Urgency",
        type: "select",
        required: true,
        options: URGENCY_OPTIONS,
      },
    ],
    phase1Notes:
      "Webhook → Airtable CRM. Founder reviews, broadcasts to 2–3 advocates, approves proposals for client.",
  },
  {
    id: "consultation",
    slug: "consultation",
    number: 2,
    name: "Legal Consultations",
    shortName: "Consultations",
    eyebrow: "Paid sessions",
    tagline: "Speak with a vetted lawyer by video or phone — clear time and price before you book.",
    description:
      "Get practical advice on a question, contract, or next step. Choose a session length that fits your need. After payment, we confirm your time and send a meeting link.",
    pricingModel: "Fixed fee per session",
    monetization: "One-time payment",
    href: "/services/consultation",
    ctaLabel: "Book a consultation",
    ctaHref: "/services/consultation#request",
    tiers: [
      {
        id: "express",
        name: "Express Advisory",
        priceAed: 599,
        priceLabel: "AED 599",
        duration: "15–20 mins",
        scope: "A quick question, a short document check, or urgent verbal advice",
      },
      {
        id: "standard",
        name: "Standard Strategy",
        priceAed: 799,
        priceLabel: "AED 799",
        duration: "30 mins",
        scope: "Contract issues, company setup, or focused strategy",
      },
      {
        id: "comprehensive",
        name: "Comprehensive Advisory",
        priceAed: 999,
        priceLabel: "AED 999",
        duration: "45 mins",
        scope: "Several issues in one session, including before a dispute",
      },
      {
        id: "executive",
        name: "Executive Legal Audit",
        priceAed: 1299,
        priceLabel: "AED 1,299",
        duration: "60 mins",
        scope: "A fuller review, multi-party advice, and written notes",
      },
    ],
    deliverables: [
      "Confirmed meeting time after payment",
      "Video or phone meeting link",
      "Written notes on the Executive session",
    ],
    formSchema: [
      { key: "clientName", label: "Full name", type: "text", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "phone", label: "WhatsApp / phone", type: "tel", required: true },
      {
        key: "tierId",
        label: "Session package",
        type: "select",
        required: true,
        options: [
          "Express Advisory — AED 599",
          "Standard Strategy — AED 799",
          "Comprehensive Advisory — AED 999",
          "Executive Legal Audit — AED 1,299",
        ],
      },
      {
        key: "preferredSlot",
        label: "Preferred date and time (UAE time)",
        type: "text",
        required: true,
        placeholder: "e.g. Tuesday 18 Nov, 4:00 PM UAE time",
      },
      {
        key: "topic",
        label: "What do you need advice on?",
        type: "textarea",
        required: true,
      },
      {
        key: "documents",
        label: "Supporting documents (optional)",
        type: "file",
        accept: ".pdf,.docx,.doc",
      },
    ],
    phase1Notes:
      "Founder sends Stripe/Tap payment link + calendars manually. Phase 2: Stripe Checkout → Calendly → Meet webhook.",
  },
  {
    id: "retainers",
    slug: "retainers",
    number: 3,
    name: "Legal Retainers",
    shortName: "Retainers",
    eyebrow: "For startups & companies",
    tagline: "A set number of legal hours each month — drafting, review, and advice when you need it.",
    description:
      "Keep a lawyer available without hiring full-time. Choose a monthly package with a clear hour budget for contracts, reviews, and day-to-day advice.",
    pricingModel: "Monthly fee",
    monetization: "Monthly payment",
    href: "/services/retainers",
    ctaLabel: "Enquire about a retainer",
    ctaHref: "/services/retainers#request",
    tiers: [
      {
        id: "startup",
        name: "Startup Retainer",
        priceAed: 5999,
        priceLabel: "AED 5,999 / mo",
        detail: "10 hours of legal support each month",
        features: [
          "Option A: about 10 short contracts (2–3 pages)",
          "Option B: about 7 medium contracts (up to 5 pages)",
          "Option C: about 5 longer agreements (up to 7 pages)",
          "Option D: about 3 complex contracts with revisions",
        ],
      },
      {
        id: "corporate",
        name: "Corporate Retainer",
        priceAed: 7999,
        priceLabel: "AED 7,999 / mo",
        detail: "15 hours of legal support each month",
        features: [
          "Company legal support and priority drafting",
          "Employment and workplace guidance",
          "Help with trademark filings",
          "Unlimited short legal questions by phone",
        ],
      },
    ],
    deliverables: [
      "A clear monthly hour budget",
      "Flexible use for drafting and advice",
      "Faster turnaround than one-off work",
    ],
    formSchema: [
      { key: "companyName", label: "Company name", type: "text", required: true },
      { key: "contactName", label: "Contact name", type: "text", required: true },
      { key: "email", label: "Work email", type: "email", required: true },
      { key: "phone", label: "Phone", type: "tel", required: true },
      {
        key: "package",
        label: "Package",
        type: "select",
        required: true,
        options: [
          "Startup Retainer — AED 5,999/mo (10 hrs)",
          "Corporate Retainer — AED 7,999/mo (15 hrs)",
        ],
      },
      {
        key: "allocationPreference",
        label: "Preferred allocation style",
        type: "select",
        options: [
          "Option A — simple contracts",
          "Option B — medium contracts",
          "Option C — medium+",
          "Option D — heavy",
          "Mix / advise me",
        ],
      },
      {
        key: "needs",
        label: "Primary legal needs this quarter",
        type: "textarea",
        required: true,
      },
    ],
    phase1Notes: "Manual Stripe subscription link + Airtable hours tracker until portal Hours/Token UI ships.",
  },
  {
    id: "contract-drafting",
    slug: "contract-drafting",
    number: 4,
    name: "Contract Drafting & Review",
    shortName: "Contract Drafting",
    eyebrow: "Fixed-fee drafting",
    tagline: "From simple NDAs to complex shareholder agreements — priced by how detailed the work is.",
    description:
      "Tell us what you need written or reviewed, choose a clear price tier, and upload any existing draft. You know the fee before work begins.",
    pricingModel: "Fixed fee by tier",
    monetization: "One-time payment",
    href: "/services/contract-drafting",
    ctaLabel: "Request contract help",
    ctaHref: "/services/contract-drafting#request",
    tiers: [
      {
        id: "simple",
        name: "Simple Agreement",
        priceAed: 799,
        priceLabel: "AED 799",
        detail: "1–3 pages · NDAs, simple service agreements, basic powers of attorney, MoUs",
      },
      {
        id: "middle",
        name: "Middle Level",
        priceAed: 999,
        priceLabel: "AED 999",
        detail: "4–5 pages · Employment, lease, and standard vendor contracts",
      },
      {
        id: "middle-plus",
        name: "Middle Plus",
        priceAed: 1299,
        priceLabel: "AED 1,299",
        detail: "6–7 pages · Consultancy, distribution, and software licensing",
      },
      {
        id: "heavy",
        name: "Heavy Drafting",
        priceAed: 1999,
        priceLabel: "AED 1,999",
        detail: "8+ pages · Shareholder agreements, term sheets, joint ventures, custom work",
      },
    ],
    deliverables: [
      "A new draft or marked-up review",
      "A short form for your key terms",
      "Upload Word or PDF files (up to 25MB)",
    ],
    formSchema: [
      { key: "clientName", label: "Full name / company", type: "text", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "phone", label: "Phone", type: "tel", required: true },
      {
        key: "tierId",
        label: "Drafting tier",
        type: "select",
        required: true,
        options: [
          "Simple Agreement — AED 799",
          "Middle Level — AED 999",
          "Middle Plus — AED 1,299",
          "Heavy Drafting — AED 1,999",
        ],
      },
      {
        key: "contractType",
        label: "Contract type",
        type: "text",
        required: true,
        placeholder: "e.g. NDA, SHA, employment…",
      },
      {
        key: "keyTerms",
        label: "Key terms / instructions",
        type: "textarea",
        required: true,
      },
      {
        key: "sourceFile",
        label: "Upload existing draft (optional)",
        type: "file",
        accept: ".pdf,.docx,.doc",
        helpText: "Max 25MB · .docx or .pdf",
      },
    ],
    phase1Notes: "Form + upload → Airtable. Founder issues Tap/Stripe link for selected tier.",
  },
  {
    id: "wills-estate",
    slug: "wills-estate",
    number: 5,
    name: "Wills & Estate Planning",
    shortName: "Wills & Estate",
    eyebrow: "UAE wills support",
    tagline: "Simple templates through to complex family wills — official registration fees are separate.",
    description:
      "Answer a clear set of questions about your assets, beneficiaries, and guardians. Choose a package that fits your situation. Government or court registration fees are always charged separately.",
    pricingModel: "Fixed packages · government fees separate",
    monetization: "One-time fee, with optional lawyer review",
    href: "/services/wills-estate",
    ctaLabel: "Start your will request",
    ctaHref: "/services/wills-estate#request",
    tiers: [
      {
        id: "tier1",
        name: "Simple Template",
        priceAed: 799,
        priceLabel: "AED 799 (single)",
        detail: "Template only · suited to simpler single-asset situations",
      },
      {
        id: "tier2",
        name: "Customizable Will",
        priceAed: 999,
        priceLabel: "AED 999 / AED 1,699 pair",
        detail: "One lawyer review · beneficiaries and guardianship clauses",
      },
      {
        id: "tier3",
        name: "Complex Multi-Asset",
        priceAed: 1999,
        priceLabel: "AED 1,999 / AED 3,699 pair",
        detail: "Specialist review · multiple properties, overseas assets, or shares",
      },
    ],
    deliverables: [
      "A will package matched to your tier",
      "Couple / mirror will options on higher tiers",
      "Clear note that government fees are separate",
    ],
    formSchema: [
      { key: "fullName", label: "Full legal name", type: "text", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "phone", label: "Phone", type: "tel", required: true },
      {
        key: "tierId",
        label: "Will package",
        type: "select",
        required: true,
        options: [
          "Tier 1 Simple Template — AED 799",
          "Tier 2 Customizable — AED 999 (single)",
          "Tier 2 Mirror / Pair — AED 1,699",
          "Tier 3 Complex — AED 1,999 (single)",
          "Tier 3 Mirror / Pair — AED 3,699",
        ],
      },
      {
        key: "jurisdiction",
        label: "Preferred registry",
        type: "select",
        required: true,
        options: ["DIFC Wills", "ADGM", "UAE Courts", "Advise me"],
      },
      {
        key: "assetsSummary",
        label: "Asset breakdown",
        type: "textarea",
        required: true,
      },
      {
        key: "beneficiaries",
        label: "Beneficiaries & guardianship preferences",
        type: "textarea",
        required: true,
      },
      {
        key: "ackFees",
        label: "I understand government/court registration fees are charged separately",
        type: "checkbox",
        required: true,
      },
    ],
    phase1Notes: "Questionnaire → Airtable. Lawyer review scheduled manually for Tier 2–3.",
  },
  {
    id: "ebooks-pro",
    slug: "ebooks-pro",
    number: 6,
    name: "Guides & PRO Support",
    shortName: "Guides & PRO",
    eyebrow: "Guides and on-ground help",
    tagline: "Downloadable legal guides, plus help with visas, licences, and company paperwork.",
    description:
      "Buy a ready-made guide for quick reading, or request PRO support for visa work, trade licence renewal, document attestation, and company setup.",
    pricingModel: "Fixed guide prices · PRO quoted case by case",
    monetization: "Guide purchase or PRO service fee",
    href: "/services/ebooks-pro",
    ctaLabel: "Request guides or PRO help",
    ctaHref: "/services/ebooks-pro#request",
    tiers: [
      {
        id: "guide",
        name: "Standard Guide",
        priceAed: 99,
        priceLabel: "AED 99",
        detail: "PDF delivered after payment",
      },
      {
        id: "master",
        name: "Master Legal & Compliance Package",
        priceAed: 199,
        priceLabel: "AED 199",
        detail: "A fuller set of practical guides",
      },
      {
        id: "pro",
        name: "PRO Operational Services",
        priceAed: null,
        priceLabel: "Custom / fixed booking",
        detail: "Visas, trade licences, attestation, clearing, company formation",
      },
    ],
    deliverables: [
      "PDF guide sent to your email",
      "PRO requests reviewed with a clear quote",
    ],
    formSchema: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "phone", label: "Phone", type: "tel", required: true },
      {
        key: "product",
        label: "What do you need?",
        type: "select",
        required: true,
        options: [
          "E-Book — Standard Guide (AED 99)",
          "E-Book — Master Package (AED 199)",
          "PRO — Visa processing",
          "PRO — Trade license renewal",
          "PRO — Document attestation",
          "PRO — Company formation",
          "PRO — Custom clearing",
        ],
      },
      {
        key: "notes",
        label: "Details / company info",
        type: "textarea",
        required: true,
      },
      {
        key: "documents",
        label: "Upload supporting docs (PRO)",
        type: "file",
        accept: ".pdf,.jpg,.jpeg,.png,.docx",
      },
    ],
    phase1Notes: "E-book: Stripe link → email PDF. PRO: quote via WhatsApp after form.",
  },
  {
    id: "banking-capital",
    slug: "banking-capital",
    number: 7,
    name: "Banking & Capital Support",
    shortName: "Banking & Capital",
    eyebrow: "Free first review",
    tagline: "Help connecting with banking partners for mortgages, business loans, personal loans, and growth capital.",
    description:
      "Share a few details about what you need. We review your request at no charge and, where suitable, introduce you to partner banks or finance providers.",
    pricingModel: "Free first review",
    monetization: "Partner introduction fees where a facility is placed",
    href: "/services/banking-capital",
    ctaLabel: "Request a free review",
    ctaHref: "/services/banking-capital#request",
    tiers: [
      {
        id: "mortgage",
        name: "Mortgage Loans",
        priceAed: 0,
        priceLabel: "Free evaluation",
      },
      {
        id: "corporate",
        name: "Corporate & Working Capital",
        priceAed: 0,
        priceLabel: "Free evaluation",
      },
      {
        id: "personal",
        name: "Personal Loans",
        priceAed: 0,
        priceLabel: "Free evaluation",
      },
      {
        id: "equity",
        name: "Equity & Growth Capital",
        priceAed: 0,
        priceLabel: "Free evaluation",
      },
    ],
    deliverables: [
      "A simple form for your finance need",
      "An introduction to a partner when you qualify",
    ],
    formSchema: [
      { key: "name", label: "Full name", type: "text", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "phone", label: "Phone", type: "tel", required: true },
      {
        key: "channel",
        label: "Facility type",
        type: "select",
        required: true,
        options: [
          "Mortgage Loans",
          "Corporate & Working Capital Loans",
          "Personal Loans",
          "Equity & Growth Capital",
        ],
      },
      {
        key: "amountAed",
        label: "Requested amount (AED)",
        type: "number",
        required: true,
      },
      {
        key: "incomeOrTurnover",
        label: "Salary / turnover (AED)",
        type: "text",
        required: true,
      },
      {
        key: "companyAge",
        label: "Company age (if corporate)",
        type: "text",
      },
      {
        key: "statements",
        label: "Financial statements / salary cert",
        type: "file",
        accept: ".pdf,.xlsx,.xls,.jpg,.png",
      },
    ],
    phase1Notes: "Lead → Airtable → founder routes to banking partners.",
  },
  {
    id: "marketing-pr",
    slug: "marketing-pr",
    number: 8,
    name: "Marketing & PR",
    shortName: "Marketing & PR",
    eyebrow: "For firms & companies",
    tagline: "Press releases and ongoing PR support for law firms, startups, and businesses in the GCC.",
    description:
      "Get help telling your story in the right places — from a single press release package to monthly PR support across regional media and LinkedIn.",
    pricingModel: "From AED 2,499, or AED 7,999 / month",
    monetization: "Project fee or monthly retainer",
    href: "/services/marketing-pr",
    ctaLabel: "Book a PR call",
    ctaHref: "/services/marketing-pr#request",
    tiers: [
      {
        id: "press",
        name: "Press Release Bundle",
        priceAed: 2499,
        priceLabel: "AED 2,499",
        detail: "Press release writing and distribution",
      },
      {
        id: "full-pr",
        name: "Full Corporate PR Management",
        priceAed: 7999,
        priceLabel: "AED 7,999 / mo",
        detail: "Ongoing media outreach and positioning",
      },
    ],
    deliverables: [
      "Access to established media channels",
      "A planning call or direct booking",
    ],
    formSchema: [
      { key: "organization", label: "Organization", type: "text", required: true },
      { key: "contactName", label: "Contact name", type: "text", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "phone", label: "Phone", type: "tel", required: true },
      {
        key: "package",
        label: "Interest",
        type: "select",
        required: true,
        options: [
          "Press Release Bundle — AED 2,499",
          "Full Corporate PR — AED 7,999/mo",
          "Strategy call first",
        ],
      },
      {
        key: "goals",
        label: "Campaign goals / story",
        type: "textarea",
        required: true,
      },
    ],
    phase1Notes: "Intake → WhatsApp strategy call → proposal + payment link.",
  },
  {
    id: "vlo-fractional-gc",
    slug: "vlo-fractional-gc",
    number: 9,
    name: "Virtual Legal Officer",
    shortName: "Virtual Legal Officer",
    eyebrow: "New · For growing companies",
    tagline: "Senior legal leadership for your business — without hiring a full-time general counsel.",
    description:
      "Get 25 hours each month of senior legal guidance for a growing company. Start with a short discovery call to see if the fit is right.",
    pricingModel: "AED 12,500 / month · 25 hours",
    monetization: "Monthly retainer",
    href: "/services/vlo-fractional-gc",
    ctaLabel: "Book a discovery call",
    ctaHref: "/services/vlo-fractional-gc#request",
    isNew: true,
    tiers: [
      {
        id: "vlo",
        name: "Virtual Legal Officer",
        priceAed: 12500,
        priceLabel: "AED 12,500 / mo",
        detail: "25 hours of senior legal support each month",
      },
    ],
    deliverables: [
      "Ongoing senior legal support",
      "A sample retainer to review",
      "A discovery call to plan next steps",
    ],
    formSchema: [
      { key: "companyName", label: "Company", type: "text", required: true },
      { key: "role", label: "Your role", type: "text", required: true },
      { key: "email", label: "Work email", type: "email", required: true },
      { key: "phone", label: "Phone", type: "tel", required: true },
      {
        key: "headcount",
        label: "Approx. headcount",
        type: "select",
        options: ["1–20", "21–50", "51–200", "200+"],
      },
      {
        key: "priorities",
        label: "Top legal priorities next 90 days",
        type: "textarea",
        required: true,
      },
      {
        key: "preferredSlot",
        label: "Preferred call time (UAE time)",
        type: "text",
        required: true,
      },
    ],
    phase1Notes: "High-touch founder sales. Sample retainer PDF emailed after form.",
  },
  {
    id: "ip-brand",
    slug: "ip-brand",
    number: 10,
    name: "IP & Brand Protection",
    shortName: "IP & Brand",
    eyebrow: "New · Trademarks",
    tagline: "Help protecting your brand name and trademark in the UAE and internationally.",
    description:
      "We help you check availability and prepare filings for trademarks and related brand protection. Our service fee is separate from official government fees.",
    pricingModel: "AED 1,499 per class · government fees separate",
    monetization: "Service fee per class",
    href: "/services/ip-brand",
    ctaLabel: "Request a trademark check",
    ctaHref: "/services/ip-brand#request",
    isNew: true,
    tiers: [
      {
        id: "per-class",
        name: "Trademark per class",
        priceAed: 1499,
        priceLabel: "AED 1,499 / class",
        detail: "Does not include official government fees",
      },
    ],
    deliverables: [
      "A trademark availability check",
      "Help gathering required documents",
      "Coordination of the filing steps",
    ],
    formSchema: [
      { key: "ownerName", label: "Owner / company name", type: "text", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "phone", label: "Phone", type: "tel", required: true },
      {
        key: "markName",
        label: "Mark / brand name",
        type: "text",
        required: true,
      },
      {
        key: "classes",
        label: "Describe your goods or services (or trademark classes)",
        type: "textarea",
        required: true,
      },
      {
        key: "territory",
        label: "Territory",
        type: "select",
        required: true,
        options: ["UAE (Ministry of Economy)", "WIPO / international", "Both / advise me"],
      },
      {
        key: "tradeLicense",
        label: "Trade license copy",
        type: "file",
        accept: ".pdf,.jpg,.png",
        required: true,
      },
      {
        key: "poa",
        label: "Power of Attorney (if available)",
        type: "file",
        accept: ".pdf,.jpg,.png",
      },
      {
        key: "ackFees",
        label: "I understand official government fees are charged separately",
        type: "checkbox",
        required: true,
      },
    ],
    phase1Notes: "Search request → Airtable → founder coordinates filing + govt fee quote.",
  },
];

export function getServiceBySlug(slug: string): CatalogService | undefined {
  return SERVICE_CATALOG.find((s) => s.slug === slug);
}

export function serviceNavLinks(): { name: string; href: string; description: string }[] {
  return SERVICE_CATALOG.map((s) => ({
    name: s.isNew ? `${s.shortName} · New` : s.shortName,
    href: s.href,
    description: s.tagline,
  }));
}

/** Stable JSON envelope for Phase-1 webhooks / Phase-2 automation */
export type ServiceRequestPayload = {
  schemaVersion: "barristrly.service-request.v1";
  serviceId: ServiceId;
  serviceSlug: string;
  submittedAt: string;
  source: "web-phase1";
  fields: Record<string, string | number | boolean | null>;
};
