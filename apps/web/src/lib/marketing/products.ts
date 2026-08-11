export type ProductId =
  | "marketplace"
  | "crm"
  | "pms"
  | "accounting"
  | "clm"
  | "arbitration"
  | "documents"
  | "research";

export type ProductFeature = { title: string; body: string };

export type Product = {
  id: ProductId;
  name: string;
  href: string;
  tagline: string;
  description: string;
  navDescription: string;
  eyebrow: string;
  comingDetail: string;
  highlights: { value: string; label: string }[];
  features: ProductFeature[];
};

export const PRODUCTS: Product[] = [
  {
    id: "marketplace",
    name: "Legal Marketplace",
    href: "/marketplace",
    tagline: "Match counsel with confidence",
    description:
      "Anonymous directory, two-gate COI, confidential meetings, and escrow — so clients from India, Pakistan, the UAE, and worldwide can evaluate, meet, and hire without flying in.",
    navDescription:
      "Anonymous directory, COI, meetings, escrow, and global matching.",
    eyebrow: "Product 01",
    comingDetail: "",
    highlights: [
      { value: "Anonymous", label: "Directory + meetings" },
      { value: "COI", label: "Two-gate before reveal" },
      { value: "Escrow", label: "Session fees held" },
      { value: "Global", label: "India · PK · UAE · world" },
    ],
    features: [],
  },
  {
    id: "crm",
    name: "CRM / Client Management",
    href: "/products/crm",
    tagline: "From masked lead to retained client",
    description:
      "A client record that respects Barristrly anonymity — intake, notes, and pipeline stay structured before identity unlocks, then convert into a living client file after mutual consent.",
    navDescription:
      "Leads, notes, and client files that respect anonymity until unlock.",
    eyebrow: "Product 02",
    comingDetail:
      "Detailing with the team in the next product session. This page is the working brief.",
    highlights: [
      { value: "Masked", label: "Until double opt-in" },
      { value: "Pipeline", label: "Lead → consult → retain" },
      { value: "Notes", label: "Matter-safe activity" },
    ],
    features: [
      {
        title: "Anonymous until unlock",
        body: "Contact details stay platform-held. The CRM shows Client #IDs and case parameters until both sides affirm — no spam channel, no premature solicitation.",
      },
      {
        title: "Intake-ready records",
        body: "BARRI classification, practice area, forum, and budget land in the same file the lawyer works from after COI clearance.",
      },
      {
        title: "Pipeline, not a dump",
        body: "Qualified marketplace leads, consult status, and post-meeting accept/decline — so firms stop chasing cold open inquiries.",
      },
    ],
  },
  {
    id: "pms",
    name: "Practice Management System",
    href: "/products/pms",
    tagline: "Run the matter after the match",
    description:
      "PracticeOS for the engagement that follows marketplace matching — deadlines, tasks, documents, and team workflow without leaving Barristrly.",
    navDescription:
      "Matters, deadlines, tasks, and team workflow after you match.",
    eyebrow: "Product 03",
    comingDetail:
      "PMS scope will be finalized in the next product meeting. Current portal already carries matters, deadlines, and lawyer workflow.",
    highlights: [
      { value: "Matters", label: "Post-match workspace" },
      { value: "Deadlines", label: "Forum-aware dates" },
      { value: "Team", label: "Agency + solo seats" },
    ],
    features: [
      {
        title: "Matter after match",
        body: "Once the client accepts counsel, the masked consult becomes a living matter — notes, documents, and next steps in one place.",
      },
      {
        title: "Agency and solo",
        body: "Firm admins route work across a lawyer panel. Solo practitioners run the same matter stack without a listing fee tax.",
      },
      {
        title: "Tied to escrow",
        body: "Milestones in the PMS can release held funds — so practice ops and payment are not two disconnected tools.",
      },
    ],
  },
  {
    id: "accounting",
    name: "Accounting and Finance",
    href: "/products/accounting",
    tagline: "Escrow, sessions, and milestones in one ledger",
    description:
      "Session fees, milestone invoices, and payouts sit on the same financial spine as the marketplace — so cross-border hires are not blocked by informal wires.",
    navDescription:
      "Escrow, session fees, milestone invoices, and payouts.",
    eyebrow: "Product 04",
    comingDetail:
      "Ledger, payout, and tax-treatment detail scheduled for the next product meeting.",
    highlights: [
      { value: "Escrow", label: "Held until verified" },
      { value: "Sessions", label: "30 / 45 / 60 min" },
      { value: "Payouts", label: "After milestone clear" },
    ],
    features: [
      {
        title: "Escrow-first",
        body: "Consult and engagement funds are held until the session or milestone is verified — reducing collection risk across India, Pakistan, UAE, and other corridors.",
      },
      {
        title: "Session economics",
        body: "Timed anonymous meetings at published rates so clients can meet more than one specialist before a long-term retainer.",
      },
      {
        title: "Provider payouts",
        body: "Lawyers and firms receive consult fees from escrow when the meeting completes — not after chasing an unpaid invoice across borders.",
      },
    ],
  },
  {
    id: "clm",
    name: "Contract Lifecycle Management",
    href: "/products/clm",
    tagline: "From first draft to signed engagement",
    description:
      "CLM for marketplace handoff and ongoing counsel — review themes, versioning, and engagement contracts without leaking identity before the parties are ready.",
    navDescription:
      "Draft, review, version, and sign engagement contracts.",
    eyebrow: "Product 05",
    comingDetail:
      "Clause libraries, jurisdiction packs, and e-sign flow to be scoped next meeting.",
    highlights: [
      { value: "Review", label: "Risk themes before counsel" },
      { value: "Versions", label: "Matter-linked drafts" },
      { value: "Engage", label: "Contract after unmask" },
    ],
    features: [
      {
        title: "Pre-counsel review",
        body: "Flag risk themes on a draft before you schedule a specialist — useful when India/Pakistan teams need UAE or DIFC-facing documents triaged quickly.",
      },
      {
        title: "Engagement after consent",
        body: "Formal retainers and engagement letters live here only after double opt-in — so the contract is not the leak that bypasses anonymity.",
      },
      {
        title: "Matter-linked versions",
        body: "Each revision sits on the same matter as meetings, notes, and escrow milestones.",
      },
    ],
  },
  {
    id: "arbitration",
    name: "International Online Arbitration",
    href: "/products/arbitration",
    tagline: "A subsystem for remote, confidential arbitration",
    description:
      "Online arbitration support for cross-border commercial disputes — evaluate arbitrators on merit, meet without travel, and keep party identities protected through the early phase.",
    navDescription:
      "Remote arbitration: evaluate, meet, and proceed without travel.",
    eyebrow: "Product 06",
    comingDetail:
      "Rulesets, seat selection, and hearing rooms will be designed in the upcoming product session.",
    highlights: [
      { value: "Remote", label: "No travel to the seat" },
      { value: "Masked", label: "Early-phase anonymity" },
      { value: "Forum", label: "DIAC · DIFC · ADGM · more" },
    ],
    features: [
      {
        title: "Arbitrators on merit",
        body: "Browse masked arbitrator and counsel cards by forum and sector — not brand theater — then clear conflicts before anyone sees the full party list.",
      },
      {
        title: "Skip the flight",
        body: "Parties in India, Pakistan, the UAE, and elsewhere can evaluate and convene online. The cost of being physically present in the UAE (or any seat) is no longer the gate to starting the process.",
      },
      {
        title: "Confidential early phase",
        body: "High-stakes commercial arbitration often needs secrecy before formal constitution of the tribunal. The same two-gate logic applies: parameters first, identities later.",
      },
    ],
  },
  {
    id: "documents",
    name: "Documents and Workspace",
    href: "/products/documents",
    tagline: "Privileged files stay locked until COI clears",
    description:
      "A workspace where narrative and documents do not enter the matching pool before conflict clearance — then live with the matter after unlock.",
    navDescription:
      "Privileged files locked until COI; then a shared matter workspace.",
    eyebrow: "Product 07",
    comingDetail:
      "Storage, versioning, and privilege controls to be detailed next meeting.",
    highlights: [
      { value: "Locked", label: "Until COI + payment" },
      { value: "Versions", label: "Matter-scoped files" },
      { value: "Privilege", label: "Need-to-know access" },
    ],
    features: [
      {
        title: "Registration gate",
        body: "Case narrative and document upload stay locked so privileged facts never enter the directory pool before COI runs.",
      },
      {
        title: "Payment-gated unblind",
        body: "Files unlock with identity only after affirmation and payment — the same spine as marketplace matching.",
      },
      {
        title: "Workspace after retain",
        body: "Once counsel is accepted, the same documents become the working file for PMS, CLM, and meetings.",
      },
    ],
  },
  {
    id: "research",
    name: "Legal Research AI",
    href: "/products/research",
    tagline: "Grounded questions that support the match — not replace counsel",
    description:
      "BARRI-backed research to classify the matter, frame the forum, and prepare a brief for marketplace matching. It does not give legal advice on your specific case.",
    navDescription:
      "BARRI research to classify matters and support briefs — not legal advice.",
    eyebrow: "Product 08",
    comingDetail:
      "Corpus, citation, and jurisdiction packs to be reviewed in the next AI product session.",
    highlights: [
      { value: "BARRI", label: "Intake + research" },
      { value: "Forum", label: "UAE · GCC · IN · PK" },
      { value: "Handoff", label: "Into matching" },
    ],
    features: [
      {
        title: "Classify, don’t counsel",
        body: "Research AI helps map practice area, jurisdiction, and urgency so matching is precise. It will not invent outcomes or replace a licensed lawyer.",
      },
      {
        title: "Corridor-aware",
        body: "Useful when an India or Pakistan team needs to understand UAE mainland vs DIFC/ADGM posture before they book a consult — without flying in for a first scoping.",
      },
      {
        title: "Feeds the marketplace",
        body: "Structured output lands in intake and the lead file so the first anonymous meeting starts from a clear brief.",
      },
    ],
  },
];

export const MARKETPLACE_FEATURES: {
  name: string;
  href: string;
  description: string;
}[] = [
  {
    name: "Anonymous Directory",
    href: "/#why-anonymous",
    description:
      "Merit-first listings. Personal data hidden until double opt-in.",
  },
  {
    name: "Anonymous Meetings",
    href: "/#why-anonymous-meeting",
    description:
      "Timed, escrowed audio/video. Contacts stay on the platform.",
  },
  {
    name: "Two-gate COI",
    href: "/#why-features",
    description:
      "Parties first. Narrative locked until clearance. Hash-verified.",
  },
  {
    name: "Global Corridor",
    href: "/#why-features",
    description:
      "India, Pakistan, UAE, and worldwide — hire without travelling.",
  },
  {
    name: "Milestone Escrow",
    href: "/#why-features",
    description: "Session and milestone funds held until verified.",
  },
  {
    name: "Find Lawyers",
    href: "/find-lawyers",
    description: "Browse masked providers by practice, city, and forum.",
  },
  {
    name: "BARRI Intake",
    href: "/ai/intake",
    description: "Classify the matter, then route to matching.",
  },
];

export function productBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === slug);
}

export function productByHref(href: string): Product | undefined {
  return PRODUCTS.find((p) => p.href === href);
}
