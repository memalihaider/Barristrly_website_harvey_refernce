export type DirectoryListing = {
  id: string;
  title: string;
  practice: string;
  practiceSlug: string;
  purpose: "consult" | "retain" | "second-opinion" | "arbitration";
  location: string;
  citySlug: string;
  forum: string;
  tier: "Tier-1" | "Tier-2" | "Tier-3";
  feeAed: number;
  years: number;
  languages: string[];
  rating: number;
  matters: number;
  responseHrs: number;
  summary: string;
  photo: string;
  badgeColor: string;
};

export const DIRECTORY_PURPOSES = [
  { value: "all", label: "Any purpose" },
  { value: "consult", label: "Timed consult" },
  { value: "retain", label: "Retain counsel" },
  { value: "second-opinion", label: "Second opinion" },
  { value: "arbitration", label: "Arbitration support" },
] as const;

export const DIRECTORY_LOCATIONS = [
  { value: "all", label: "Any location" },
  { value: "dubai", label: "Dubai" },
  { value: "abu-dhabi", label: "Abu Dhabi" },
  { value: "riyadh", label: "Riyadh" },
  { value: "london", label: "London" },
  { value: "karachi", label: "Karachi" },
] as const;

export const DIRECTORY_PRACTICES = [
  { value: "all", label: "Any practice" },
  { value: "corporate", label: "Corporate" },
  { value: "employment", label: "Employment" },
  { value: "litigation", label: "Litigation" },
  { value: "arbitration", label: "Arbitration" },
  { value: "real-estate", label: "Real estate" },
  { value: "immigration", label: "Immigration" },
  { value: "banking", label: "Banking & finance" },
  { value: "notary", label: "Notary & PRO" },
] as const;

export const EXPERIENCE_OPTIONS = [3, 5, 8, 10, 15, 20] as const;

export const LANGUAGE_OPTIONS = [
  "English",
  "Arabic",
  "Hindi",
  "Urdu",
  "French",
] as const;

export const DIRECTORY_LISTINGS: DirectoryListing[] = [
  {
    id: "DXB-9812",
    title: "Employment counsel",
    practice: "Employment",
    practiceSlug: "employment",
    purpose: "consult",
    location: "Dubai, UAE",
    citySlug: "dubai",
    forum: "MoHRE / Mainland",
    tier: "Tier-2",
    feeAed: 600,
    years: 12,
    languages: ["English", "Arabic"],
    rating: 4.9,
    matters: 180,
    responseHrs: 4,
    summary:
      "Workplace disputes, end-of-service claims, and MoHRE representation — identity masked until COI clears.",
    photo: "/testimonials/amira.jpg",
    badgeColor: "bg-sky-600",
  },
  {
    id: "AUH-4401",
    title: "Corporate & free zone",
    practice: "Corporate",
    practiceSlug: "corporate",
    purpose: "retain",
    location: "Abu Dhabi, UAE",
    citySlug: "abu-dhabi",
    forum: "ADGM",
    tier: "Tier-1",
    feeAed: 800,
    years: 15,
    languages: ["English", "Arabic"],
    rating: 4.8,
    matters: 240,
    responseHrs: 6,
    summary:
      "Entity setup, shareholder agreements, and free-zone governance for regional expansion.",
    photo: "/testimonials/james.jpg",
    badgeColor: "bg-violet-600",
  },
  {
    id: "DIFC-2208",
    title: "Arbitration specialist",
    practice: "Arbitration",
    practiceSlug: "arbitration",
    purpose: "arbitration",
    location: "Dubai, UAE",
    citySlug: "dubai",
    forum: "DIFC / DIAC",
    tier: "Tier-1",
    feeAed: 800,
    years: 18,
    languages: ["English", "French"],
    rating: 5.0,
    matters: 95,
    responseHrs: 8,
    summary:
      "DIAC and DIFC arbitration counsel with stenography and interpreter panel access.",
    photo: "/testimonials/neha.jpg",
    badgeColor: "bg-emerald-600",
  },
  {
    id: "SHJ-1180",
    title: "Real estate disputes",
    practice: "Real estate",
    practiceSlug: "real-estate",
    purpose: "consult",
    location: "Dubai, UAE",
    citySlug: "dubai",
    forum: "RDC / Sharjah",
    tier: "Tier-3",
    feeAed: 400,
    years: 8,
    languages: ["English", "Arabic", "Hindi"],
    rating: 4.7,
    matters: 210,
    responseHrs: 5,
    summary:
      "Off-plan disputes, escrow claims, and RDC filings with anonymous first consult.",
    photo: "/testimonials/omar.jpg",
    badgeColor: "bg-teal-600",
  },
  {
    id: "GCC-7720",
    title: "Immigration & visas",
    practice: "Immigration",
    practiceSlug: "immigration",
    purpose: "consult",
    location: "Dubai, UAE",
    citySlug: "dubai",
    forum: "GDRFA / ICP",
    tier: "Tier-2",
    feeAed: 600,
    years: 10,
    languages: ["English", "Arabic", "Urdu"],
    rating: 4.8,
    matters: 320,
    responseHrs: 3,
    summary:
      "Golden Visa, residency, and mobility advice across UAE corridors — COI before reveal.",
    photo: "/testimonials/priya.jpg",
    badgeColor: "bg-indigo-600",
  },
  {
    id: "LON-3314",
    title: "Cross-border commercial",
    practice: "Corporate",
    practiceSlug: "corporate",
    purpose: "second-opinion",
    location: "London, UK",
    citySlug: "london",
    forum: "England & Wales",
    tier: "Tier-1",
    feeAed: 800,
    years: 20,
    languages: ["English"],
    rating: 4.9,
    matters: 150,
    responseHrs: 12,
    summary:
      "India–GCC–UK commercial contracts and second opinions without early identity leak.",
    photo: "/testimonials/james.jpg",
    badgeColor: "bg-violet-600",
  },
  {
    id: "RYD-5521",
    title: "Litigation advocate",
    practice: "Litigation",
    practiceSlug: "litigation",
    purpose: "retain",
    location: "Riyadh, KSA",
    citySlug: "riyadh",
    forum: "Saudi courts",
    tier: "Tier-1",
    feeAed: 800,
    years: 14,
    languages: ["Arabic", "English"],
    rating: 4.8,
    matters: 175,
    responseHrs: 10,
    summary:
      "Commercial litigation strategy and hearing prep for KSA and GCC counterparties.",
    photo: "/testimonials/omar.jpg",
    badgeColor: "bg-rose-600",
  },
  {
    id: "KHI-8830",
    title: "Banking & recovery",
    practice: "Banking & finance",
    practiceSlug: "banking",
    purpose: "consult",
    location: "Karachi, PK",
    citySlug: "karachi",
    forum: "Pakistan / UAE",
    tier: "Tier-2",
    feeAed: 400,
    years: 11,
    languages: ["English", "Urdu"],
    rating: 4.6,
    matters: 130,
    responseHrs: 7,
    summary:
      "Debt recovery, trade finance, and banking disputes across Pakistan–UAE corridor.",
    photo: "/testimonials/neha.jpg",
    badgeColor: "bg-amber-700",
  },
  {
    id: "NOT-4412",
    title: "Notary & attestation",
    practice: "Notary & PRO",
    practiceSlug: "notary",
    purpose: "consult",
    location: "Dubai, UAE",
    citySlug: "dubai",
    forum: "UAE · International",
    tier: "Tier-3",
    feeAed: 400,
    years: 6,
    languages: ["English", "Arabic", "Hindi"],
    rating: 4.7,
    matters: 400,
    responseHrs: 2,
    summary:
      "Notarial acts, PRO, and document attestation — listed anonymously until booking.",
    photo: "/testimonials/amira.jpg",
    badgeColor: "bg-slate-600",
  },
  {
    id: "DXB-6602",
    title: "Family & personal status",
    practice: "Litigation",
    practiceSlug: "litigation",
    purpose: "consult",
    location: "Dubai, UAE",
    citySlug: "dubai",
    forum: "Personal status",
    tier: "Tier-2",
    feeAed: 600,
    years: 9,
    languages: ["English", "Arabic"],
    rating: 4.8,
    matters: 160,
    responseHrs: 5,
    summary:
      "Personal status and family matters with strict anonymity until client accepts counsel.",
    photo: "/testimonials/priya.jpg",
    badgeColor: "bg-pink-600",
  },
];
