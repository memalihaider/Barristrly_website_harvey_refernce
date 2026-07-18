/**
 * Legal ontology v0 — shared enums and vocabulary for Barristrly.
 * Source of truth: doc/LEGAL_ONTOLOGY.md, doc/LEGAL_DOMAIN_MODEL.md
 */

export const APP_ROLES = [
  "client",
  "lawyer",
  "firm_admin",
  "platform_admin",
] as const;

export type AppRole = (typeof APP_ROLES)[number];

export const JURISDICTIONS = [
  "AE-DU",
  "AE-AZ",
  "AE-DIFC",
  "AE-ADGM",
  "SA",
  "KW",
  "BH",
  "OM",
  "QA",
  "PK",
  "GB-LON",
] as const;

export type JurisdictionCode = (typeof JURISDICTIONS)[number];

export const PRACTICE_AREAS = [
  "corporate",
  "commercial",
  "litigation",
  "employment",
  "real_estate",
  "family",
  "immigration",
  "ip",
  "banking_finance",
  "arbitration",
  "criminal",
  "tax",
] as const;

export type PracticeArea = (typeof PRACTICE_AREAS)[number];

export const URGENCY_LEVELS = ["low", "medium", "high", "critical"] as const;

export type UrgencyLevel = (typeof URGENCY_LEVELS)[number];

export const LEGAL_ENTITY_TYPES = [
  "legal_actor",
  "organization",
  "matter",
  "court_case",
  "contract",
  "document",
  "clause",
  "obligation",
  "evidence",
  "legal_event",
  "legal_authority",
] as const;

export type LegalEntityType = (typeof LEGAL_ENTITY_TYPES)[number];

export const JURISDICTION_LABELS: Record<JurisdictionCode, string> = {
  "AE-DU": "Dubai, UAE",
  "AE-AZ": "Abu Dhabi, UAE",
  "AE-DIFC": "DIFC",
  "AE-ADGM": "ADGM",
  SA: "Saudi Arabia",
  KW: "Kuwait",
  BH: "Bahrain",
  OM: "Oman",
  QA: "Qatar",
  PK: "Pakistan",
  "GB-LON": "London, UK",
};

export const PRACTICE_AREA_LABELS: Record<PracticeArea, string> = {
  corporate: "Corporate",
  commercial: "Commercial",
  litigation: "Litigation",
  employment: "Employment",
  real_estate: "Real Estate",
  family: "Family",
  immigration: "Immigration",
  ip: "Intellectual Property",
  banking_finance: "Banking & Finance",
  arbitration: "Arbitration",
  criminal: "Criminal",
  tax: "Tax",
};
