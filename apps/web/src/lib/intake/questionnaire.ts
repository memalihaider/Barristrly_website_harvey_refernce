/**
 * AI Intake questionnaire — ADR advanced merged flow (doc/ADR/AI_INTAKE.md).
 * Maps categories onto apps/web ontology practice areas / jurisdictions.
 */

import type { JurisdictionCode, PracticeArea, UrgencyLevel } from "@/lib/ontology";

export const DATA_PROTECTION_NOTICE =
  "Data Protection Guardrail: Lead Data Masking is active. Client identities and personal contact details are completely hidden from listed legal practitioners until a consultation concludes and explicit client acceptance is logged.";

export const GREETING_MESSAGE =
  "Hello. I am your AI Legal Intake Assistant. Let's map your situation to the proper legal track and budget in under two minutes. Your privacy is fully guaranteed: your name and contact details remain entirely anonymous and hidden from lawyers until after your consultation is complete and you choose to share them.";

export const LEAD_CAPTURE_INTRO =
  "Please confirm your secure identification elements. Your name, email, and phone number will remain entirely hidden from the lawyer during matchmaking and will not be shared until your consultation concludes and you grant explicit permission.";

export const PRIVACY_CONSENT_LABEL =
  "I acknowledge that my personal details are securely held by the platform and will only be released to the attorney following the conclusion of our meeting and my explicit approval.";

export interface PracticeCategory {
  id: string;
  label: string;
  subCategories: string[];
  /** Maps to website ontology PRACTICE_AREAS */
  practiceArea: PracticeArea;
}

export const PRACTICE_CATEGORIES: PracticeCategory[] = [
  {
    id: "legal-notices",
    label: "A. Legal Notices & Formal Grievances",
    practiceArea: "commercial",
    subCategories: [
      "Draft & Send a New Formal Legal Notice",
      "Draft & Send an Official Reply to a Received Legal Notice",
      "Cease and Desist Notices",
      "Notary Public Document Attestation & Official Registrations",
      "Amicable Settlement Negotiations & Settlement Agreements",
    ],
  },
  {
    id: "immigration",
    label: "B. Immigration, Visas & Residency Checks",
    practiceArea: "immigration",
    subCategories: [
      "Official Immigration Status & Security Clearance Checks",
      "Golden Visa Eligibility / Appeals / Document Compilation",
      "Employment Visa, Green Visa, or Partner/Investor Visa Discrepancies",
      "Absconding Charges (Report or Removal/Clearance)",
      "Visa Overstay Fines / Deportation / Exclusion Order Appeals",
      "GDRFA / ICP Application Rejections & Security Clearance Updates",
    ],
  },
  {
    id: "travel-bans",
    label: "C. Travel Bans & Border Controls",
    practiceArea: "criminal",
    subCategories: [
      "Active Travel Ban Verification Status Check",
      "Lifting, Postponement, or Removal of an Existing Travel Ban",
      "Arrest Warrants Status Check & Police Station Case Tracking",
      "Interpol Green/Red Notice Risk Advisory & Extradition Defense",
    ],
  },
  {
    id: "corporate",
    label: "D. Corporate, Commercial & Business Setup",
    practiceArea: "corporate",
    subCategories: [
      "Company Formation & Licensing (Mainland, Free Zones, Offshore)",
      "Mergers, Acquisitions (M&A) & Joint Ventures",
      "Commercial Contracts (Drafting, Review, Disputes)",
      "Shareholder, Boardroom & Corporate Governance Disputes",
      "Corporate Restructuring, Insolvency & Bankruptcy",
    ],
  },
  {
    id: "employment",
    label: "E. Employment & Labor Law",
    practiceArea: "employment",
    subCategories: [
      "MoHRE Arbitrations & Claims",
      "Wrongful Termination & Arbitrary Dismissal",
      "Unpaid Salaries, Gratuity & Workplace Allowances",
      "Non-Compete Covenants & Post-Employment Restrictions",
      "Executive Employment Contracts & Board-Level Disputes",
    ],
  },
  {
    id: "real-estate",
    label: "F. Real Estate, Property & Construction",
    practiceArea: "real_estate",
    subCategories: [
      "Off-Plan Delayed Handover & Developer Performance Claims",
      "Rental Disputes Center (RDC) Cases",
      "Property Sale & Purchase Agreement (SPA) Disputes",
      "FIDIC & Construction Infrastructure Disputes",
      "Strata & Community Management Conflicts",
    ],
  },
  {
    id: "banking",
    label: "G. Banking, Finance & Debt Recovery",
    practiceArea: "banking_finance",
    subCategories: [
      "Corporate & Personal Debt Collection Enforcement",
      "Loan Restructuring & Banking Litigation",
      "Financial Fraud & Asset Tracing",
      "Bounced Checks & Security Execution Shielding",
    ],
  },
  {
    id: "ip-tech",
    label: "H. Intellectual Property, Media & Technology",
    practiceArea: "ip",
    subCategories: [
      "Trademark, Patent & Copyright Registration / Infringement",
      "Data Privacy & UAE Data Protection Law Compliance",
      "E-Commerce, Software Licensing & Technology Transfer",
      "Media Defamation & Entertainment Law",
    ],
  },
  {
    id: "family",
    label: "I. Family, Personal Status & Inheritance",
    practiceArea: "family",
    subCategories: [
      "Divorce Proceedings (Sharia and Expat Frameworks)",
      "Child Custody, Guardianship & Maintenance",
      "Wills Drafting & Estate Planning (DIFC / ADJD)",
      "Cross-Border Inheritance Disputes",
    ],
  },
  {
    id: "criminal",
    label: "J. Criminal & Regulatory Defense",
    practiceArea: "criminal",
    subCategories: [
      "Financial Crimes (Money Laundering, Embezzlement, Bribery)",
      "Cybercrimes & Online Defamation",
      "Police Representation, Bail & Travel Ban Removals",
      "Customs Violations & Anti-Smuggling Defense",
    ],
  },
  {
    id: "maritime",
    label: "K. Maritime, Shipping & Logistics",
    practiceArea: "arbitration",
    subCategories: [
      "Arrest of Vessels & Maritime Lien Claims",
      "Charterparty, Bill of Lading & Cargo Disputes",
      "Marine Insurance & General Average Settlements",
      "Port Authority & Freight Forwarding Litigation",
    ],
  },
  {
    id: "medical",
    label: "L. Medical Malpractice, Healthcare & Insurance",
    practiceArea: "litigation",
    subCategories: [
      "Medical Negligence & Clinical Malpractice Claims",
      "Healthcare Regulatory Compliance (DOH / DHA)",
      "Insurance Claims Disallowance & Reinsurance Disputes",
      "Personal Injury & Fatal Accident Compensation",
    ],
  },
  {
    id: "tax",
    label: "M. Tax, Customs & Excise",
    practiceArea: "tax",
    subCategories: [
      "Federal Tax Authority (FTA) Audit Appeals",
      "Corporate Tax Implementation & Compliance",
      "VAT Assessment Rectifications",
      "Customs Duties & Transfer Pricing",
    ],
  },
];

export const ENGAGEMENT_MODELS = [
  "Just an Initial Consultation",
  "Full Case Representation / Specific Deliverable Execution",
] as const;

export const UAE_JURISDICTIONS = [
  "Dubai Jurisdictions (Dubai Courts / MoHRE / Rental Disputes Center / GDRFA Dubai / Dubai Police)",
  "Abu Dhabi Jurisdictions (Abu Dhabi Judicial Department [ADJD] / Federal ICP Hubs)",
  "Other Emirates Mainland (Sharjah, Ajman, RAK, Fujairah, UAQ Federal Courts & local Police Stations)",
  "Financial Free Zones (DIFC Courts or ADGM Courts - English Common Law frameworks)",
  "Unsure / Automated Matching (AI will locate the correct forum from your case details)",
] as const;

export const BUDGET_TIERS = [
  "Premium / Tier-1 (International practices, top-tier local advocates, high-stakes specialists)",
  "Mid-Range / Tier-2 (Competitive mid-market rates with experienced local firms)",
  "Budget-Conscious / Tier-3 (Cost-effective, rapid fixed-fee solutions for simple matters)",
  "Unsure / Quote Collection (Multiple firms pitch transparent proposals for review)",
] as const;

export const FEE_STRUCTURES = [
  "Fixed Fee / Flat Rate",
  "Hourly Billable Rate",
  "Contingency / Success Fee (where permitted)",
  "Retainer Model",
  "Unsure",
] as const;

export const LANGUAGES = ["English", "Arabic", "Urdu", "Hindi", "French"] as const;

export const CONTACT_PREFERENCES = [
  "In-platform messaging only",
  "Video meeting preferred",
  "Phone call after consent",
  "Email after consent",
] as const;

export type IntakeStepKind =
  | "primary_category"
  | "sub_category"
  | "engagement_model"
  | "jurisdiction"
  | "budget_tier"
  | "fee_structure"
  | "matter_summary"
  | "urgency_detained"
  | "notice_served"
  | "language"
  | "contact_preference"
  | "lead_name"
  | "lead_phone"
  | "lead_email"
  | "lead_consent";

export interface IntakeStepConfig {
  kind: IntakeStepKind;
  prompt: string;
  options?: readonly string[];
  optional?: boolean;
}

export const INTAKE_STEP_SEQUENCE: IntakeStepConfig[] = [
  {
    kind: "primary_category",
    prompt:
      "Select your primary legal vertical so we can open the precise service options:",
    options: PRACTICE_CATEGORIES.map((c) => c.label),
  },
  {
    kind: "sub_category",
    prompt: "Select the specific service that best matches your matter:",
  },
  {
    kind: "engagement_model",
    prompt:
      "How would you like to initiate your engagement with our verified legal professionals?",
    options: ENGAGEMENT_MODELS,
  },
  {
    kind: "jurisdiction",
    prompt:
      "Which UAE jurisdiction or regulatory forum applies? (Mainland civil law vs DIFC/ADGM common law)",
    options: UAE_JURISDICTIONS,
  },
  {
    kind: "budget_tier",
    prompt: "Select your budget alignment for legal services:",
    options: BUDGET_TIERS,
  },
  {
    kind: "fee_structure",
    prompt: "Preferred legal fee structure arrangement:",
    options: FEE_STRUCTURES,
    optional: true,
  },
  {
    kind: "matter_summary",
    prompt:
      "Please share a brief summary of the issue (e.g., specific transaction amounts, dates, or governmental entities like GDRFA or a police station).",
    optional: true,
  },
  {
    kind: "urgency_detained",
    prompt:
      "Are you currently detained, facing an active border restriction, or under a tight 15-day/30-day court warning deadline?",
    options: ["Yes", "No"],
  },
  {
    kind: "notice_served",
    prompt:
      "Has a formal written legal notice, court summons, or police notification already been served?",
    options: ["Yes", "No"],
  },
  {
    kind: "language",
    prompt: "Preferred language for communication:",
    options: LANGUAGES,
  },
  {
    kind: "contact_preference",
    prompt:
      "How should we contact you after matching? (Your details remain masked until you approve release)",
    options: CONTACT_PREFERENCES,
  },
  {
    kind: "lead_name",
    prompt: `${LEAD_CAPTURE_INTRO}\n\nFull legal name or corporate entity title:`,
  },
  {
    kind: "lead_phone",
    prompt: "Contact phone number (WhatsApp verified, include country code):",
  },
  {
    kind: "lead_email",
    prompt: "Contact email address:",
  },
  {
    kind: "lead_consent",
    prompt: `Mandatory guardrail consent:\n\n${PRIVACY_CONSENT_LABEL}`,
    options: ["I acknowledge and agree", "No — exit intake"],
  },
];

export function getCategoryByLabel(label: string): PracticeCategory | undefined {
  return PRACTICE_CATEGORIES.find((c) => c.label === label);
}

export function resolveSubCategoryOptions(primaryLabel: string): string[] {
  const cat =
    PRACTICE_CATEGORIES.find((c) => c.label === primaryLabel) ??
    PRACTICE_CATEGORIES.find((c) => primaryLabel.includes(c.label.slice(2, 10)));
  return cat?.subCategories ?? [];
}

export function mapToPracticeArea(
  primaryLabel: string,
  subCategory: string
): PracticeArea {
  const cat = getCategoryByLabel(primaryLabel);
  if (cat) return cat.practiceArea;
  const lower = subCategory.toLowerCase();
  if (lower.includes("immigration") || lower.includes("visa") || lower.includes("gdrfa"))
    return "immigration";
  if (lower.includes("family") || lower.includes("divorce") || lower.includes("custody"))
    return "family";
  if (lower.includes("employment") || lower.includes("mohre")) return "employment";
  if (lower.includes("real estate") || lower.includes("rdc")) return "real_estate";
  if (lower.includes("criminal") || lower.includes("travel ban") || lower.includes("police"))
    return "criminal";
  if (lower.includes("tax") || lower.includes("vat")) return "tax";
  if (lower.includes("ip") || lower.includes("trademark")) return "ip";
  if (lower.includes("bank") || lower.includes("debt")) return "banking_finance";
  return "corporate";
}

export function mapJurisdictionLabel(label: string): JurisdictionCode | undefined {
  if (label.includes("DIFC") || label.includes("ADGM") || label.includes("Financial Free")) {
    if (label.includes("ADGM") && !label.includes("DIFC")) return "AE-ADGM";
    return "AE-DIFC";
  }
  if (label.includes("Abu Dhabi")) return "AE-AZ";
  if (label.includes("Dubai")) return "AE-DU";
  if (label.includes("Other Emirates") || label.includes("Unsure")) return "AE-DU";
  return undefined;
}

export function mapUrgencyFromFlags(
  detained: boolean,
  noticeServed: boolean
): UrgencyLevel {
  if (detained) return "critical";
  if (noticeServed) return "high";
  return "medium";
}
