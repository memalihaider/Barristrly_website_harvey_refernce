/**
 * Barristrly Service Master Catalog (Phase 1 → Phase 2)
 *
 * Data shapes here are the source of truth for marketing pages, forms, and
 * future automation. Field schemas are JSON-serializable so Phase-1 submissions
 * can feed Airtable / Make.com / Phase-2 pipelines without DB restructuring.
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
  "FTA / Tax",
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
    name: "Lawyer Matching & Referral Engine",
    shortName: "Lawyer Matching",
    eyebrow: "Free for clients",
    tagline: "Zero-cost intake. Matched to verified MOJ, DIFC, ADGM, or FTA counsel.",
    description:
      "Capture legal inquiries, standardize briefs, and match clients with verified practitioners. Phase 1: founder-curated broadcast to 2–3 advocates. Phase 2: automated matching to top 3.",
    pricingModel: "FREE for clients",
    monetization: "Provider listing fees / platform referral commission",
    href: "/services/lawyer-matching",
    ctaLabel: "Submit free intake",
    ctaHref: "/services/lawyer-matching#request",
    secondaryCtaLabel: "How matching works",
    secondaryCtaHref: "/how-it-works",
    tiers: [
      {
        id: "free",
        name: "Client Intake",
        priceAed: 0,
        priceLabel: "FREE",
        detail: "24-hour SLA confirmation · up to 3 matched advocates",
      },
    ],
    deliverables: [
      "Multi-step intake (name, contact, category, jurisdiction, matter, urgency)",
      "Auto confirmation email/SMS with 24-hour SLA",
      "Curated proposals from vetted providers",
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
        label: "Summary of matter",
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
    name: "On-Demand Legal Consultation & Strategy Sessions",
    shortName: "Consultations",
    eyebrow: "Paid sessions",
    tagline: "Structured video/phone strategy with vetted lawyers — from express to executive audit.",
    description:
      "Immediate legal advice, case assessment, or document review. Checkout + calendar hold in Phase 1; Stripe/Tap + Meet/Zoom automation in Phase 2.",
    pricingModel: "Fixed fee per session (AED)",
    monetization: "One-time Stripe/Tap checkout",
    href: "/services/consultation",
    ctaLabel: "Book consultation",
    ctaHref: "/services/consultation#request",
    tiers: [
      {
        id: "express",
        name: "Express Advisory",
        priceAed: 599,
        priceLabel: "AED 599",
        duration: "15–20 mins",
        scope: "Quick query, single document check, urgent verbal advice",
      },
      {
        id: "standard",
        name: "Standard Strategy",
        priceAed: 799,
        priceLabel: "AED 799",
        duration: "30 mins",
        scope: "Contract disputes, corporate setup strategy",
      },
      {
        id: "comprehensive",
        name: "Comprehensive Advisory",
        priceAed: 999,
        priceLabel: "AED 999",
        duration: "45 mins",
        scope: "Multi-issue consultation, pre-litigation analysis",
      },
      {
        id: "executive",
        name: "Executive Legal Audit",
        priceAed: 1299,
        priceLabel: "AED 1,299",
        duration: "60 mins",
        scope: "Complex matter review, multi-party advice, written notes",
      },
    ],
    deliverables: [
      "Calendar slot after payment confirmation",
      "Zoom / Google Meet link",
      "Session notes on Executive tier",
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
        label: "Preferred date / time (GST)",
        type: "text",
        required: true,
        placeholder: "e.g. Tue 18 Nov, 4:00 PM GST",
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
    name: "Flexible Legal Retainer Packages",
    shortName: "Retainers",
    eyebrow: "Startup & corporate",
    tagline: "Monthly legal allocation for drafting, review, advisory, and governance.",
    description:
      "Dedicated counsel retainers with clear hour budgets. Client dashboard will show Hours/Token Tracker in Phase 2; Phase 1 uses Airtable allocation tracking.",
    pricingModel: "Monthly subscription (AED)",
    monetization: "Stripe Billing recurring",
    href: "/services/retainers",
    ctaLabel: "Start retainer enquiry",
    ctaHref: "/services/retainers#request",
    tiers: [
      {
        id: "startup",
        name: "Startup Retainer",
        priceAed: 5999,
        priceLabel: "AED 5,999 / mo",
        detail: "10 hours legal allocation",
        features: [
          "Option A: 10 simple contracts (2–3 pp)",
          "Option B: 7 medium contracts (max 5 pp)",
          "Option C: 5 medium+ agreements (max 7 pp)",
          "Option D: 3 heavy contracts (complex / multi-revision)",
        ],
      },
      {
        id: "corporate",
        name: "Corporate Retainer",
        priceAed: 7999,
        priceLabel: "AED 7,999 / mo",
        detail: "15 hours legal allocation",
        features: [
          "Corporate governance & priority drafting",
          "Employment compliance",
          "Trademark filing assistance",
          "Unlimited legal phone Q&A",
        ],
      },
    ],
    deliverables: [
      "Monthly hour allocation",
      "Flexible drafting options",
      "Priority turnaround",
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
    name: "Bespoke Contract Drafting & Legal Review",
    shortName: "Contract Drafting",
    eyebrow: "Fixed-fee drafting",
    tagline: "Four complexity tiers — NDAs to shareholders agreements.",
    description:
      "Fixed-fee drafting and review with file upload. Auto page-count assist in Phase 2; Phase 1 allows manual tier selection + checkout link.",
    pricingModel: "Fixed fee by tier (AED)",
    monetization: "One-time payment",
    href: "/services/contract-drafting",
    ctaLabel: "Request drafting quote",
    ctaHref: "/services/contract-drafting#request",
    tiers: [
      {
        id: "simple",
        name: "Simple Agreement",
        priceAed: 799,
        priceLabel: "AED 799",
        detail: "1–3 pages · NDAs, simple services, basic PoA, MoUs",
      },
      {
        id: "middle",
        name: "Middle Level",
        priceAed: 999,
        priceLabel: "AED 999",
        detail: "4–5 pages · Employment, lease, standard vendor",
      },
      {
        id: "middle-plus",
        name: "Middle Plus",
        priceAed: 1299,
        priceLabel: "AED 1,299",
        detail: "6–7 pages · Consultancy, distribution, software licensing",
      },
      {
        id: "heavy",
        name: "Heavy Drafting",
        priceAed: 1999,
        priceLabel: "AED 1,999",
        detail: "8+ pages · SHA, term sheets, JV, complex custom",
      },
    ],
    deliverables: [
      "Draft or redline per tier",
      "Key-terms questionnaire",
      ".docx / .pdf upload (up to 25MB)",
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
    name: "Will Preparation & Estate Planning Suite",
    shortName: "Wills & Estate",
    eyebrow: "DIFC / ADGM / UAE Courts",
    tagline: "Templates to complex multi-asset and mirror wills — registration fees separate.",
    description:
      "Dynamic questionnaire for assets, beneficiaries, and guardianship. Clear UX disclaimers for government/court registration fees.",
    pricingModel: "Fixed tiers (AED) · govt fees excluded",
    monetization: "One-time + optional lawyer review",
    href: "/services/wills-estate",
    ctaLabel: "Start will questionnaire",
    ctaHref: "/services/wills-estate#request",
    tiers: [
      {
        id: "tier1",
        name: "Simple Template",
        priceAed: 799,
        priceLabel: "AED 799 (single)",
        detail: "No lawyer review · standard single-asset / single-beneficiary",
      },
      {
        id: "tier2",
        name: "Customizable Will",
        priceAed: 999,
        priceLabel: "AED 999 / AED 1,699 pair",
        detail: "1 round lawyer vetting · beneficiaries & guardianship",
      },
      {
        id: "tier3",
        name: "Complex Multi-Asset",
        priceAed: 1999,
        priceLabel: "AED 1,999 / AED 3,699 pair",
        detail: "Specialist review · multi-property, offshore, shareholding",
      },
    ],
    deliverables: [
      "Will package per tier",
      "Mirror / pair options on Tier 2–3",
      "Disclaimer: govt registration charged separately",
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
    name: "E-Books, Digital Bundles & Document Clearing PRO",
    shortName: "E-Books & PRO",
    eyebrow: "Digital + boots-on-ground",
    tagline: "Instant legal guides plus PRO support for visas, licenses, and attestation.",
    description:
      "Digital store for PDF guides and operational PRO services (visa, trade license, attestation, company formation).",
    pricingModel: "E-books fixed · PRO custom/fixed booking",
    monetization: "Instant PDF delivery + PRO quotes",
    href: "/services/ebooks-pro",
    ctaLabel: "Browse digital & PRO",
    ctaHref: "/services/ebooks-pro#request",
    tiers: [
      {
        id: "guide",
        name: "Standard Guide",
        priceAed: 99,
        priceLabel: "AED 99",
        detail: "Instant PDF license delivery",
      },
      {
        id: "master",
        name: "Master Legal & Compliance Package",
        priceAed: 199,
        priceLabel: "AED 199",
        detail: "Expanded toolkit bundle",
      },
      {
        id: "pro",
        name: "PRO Operational Services",
        priceAed: null,
        priceLabel: "Custom / fixed booking",
        detail: "Visa, trade license, attestation, clearing, company formation",
      },
    ],
    deliverables: [
      "Automated PDF delivery for e-books",
      "PRO selector + document upload for quotes",
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
    name: "Banking, Mortgage & Capital Advisory Desk",
    shortName: "Banking & Capital",
    eyebrow: "Affiliate facilitation",
    tagline: "Connect to partner banks for mortgage, working capital, personal loans, and equity.",
    description:
      "Free client evaluation. Monetized via banking affiliate/finder fees (0.5%–1.5% of disbursed facility).",
    pricingModel: "FREE evaluation",
    monetization: "Banking finder fees 0.5%–1.5%",
    href: "/services/banking-capital",
    ctaLabel: "Start financial intake",
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
      "Four-channel intake",
      "Partner bank introduction when eligible",
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
    name: "Marketing, Advertising & Corporate PR Desk",
    shortName: "Marketing & PR",
    eyebrow: "GCC legal & corporate PR",
    tagline: "Press releases to full corporate PR for law firms, startups, and enterprises.",
    description:
      "Bespoke media outreach across Gulf News, Khaleej Times, Arabian Business, LinkedIn Pulse campaigns.",
    pricingModel: "AED 2,499 bundle → AED 7,999/mo retainer",
    monetization: "Project + monthly PR management",
    href: "/services/marketing-pr",
    ctaLabel: "Book PR strategy call",
    ctaHref: "/services/marketing-pr#request",
    tiers: [
      {
        id: "press",
        name: "Press Release Bundle",
        priceAed: 2499,
        priceLabel: "AED 2,499",
        detail: "Distribution package",
      },
      {
        id: "full-pr",
        name: "Full Corporate PR Management",
        priceAed: 7999,
        priceLabel: "AED 7,999 / mo",
        detail: "Ongoing media & positioning",
      },
    ],
    deliverables: [
      "Media distribution network access",
      "Strategy call or direct booking",
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
    name: "Virtual Legal Officer & Fractional GC",
    shortName: "VLO / Fractional GC",
    eyebrow: "NEW · Enterprise",
    tagline: "Senior fractional General Counsel without full-time executive overhead.",
    description:
      "25 hours/month of senior executive legal management for scaling mid-market companies. Discovery call + sample retainer download.",
    pricingModel: "AED 12,500 / month · 25 hours",
    monetization: "Enterprise monthly retainer",
    href: "/services/vlo-fractional-gc",
    ctaLabel: "Book founder discovery call",
    ctaHref: "/services/vlo-fractional-gc#request",
    isNew: true,
    tiers: [
      {
        id: "vlo",
        name: "Virtual Legal Officer",
        priceAed: 12500,
        priceLabel: "AED 12,500 / mo",
        detail: "25 hours senior executive legal management",
      },
    ],
    deliverables: [
      "Fractional GC coverage",
      "Sample retainer agreement",
      "Founder discovery calendar",
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
        label: "Preferred discovery call slot (GST)",
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
    name: "Intellectual Property & Brand Protection Desk",
    shortName: "IP & Brand",
    eyebrow: "NEW · Trademarks",
    tagline: "UAE Ministry of Economy and WIPO trademark, copyright, and brand protection.",
    description:
      "End-to-end trademark search and registration support. Official government fees exclusive of Barristrly service fee.",
    pricingModel: "AED 1,499 per class · govt fees excluded",
    monetization: "Per-class service fee",
    href: "/services/ip-brand",
    ctaLabel: "Request trademark search",
    ctaHref: "/services/ip-brand#request",
    isNew: true,
    tiers: [
      {
        id: "per-class",
        name: "Trademark per class",
        priceAed: 1499,
        priceLabel: "AED 1,499 / class",
        detail: "Exclusive of official government fees",
      },
    ],
    deliverables: [
      "Availability search request",
      "PoA + trade license document collection",
      "Filing coordination",
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
        label: "Nice classes (or describe goods/services)",
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
