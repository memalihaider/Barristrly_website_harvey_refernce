/**
 * Long-form detail content for each service page (/services/[slug]).
 * Kept separate from service-catalog.ts so the catalog stays a compact index.
 *
 * Copy rules: Barristrly connects clients with independent, vetted
 * professionals — it is not a law firm. Timings are indicative unless they
 * are Barristrly's own commitment (match + quote within 48 hours).
 */

import type { ServiceId } from "./service-catalog";

export type ServiceDetails = {
  /** Long-form SEO overview shown under "Overview". */
  overview: { heading: string; paragraphs: string[] };
  /** Grouped checklist of what the service can cover. */
  scope: { title: string; items: string[] }[];
  /** Step-by-step process from request to delivery. */
  process: { title: string; body: string }[];
  /** What the client should prepare. */
  documents: string[];
  /** Indicative timing — confirmed in each quote. */
  timeline: { label: string; value: string }[];
  /** Out of scope, so expectations are clear. */
  notIncluded: string[];
  faqs: { question: string; answer: string }[];
  related: ServiceId[];
};

const MATCH_STEP = {
  title: "Matched within 48 hours",
  body: "We review your request and match you with vetted professionals suited to your matter — with a clear scope and AED quote.",
};

export const SERVICE_DETAILS: Record<ServiceId, ServiceDetails> = {
  "lawyer-matching": {
    overview: {
      heading: "Find the right legal professional in the UAE — absolutely free",
      paragraphs: [
        "Finding a lawyer through friends, search engines or social media often means guesswork. You may speak to several people before you find someone who actually handles your type of matter — and you may pay for that trial-and-error.",
        "Barristrly's lawyer matching is absolutely free. Tell us what you need in plain language. We introduce you to vetted, licensed legal professionals suited to your practice area and location — across Dubai, Abu Dhabi, mainland UAE, DIFC and ADGM where relevant.",
        "There is no obligation to hire anyone after the introduction. If you later want a paid consultation, a retainer, or drafting help, those services are available separately with clear pricing.",
      ],
    },
    scope: [
      {
        title: "What matching covers",
        items: [
          "Individuals and businesses",
          "Commercial, corporate, employment, property, family and dispute matters",
          "Onshore UAE, DIFC and ADGM where needed",
          "Online or in-person preferences noted in your brief",
        ],
      },
      {
        title: "What you receive",
        items: [
          "A short review of your request",
          "Introductions to suitable vetted professionals",
          "Clear next steps within 48 hours",
        ],
      },
    ],
    process: [
      {
        title: "Share your need",
        body: "Submit a short brief — keep sensitive details high-level until you are ready to engage.",
      },
      MATCH_STEP,
      {
        title: "Speak and decide",
        body: "Talk to the introduced professionals. Hire only if the fit feels right.",
      },
    ],
    documents: [
      "A short summary of your situation",
      "Preferred emirate or online preference",
      "Any deadlines you already know about",
    ],
    timeline: [
      { label: "Match response", value: "Within 48 hours" },
      { label: "Introductions", value: "After your brief is reviewed" },
      { label: "Engagement", value: "Only if you choose to proceed" },
    ],
    notIncluded: [
      "Legal advice itself (that starts when you engage a professional)",
      "Court or government fees",
      "Paid consultations (available as a separate service)",
    ],
    faqs: [
      {
        question: "Is lawyer matching really free?",
        answer:
          "Yes. There is no fee for submitting a matching request or for the introductions we arrange.",
      },
      {
        question: "Do I have to hire the lawyer you introduce?",
        answer:
          "No. Matching helps you find suitable options. You decide whether to engage anyone.",
      },
      {
        question: "How quickly will I hear back?",
        answer:
          "We aim to reply with next steps or introductions within 48 hours.",
      },
    ],
    related: ["consultation", "retainers", "contract-drafting"],
  },

  consultation: {
    overview: {
      heading: "Speak to qualified legal experts from the comfort of your home",
      paragraphs: [
        "Sometimes you do not need a full case file — you need a clear conversation with a qualified legal expert. Barristrly lets you book a private consultation online or by phone, so you can access guidance wherever you are.",
        "Choose the session length that fits: a short 15-minute check-in, a 25–30 minute standard session, or a detailed 50–60 minute review for more complex questions. Pricing is fixed in AED before you pay.",
        "Barristrly schedules the session with a vetted professional. The advice you receive comes from that independent professional — Barristrly is the platform that makes the booking simple and transparent.",
      ],
    },
    scope: [
      {
        title: "Session options",
        items: [
          "15 minutes — AED 299",
          "25–30 minutes — AED 599",
          "50–60 minutes detailed — AED 1,199",
        ],
      },
      {
        title: "Typical topics",
        items: [
          "Contracts and commercial questions",
          "Company, employment or property issues",
          "Family and Wills orientation",
          "Whether you need full representation next",
        ],
      },
    ],
    process: [
      {
        title: "Choose your session",
        body: "Pick 15, 25–30, or 50–60 minutes and tell us what you want to discuss.",
      },
      MATCH_STEP,
      {
        title: "Attend online or by phone",
        body: "Speak from home or the office. Share documents ahead if the longer sessions need them.",
      },
      {
        title: "Leave with next steps",
        body: "You get practical direction — and can upgrade to drafting, a retainer or further help if needed.",
      },
    ],
    documents: [
      "A short note on your questions",
      "Key documents for longer sessions (contracts, notices, licences)",
      "Preferred days and times (UAE time)",
    ],
    timeline: [
      { label: "Confirmation", value: "Within 48 hours" },
      { label: "Session", value: "Booked at a mutually convenient time" },
      { label: "Follow-up", value: "Optional summary on request" },
    ],
    notIncluded: [
      "Ongoing representation (available via retainer or separate engagement)",
      "Court appearances",
      "Government filing fees",
    ],
    faqs: [
      {
        question: "Can I join from outside the UAE?",
        answer:
          "Yes. Consultations are designed so you can speak from wherever you are, online or by phone.",
      },
      {
        question: "What are the consultation prices?",
        answer:
          "15 minutes at AED 299, 25–30 minutes at AED 599, and a detailed 50–60 minutes at AED 1,199. The fee is confirmed before you pay.",
      },
      {
        question: "Is this the same as free lawyer matching?",
        answer:
          "No. Matching introduces you to suitable professionals at no charge. A consultation is a paid timed session with a qualified expert.",
      },
    ],
    related: ["lawyer-matching", "retainers", "contract-drafting"],
  },

  retainers: {
    overview: {
      heading: "A flexible legal retainer for startups and SMEs",
      paragraphs: [
        "Growing companies need legal help every month — reviewing contracts, answering HR questions, keeping governance tidy, and handling early disputes before they escalate. Hiring a lawyer for every request is slow and unpredictable, and an in-house lawyer is often more than you need.",
        "A Barristrly retainer gives you an ongoing relationship with a vetted lawyer who learns your business. You agree a monthly scope and turnaround expectations up front, so legal stops being a bottleneck.",
        "If the fit is not right, you can switch to another vetted professional, and you pay on a pro-rata basis for completed work — protecting your cash flow while you find the right long-term partner.",
      ],
    },
    scope: [
      {
        title: "Commercial",
        items: [
          "Contract review and drafting",
          "Supplier and customer negotiations",
          "Standard terms and templates",
        ],
      },
      {
        title: "Employment & HR",
        items: [
          "Offer letters and employment contracts",
          "Policies and handbooks",
          "Terminations and end-of-service questions",
        ],
      },
      {
        title: "Governance & disputes",
        items: [
          "Board and shareholder resolutions",
          "Regulatory and compliance questions",
          "Demand letters and early-stage disputes",
        ],
      },
    ],
    process: [
      {
        title: "Tell us about your company",
        body: "Share your team size, typical monthly legal needs and the jurisdictions you work in.",
      },
      MATCH_STEP,
      {
        title: "Agree scope & terms",
        body: "Set the monthly scope, turnaround expectations and how additional work is billed.",
      },
      {
        title: "Ongoing support",
        body: "Send requests as they come up. Switch professionals if the fit is wrong — pay pro-rata for completed work.",
      },
    ],
    documents: [
      "Trade licence and company details",
      "Examples of recent contracts or legal questions",
      "Estimated monthly volume of legal requests",
      "Key contacts who will send requests",
    ],
    timeline: [
      { label: "Lawyer match & proposal", value: "Within 48 hours" },
      { label: "Onboarding", value: "Typically within 1 week" },
      { label: "Ongoing turnaround", value: "Agreed in your scope" },
    ],
    notIncluded: [
      "Court representation and litigation (quoted separately)",
      "Work beyond the agreed monthly scope",
      "Government and court fees",
    ],
    faqs: [
      {
        question: "How much does a legal retainer cost in the UAE?",
        answer:
          "It depends on the volume and type of work you expect each month. We propose a monthly fee based on your scope, with clear terms for any additional work.",
      },
      {
        question: "Can I cancel or switch lawyers?",
        answer:
          "Yes. If communication or fit is wrong, Barristrly helps you move to another vetted professional, and you pay pro-rata for the work completed.",
      },
      {
        question: "Is a retainer better than hiring an in-house lawyer?",
        answer:
          "For most startups and SMEs, yes — you get experienced support across contracts, HR and governance at a fraction of the cost of a full-time hire.",
      },
    ],
    related: ["contract-drafting", "consultation", "lawyer-matching"],
  },


  "contract-drafting": {
    overview: {
      heading: "Contract drafting lawyers in Dubai and the UAE",
      paragraphs: [
        "A clear contract protects your money, your intellectual property and your relationships. A vague one creates disputes. Whether you are hiring your first employee, signing a distributor, bringing in a co-founder or raising investment, the agreement should reflect the actual deal and the law that will govern it.",
        "Contracts governed by onshore UAE law follow the UAE Civil Transactions Law, while the DIFC and ADGM apply their own common-law based frameworks — and for documents that may be enforced in onshore courts, a bilingual Arabic–English version is often advisable. Getting those choices right at the drafting stage is far cheaper than fixing them in a dispute.",
        "Barristrly matches you with a vetted lawyer who specialises in your type of agreement. You get a draft or redline tailored to your deal, agreed revision rounds, and a fixed or scoped fee quoted before work starts.",
      ],
    },
    scope: [
      {
        title: "Foundational agreements",
        items: [
          "NDAs and confidentiality agreements",
          "MOUs and letters of intent",
          "Employment and consultancy contracts",
          "Website terms and privacy policies",
        ],
      },
      {
        title: "Corporate & commercial",
        items: [
          "Shareholders' agreements",
          "Joint venture agreements",
          "Master service agreements and SOWs",
          "Supply, distribution and agency agreements",
          "Software, SaaS and IP licences",
        ],
      },
      {
        title: "Investment",
        items: [
          "Share subscription and purchase agreements",
          "Convertible notes and SAFE terms",
          "Loan and co-investment agreements",
          "Contract review and redlining",
        ],
      },
    ],
    process: [
      {
        title: "Send your brief",
        body: "Choose the agreement type, summarise the key terms, and upload any existing draft.",
      },
      MATCH_STEP,
      {
        title: "Draft or redline",
        body: "Your lawyer prepares the draft — or marks up the other side's version — with clear explanations of key risks.",
      },
      {
        title: "Revise & finalise",
        body: "Agreed revision rounds until the document is ready to sign.",
      },
    ],
    documents: [
      "Names and details of all parties",
      "Key commercial terms — price, payment, term, deliverables",
      "Any existing draft, term sheet or the other side's version",
      "Preferred governing law (UAE onshore, DIFC or ADGM), if known",
    ],
    timeline: [
      { label: "Lawyer match & quote", value: "Within 48 hours" },
      { label: "Simple agreements", value: "Typically a few business days" },
      { label: "Complex agreements", value: "Scoped in your quote" },
    ],
    notIncluded: [
      "Negotiation calls beyond the agreed scope",
      "Notarisation and attestation fees",
      "Arabic translation, unless included in your quote",
    ],
    faqs: [
      {
        question: "How much does contract drafting cost in Dubai?",
        answer:
          "Pricing depends on the agreement type and complexity. Simple agreements such as NDAs are usually fixed-fee, while shareholder or investment agreements are scoped. You receive an AED quote before any work starts.",
      },
      {
        question: "Can you review a contract someone else drafted?",
        answer:
          "Yes. Upload the draft and your lawyer will redline it, flag risky clauses and suggest changes in plain language.",
      },
      {
        question: "Do UAE contracts need to be in Arabic?",
        answer:
          "Contracts can be in English, but if a document may be enforced in onshore UAE courts, an Arabic version is often needed. Your lawyer will advise whether a bilingual contract makes sense.",
      },
      {
        question: "Can the contract be governed by DIFC or ADGM law?",
        answer:
          "Often, yes. Parties can choose DIFC or ADGM law and courts in many commercial contracts. Your lawyer will explain the pros and cons for your deal.",
      },
    ],
    related: ["agreements-ebooks", "retainers", "consultation"],
  },


  "wills-estate": {
    overview: {
      heading: "Will drafting for UAE residents and expats",
      paragraphs: [
        "If you live in the UAE and do not have a registered Will, UAE inheritance rules decide how your assets are distributed. Bank accounts can be frozen while the estate is processed, and guardianship of young children may not follow your wishes. For families, that can mean months of uncertainty at the hardest possible time.",
        "Non-Muslim residents have clear options. You can register a Will with the DIFC Courts Wills Service or the ADGM Courts, or rely on the civil personal status framework for non-Muslims — each with different rules on what assets are covered and how the Will is registered.",
        "Barristrly connects you with vetted Wills and estate lawyers who listen to your real family situation, explain the right registration route, and draft clear instructions for property, bank accounts, business shares and guardianship — including assets held outside the UAE.",
      ],
    },
    scope: [
      {
        title: "Wills",
        items: [
          "DIFC and ADGM non-Muslim Wills",
          "Property and real estate Wills",
          "Business owner and shareholder Wills",
          "Mirror Wills for couples",
        ],
      },
      {
        title: "Family protection",
        items: [
          "Guardianship for minor children",
          "Executor and backup executor appointments",
          "Instructions for dependants and care wishes",
        ],
      },
      {
        title: "Estate planning",
        items: [
          "Cross-border assets (UAE, India, UK, GCC and more)",
          "Review and update of existing Wills",
          "Introductions for probate and estate administration",
        ],
      },
    ],
    process: [
      {
        title: "Share your situation",
        body: "Tell us about your family and your main assets. Everything you share is handled confidentially.",
      },
      MATCH_STEP,
      {
        title: "Consultation & draft",
        body: "Your lawyer recommends the right registration route, then drafts the Will around your instructions.",
      },
      {
        title: "Sign & register",
        body: "You review the draft, sign it with the required witnesses, and your lawyer guides the registration.",
      },
    ],
    documents: [
      "Passport and Emirates ID of the testator",
      "Details of spouse, children and chosen guardians",
      "Chosen executor(s) and their contact details",
      "List of main assets — property, accounts, shares, overseas holdings",
    ],
    timeline: [
      { label: "Lawyer match & quote", value: "Within 48 hours" },
      { label: "First draft", value: "Typically within 1 week" },
      { label: "Registration", value: "Depends on the registry" },
    ],
    notIncluded: [
      "Court or registry registration fees",
      "Probate and estate administration (quoted separately)",
      "Legal translation, unless requested",
    ],
    faqs: [
      {
        question: "Can a non-Muslim expat make a Will in the UAE?",
        answer:
          "Yes. Non-Muslim residents can register a Will with the DIFC Courts Wills Service or the ADGM Courts, or use the civil personal status framework. Your lawyer will explain which route fits your assets and family.",
      },
      {
        question: "What happens if I die without a Will in the UAE?",
        answer:
          "Your assets are distributed under the applicable UAE inheritance rules rather than your own wishes, accounts can be frozen during the process, and guardianship of children may need to be decided by a court.",
      },
      {
        question: "Does a UAE Will cover my assets in my home country?",
        answer:
          "It depends on the asset and the country. Many people keep a UAE Will for UAE assets and a separate Will at home. Your lawyer will advise on the safest approach for cross-border assets.",
      },
      {
        question: "Can I appoint a guardian for my children?",
        answer:
          "Yes. Appointing guardians for minor children is one of the most important reasons families in the UAE register a Will.",
      },
    ],
    related: ["retainers", "company-formation", "consultation"],
  },


  "company-formation": {
    overview: {
      heading: "Set up your company in Dubai or anywhere in the UAE",
      paragraphs: [
        "Setting up a business in the UAE starts with one big decision: mainland or free zone. A mainland company, licensed by the relevant emirate's economic department, can trade directly across the UAE, and most activities now allow 100% foreign ownership. Free zones such as DMCC, IFZA, DIFC and ADGM offer packaged licences and flexible office options, with some limits on trading directly in the onshore market.",
        "Getting the licence is only the beginning. Most companies must also register for UAE Corporate Tax with the Federal Tax Authority, and register for VAT once taxable supplies pass AED 375,000 a year. Visas, Emirates ID, bank account opening, licence renewals and government portals all need ongoing PRO attention.",
        "Barristrly matches you with vetted formation, tax and PRO specialists who treat these steps as one connected roadmap — so you pick the right activities and jurisdiction at the start and avoid costly restructuring later. You can begin the process from inside the UAE or from abroad.",
      ],
    },
    scope: [
      {
        title: "Company formation",
        items: [
          "Mainland vs free zone recommendation",
          "Business activity selection and trade name",
          "Licence application and incorporation documents",
          "Branch or subsidiary of a foreign company",
        ],
      },
      {
        title: "Corporate Tax & VAT",
        items: [
          "Corporate Tax registration with the FTA",
          "VAT registration and readiness",
          "Tax residency certificate support",
          "Introductions to accounting and bookkeeping",
        ],
      },
      {
        title: "PRO & government services",
        items: [
          "Investor, partner and employee visas",
          "Emirates ID and medical coordination",
          "Licence renewals and amendments",
          "Corporate bank account support",
        ],
      },
    ],
    process: [
      {
        title: "Describe your business",
        body: "Tell us what you sell, who your customers are, where you are based, and how many visas you need.",
      },
      MATCH_STEP,
      {
        title: "Choose your structure",
        body: "Your specialist recommends mainland or free zone, activities and costs — including government fees — before you commit.",
      },
      {
        title: "Licence, tax & visas",
        body: "The specialist handles applications, registrations and PRO steps, and keeps you updated until you are trading.",
      },
    ],
    documents: [
      "Passport copies of all shareholders and managers",
      "Passport-size photos and UAE entry stamp or visa (if in the UAE)",
      "Proposed company names (two or three options)",
      "A short description of your business activities",
      "For corporate shareholders: certificate of incorporation and board resolution",
    ],
    timeline: [
      { label: "Specialist match & quote", value: "Within 48 hours" },
      { label: "Free zone licence", value: "Often 1–2 weeks" },
      { label: "Mainland licence", value: "Often 2–4 weeks" },
    ],
    notIncluded: [
      "Government, free zone and licence fees (quoted separately)",
      "Office or flexi-desk rent",
      "Ongoing accounting and audit (available via introduction)",
    ],
    faqs: [
      {
        question: "Can I set up a UAE company without living in the UAE?",
        answer:
          "Yes. Many free zones and mainland structures can be set up remotely, with documents signed and attested from abroad. Some steps, such as visa medicals and Emirates ID biometrics, need a short visit.",
      },
      {
        question: "Mainland or free zone — which is better?",
        answer:
          "It depends on your customers and activities. Mainland suits businesses trading directly with the UAE market or government; free zones often suit consultancies, e-commerce, holding and international trading companies. Your specialist will recommend the best fit.",
      },
      {
        question: "Do I need to register for Corporate Tax?",
        answer:
          "Most UAE companies, including free zone companies, must register for Corporate Tax with the Federal Tax Authority, even if their taxable income is below the AED 375,000 threshold for the 9% rate.",
      },
      {
        question: "When do I need to register for VAT?",
        answer:
          "VAT registration is mandatory when your taxable supplies exceed AED 375,000 in a 12-month period, and voluntary from AED 187,500.",
      },
      {
        question: "Are government fees included in the quote?",
        answer:
          "Your quote separates the specialist's professional fee from government and free zone fees, so you can see exactly what you are paying for.",
      },
    ],
    related: ["contract-drafting", "retainers", "lawyer-matching"],
  },


  "agreements-ebooks": {
    overview: {
      heading: "Agreement templates and practical e-books for UAE businesses",
      paragraphs: [
        "Most growing companies sign the same kinds of documents again and again — NDAs, service agreements, contractor and freelancer contracts, and simple commercial terms. Paying for a fully custom draft every time is expensive, while random free downloads are often written for other countries and miss UAE-specific points.",
        "Barristrly's agreement templates give founders and operations teams a structured, editable starting point, and our e-books explain everyday legal and business topics in plain English — from contracting basics to preparing for growth.",
        "When a deal becomes high-value or unusual, you can move straight from a template to a vetted lawyer who reviews or tailors the document for you.",
      ],
    },
    scope: [
      {
        title: "Agreement templates",
        items: [
          "Mutual and one-way NDAs",
          "Service and consultancy agreements",
          "Contractor and freelancer agreements",
          "Simple commercial and supply terms",
        ],
      },
      {
        title: "Business e-books",
        items: [
          "Contracting basics for founders",
          "Working with contractors and suppliers",
          "Preparing for investment and growth",
        ],
      },
      {
        title: "Upgrade options",
        items: [
          "Lawyer review of a completed template",
          "Custom drafting for complex deals",
          "Ongoing support through a retainer",
        ],
      },
    ],
    process: [
      {
        title: "Tell us what you need",
        body: "Choose a template, an e-book, or both — or describe the document you are looking for.",
      },
      {
        title: "Receive your files",
        body: "We confirm the right items and send a secure payment link. Files are delivered to your email.",
      },
      {
        title: "Adapt to your deal",
        body: "Fill in the commercial details using the guidance notes included with each template.",
      },
      {
        title: "Upgrade if needed",
        body: "If the stakes are high, ask for a vetted lawyer to review or tailor the document.",
      },
    ],
    documents: [
      "The type of agreement you need",
      "Who the parties are (company, individual, free zone or mainland)",
      "Key commercial points — fees, term, deliverables",
    ],
    timeline: [
      { label: "Confirmation", value: "Within 48 hours" },
      { label: "Digital delivery", value: "By email after payment" },
      { label: "Lawyer review (optional)", value: "Quoted separately" },
    ],
    notIncluded: [
      "Templates are not legal advice for your specific situation",
      "Custom drafting and negotiation (available as an upgrade)",
      "Arabic translation, unless requested",
    ],
    faqs: [
      {
        question: "Are the templates suitable for the UAE?",
        answer:
          "They are written as practical starting points for businesses operating in the UAE. For high-value deals, or contracts that may be enforced in onshore courts, we recommend a lawyer review — which we can arrange.",
      },
      {
        question: "Can I edit the templates?",
        answer:
          "Yes. Templates are delivered in an editable format so you can add your parties, commercial terms and specific clauses.",
      },
      {
        question: "What if I need something more tailored?",
        answer:
          "Choose 'Custom drafting instead' in the request form, or go to our contract drafting service, and we will match you with a vetted lawyer.",
      },
    ],
    related: ["lawyer-matching", "retainers", "company-formation"],
  },
};

export function getServiceDetails(id: ServiceId): ServiceDetails {
  return SERVICE_DETAILS[id];
}
