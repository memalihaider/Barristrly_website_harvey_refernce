export const CLIENT_TYPES = ["Individual / Resident / Expat", "Corporate / Business Entity"] as const;

export const EMIRATES = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Northern Emirates",
  "Outside UAE",
] as const;

export const SERVICE_ROUTES = [
  {
    value: "free-match",
    label: "Option 1: Free Lawyer & Provider Matching",
    detail:
      "Submit brief & receive up to 3 vetted fee proposals within 24 hours. 100% free for clients.",
  },
  {
    value: "dedicated-consultation",
    label: "Option 2: Dedicated 45–60 Minute Legal Consultation",
    detail:
      "Private 1-on-1 strategy meeting with a specialized senior attorney. Fee: AED 1,000 + 5% VAT = AED 1,050 total. Includes pre-meeting document audit & written summary roadmap.",
  },
] as const;

export const MEETING_FORMATS = [
  "Video Call (Zoom / Teams)",
  "In-Person (Law Firm Office)",
  "Phone Call",
] as const;

export const JURISDICTIONS = [
  "Mainland UAE Courts",
  "DIFC Courts",
  "ADGM Courts",
  "MOHRE / Labor Tribunal",
  "Rent Dispute Center (RDC)",
  "Out of Court / Unsure",
] as const;

export const LANGUAGE_REQUIREMENTS = [
  "English Only",
  "Arabic Only",
  "Bilingual (Arabic & English)",
  "Other",
] as const;

export const CLAIM_VALUE_RANGES = [
  "Under AED 100k",
  "AED 100k - 500k",
  "AED 500k - 2M",
  "Over AED 2M",
  "N/A (Non-monetary / Contract Review)",
] as const;

export const URGENCY_LEVELS = [
  "Urgent (Deadline within 48 Hours)",
  "High (Within 1 Week)",
  "Standard (Planning phase)",
] as const;

export const SUPPORTING_DOCS = [
  "Contracts / Agreements",
  "Court Papers / Notices",
  "Emails / Invoices",
  "Trade License",
  "None yet",
] as const;

// Provider onboarding (Form 2)

export const PROVIDER_CLASSIFICATIONS = [
  "Licensed Law Firm / Legal Advocacy Practice (Mainland MOJ / Judicial Dept)",
  "Legal Consultancy / Foreign Law Office (DIFC / ADGM / Mainland)",
  "Sole Practitioner / Licensed Advocate",
  "Certified Arbitrator / Alternative Dispute Resolution Specialist",
  "Registered VAT & Corporate Tax Consultant (FTA Tax Agent)",
  "AML / CTF Compliance Advisory Firm",
  "Private / Commercial Notary Services",
  "Certified Legal Translation Company (MOJ Registered)",
] as const;

export const LICENSING_AUTHORITIES = [
  "UAE Ministry of Justice",
  "Dubai Legal Affairs Dept",
  "ADJD",
  "DIFC Courts",
  "ADGM Courts",
  "Federal Tax Authority (FTA)",
  "Ministry of Economy",
] as const;

export const PRACTITIONER_COUNTS = [
  "Sole Practitioner",
  "2–5 Professionals",
  "6–15 Professionals",
  "15+ Professionals",
] as const;

export const COURT_RIGHTS_OF_AUDIENCE = [
  "Dubai Courts (First Instance / Appeal / Cassation)",
  "Abu Dhabi Courts",
  "Federal Supreme Court",
  "DIFC Courts",
  "ADGM Courts",
  "N/A (Consultancy / Advisory Only)",
] as const;

export const PROVIDER_LANGUAGES = [
  "Arabic",
  "English",
  "French",
  "Russian",
  "Hindi / Urdu",
  "Chinese",
  "Other",
] as const;

export const CORE_PRACTICE_AREAS_PROVIDER = [
  "Mainland Litigation & Criminal Defense",
  "Corporate, Commercial & Business Structuring",
  "Real Estate, Construction & RDC Litigation",
  "Labor & Employment Law",
  "Tech, IP, E-Commerce & Digital Assets",
  "Cross-Border Arbitration & Debt Collection",
  "Corporate Tax & VAT Compliance / FTA Disputes",
  "AML / KYC Audit, Sanctions & Regulatory Advisory",
  "Notary Public & Document Attestation",
  "Sworn Legal Translation (Arabic / English / Others)",
  "Private Client, Non-Muslim Wills & Estate Planning",
] as const;

export const VERIFICATION_UPLOADS = [
  "Valid Professional Trade License Copy",
  "Ministry of Justice / Legal Affairs Dept / FTA Registration Certificate",
  "Managing Partner Passport / Emirates ID Copy",
  "Firm Corporate Profile / Pitch Deck",
] as const;
