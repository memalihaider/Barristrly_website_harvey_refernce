/**
 * Long-form, plain-English content for the practice-area pages
 * (/legal-services/[slug]) linked from the "For Businesses" mega menu.
 *
 * Writing rules: short sentences, explain legal terms, no promises about
 * case outcomes. Barristrly connects clients with independent, vetted,
 * UAE-licensed professionals — it is not a law firm.
 */

import type { ServiceId } from "./service-catalog";

export type PracticeDetails = {
  /** SEO title (site name is appended by the layout template). */
  metaTitle: string;
  metaDescription: string;
  /** Simple one-line promise under the H1. */
  heroLine: string;
  intro: { heading: string; paragraphs: string[] };
  /** "You may need this if…" situations. */
  situations: string[];
  /** What a matched lawyer can help with, grouped. */
  help: { title: string; items: string[] }[];
  /** Plain-English explainers of the most important rules. */
  keyFacts: { title: string; body: string }[];
  /** What to prepare before speaking to a lawyer. */
  prepare: string[];
  /** How fees usually work. */
  costs: string[];
  faqs: { question: string; answer: string }[];
  relatedServices: ServiceId[];
};

export const PRACTICE_DETAILS: Record<string, PracticeDetails> = {
  "mainland-litigation": {
    metaTitle: "Litigation Lawyers in Dubai & Abu Dhabi",
    metaDescription:
      "Need a litigation lawyer in Dubai or Abu Dhabi? Get matched with licensed UAE advocates for commercial cases, debt recovery, bounced cheques, rental disputes and criminal defence.",
    heroLine:
      "Facing a court case or chasing money you are owed? We match you with licensed UAE advocates who know the local courts.",
    intro: {
      heading: "Help with court cases in Dubai, Abu Dhabi and across the UAE",
      paragraphs: [
        "Going to court in the UAE can feel confusing. The process is in Arabic, there are strict deadlines, and the rules are different from many other countries. Choosing the wrong lawyer — or waiting too long — can cost you the case.",
        "Mainland (onshore) cases are heard in the local courts, such as the Dubai Courts, the Abu Dhabi Judicial Department and the federal courts in the other emirates. Only advocates with the right to appear in these courts can represent you there.",
        "Barristrly makes the first step simple. Tell us what happened in a short, free brief. We share it with up to three vetted, UAE-licensed advocates who handle your type of case, and you receive clear fee proposals within 48 hours. You then choose who to work with — there is no obligation.",
      ],
    },
    situations: [
      "A customer or company owes you money and will not pay",
      "You received a bounced cheque",
      "Someone has filed a case against you or your company",
      "You have a dispute with a landlord or tenant",
      "You received a police complaint, travel ban or court notice",
      "A business partner broke an agreement",
    ],
    help: [
      {
        title: "Commercial & civil cases",
        items: [
          "Breach of contract claims",
          "Partnership and shareholder disputes",
          "Claims for damages and compensation",
          "Defending a case filed against you",
        ],
      },
      {
        title: "Debt recovery",
        items: [
          "Legal notices and demand letters",
          "Payment orders for clear, documented debts",
          "Bounced cheque enforcement",
          "Execution of judgments and asset attachment",
        ],
      },
      {
        title: "Other court matters",
        items: [
          "Rental disputes at the Rental Dispute Centre",
          "Criminal defence and police complaints",
          "Travel ban checks and lifting",
          "Appeals against court judgments",
        ],
      },
    ],
    keyFacts: [
      {
        title: "Court cases run in Arabic",
        body: "All documents you submit to onshore UAE courts must be in Arabic. English contracts, emails and invoices are usually translated by a certified legal translator. Your lawyer will tell you which documents need translating.",
      },
      {
        title: "There are usually three levels of court",
        body: "Most cases start at the Court of First Instance. Either side can usually appeal to the Court of Appeal, and some cases can go further to the Court of Cassation, the highest court. Each stage has short deadlines to appeal.",
      },
      {
        title: "Bounced cheques are mostly a civil matter now",
        body: "Since 2022, most bounced cheque cases are no longer treated as a crime. The person holding the cheque can ask the execution court to collect the amount directly, which is often faster than a full lawsuit.",
      },
      {
        title: "A legal notice often comes first",
        body: "Before filing a case, many disputes start with a formal legal notice asking the other side to pay or act. A well-written notice is sometimes enough to settle the matter without court.",
      },
    ],
    prepare: [
      "Your contract, agreement or invoices",
      "Emails, WhatsApp messages and letters with the other side",
      "Cheques, bank statements or proof of payment",
      "Any court papers, police notices or legal notices you received",
      "A short timeline of what happened and when",
    ],
    costs: [
      "Many advocates charge a fixed fee for each stage of the case — for example, first instance, appeal and execution.",
      "Court fees are separate and are usually based on the amount you are claiming.",
      "You see each advocate's proposal before you decide. Barristrly does not charge you to submit a brief.",
    ],
    faqs: [
      {
        question: "How long does a court case take in Dubai?",
        answer:
          "It depends on the type of case and whether it is appealed. Simple debt claims and payment orders can move quickly, while complex commercial disputes with appeals can take a year or more. Your advocate will give you a realistic estimate for your case.",
      },
      {
        question: "Can I recover money from a bounced cheque?",
        answer:
          "Yes. In most cases you can ask the execution court to enforce the cheque directly. Your advocate will check the cheque and the paperwork and advise on the fastest route.",
      },
      {
        question: "Do I need to be in the UAE for my case?",
        answer:
          "Not always. Many steps can be handled by your advocate under a power of attorney, and many courts allow remote hearings. Some matters may need you to attend in person.",
      },
      {
        question: "Can a foreign lawyer represent me in UAE courts?",
        answer:
          "No. Only advocates licensed to appear before the UAE onshore courts can represent you there. Barristrly only introduces professionals with the right licences for your matter.",
      },
      {
        question: "Is it free to submit my case?",
        answer:
          "Yes. Submitting a brief is free and confidential. You only pay if you choose to hire one of the advocates and agree to their fee.",
      },
    ],
    relatedServices: ["lawyer-matching", "contract-drafting", "retainers"],
  },

  "corporate-structuring": {
    metaTitle: "Corporate & Commercial Lawyers in Dubai",
    metaDescription:
      "Corporate lawyers in Dubai and the UAE for company structuring, shareholder and JV agreements, founder vesting, governance and Corporate Tax readiness. Free brief, matched in 48 hours.",
    heroLine:
      "Set up your business the right way from the start — with vetted corporate lawyers who explain your options in plain English.",
    intro: {
      heading: "Corporate and commercial legal help for UAE businesses",
      paragraphs: [
        "How you structure your company affects almost everything: who owns what, who makes decisions, how you raise money, how much tax you pay, and what happens if a partner wants to leave. Fixing a bad structure later is expensive and stressful.",
        "In the UAE you can choose between a mainland company, a free zone company (such as DMCC, IFZA, DIFC or ADGM), or a mix — for example a free zone holding company with a mainland operating company. Each option has different rules for ownership, trading and tax.",
        "Barristrly matches you with vetted corporate lawyers who look at your real business — your customers, partners and plans — and recommend a structure and agreements that fit. You submit one free brief and receive proposals within 48 hours.",
      ],
    },
    situations: [
      "You are starting a company with one or more partners",
      "You are bringing in an investor or a new shareholder",
      "You want to set up a joint venture with another company",
      "You need clear rules for who decides what in your company",
      "A co-founder is leaving and you need to sort out their shares",
      "You want to restructure before Corporate Tax or a sale",
    ],
    help: [
      {
        title: "Structure & setup",
        items: [
          "Mainland vs free zone vs holding structure",
          "Memorandum and articles of association",
          "Branches and subsidiaries of foreign companies",
          "Restructuring and share transfers",
        ],
      },
      {
        title: "Shareholders & partners",
        items: [
          "Shareholders' agreements",
          "Founder vesting and leaver clauses",
          "Joint venture agreements",
          "Investor rights and term sheets",
        ],
      },
      {
        title: "Governance & compliance",
        items: [
          "Board and shareholder resolutions",
          "Ultimate Beneficial Owner (UBO) filings",
          "Corporate Tax and VAT readiness",
          "Buying or selling a business (M&A)",
        ],
      },
    ],
    keyFacts: [
      {
        title: "Foreigners can usually own 100% of a mainland company",
        body: "Since 2021, most business activities on the UAE mainland allow full foreign ownership. A small number of strategic activities still have limits. Your lawyer will check your activity.",
      },
      {
        title: "The articles are not enough on their own",
        body: "A company's memorandum or articles of association cover the basics. A separate shareholders' agreement sets the private rules — such as what happens if someone wants to sell, leave or stops working in the business.",
      },
      {
        title: "Corporate Tax applies to most companies",
        body: "The UAE charges 9% Corporate Tax on taxable profit above AED 375,000. Most companies, including many free zone companies, must register with the Federal Tax Authority even if they pay little or no tax.",
      },
      {
        title: "Companies must record who really owns them",
        body: "UAE companies must keep a register of their Ultimate Beneficial Owners (the real people behind the company) and keep it up to date with the registrar.",
      },
    ],
    prepare: [
      "Your trade licence and company documents (if already set up)",
      "A list of shareholders and how much each will own",
      "What each partner is contributing — money, work or assets",
      "Your plans for investment, growth or exit",
    ],
    costs: [
      "Simple documents, such as resolutions, are often fixed-fee.",
      "Shareholders' and joint venture agreements are usually quoted based on how complex the deal is.",
      "Government and free zone fees are always shown separately from the lawyer's fee.",
    ],
    faqs: [
      {
        question: "Should I choose mainland or free zone?",
        answer:
          "If you want to sell directly to customers anywhere in the UAE or to government, mainland is usually better. If you work mostly internationally, online or as a consultancy, a free zone can be simpler. A corporate lawyer will compare both for your business.",
      },
      {
        question: "Do I really need a shareholders' agreement?",
        answer:
          "If your company has more than one owner, yes. It protects everyone by agreeing in advance what happens if a partner leaves, a new investor joins, or the owners disagree.",
      },
      {
        question: "What is founder vesting?",
        answer:
          "Vesting means a founder earns their shares over time, for example over four years. If a founder leaves early, they keep only part of their shares. It protects the founders who stay.",
      },
      {
        question: "Can you help with Corporate Tax?",
        answer:
          "Yes. We can match you with professionals who help you register with the Federal Tax Authority and check whether your structure is tax-efficient and compliant.",
      },
    ],
    relatedServices: ["company-formation", "contract-drafting", "retainers"],
  },

  "real-estate": {
    metaTitle: "Real Estate & Property Lawyers in Dubai",
    metaDescription:
      "Property lawyers in Dubai and the UAE for off-plan purchases, SPA reviews, developer delays, cancellations, leases and construction disputes. Free brief, matched with vetted lawyers in 48 hours.",
    heroLine:
      "Buying, selling, renting or in a dispute over property? Get matched with vetted UAE real estate lawyers in 48 hours.",
    intro: {
      heading: "Property and real estate legal help in Dubai and the UAE",
      paragraphs: [
        "Property is often the biggest purchase people make. In the UAE, a small detail in a sale agreement or a developer contract can make a big difference if the project is delayed, the handover is late, or the unit is not what you were promised.",
        "Buyers, sellers, landlords, tenants and investors all face different risks. Off-plan buyers need to understand payment plans, escrow rules and what happens if the developer is late. Landlords and tenants need contracts that match local tenancy law.",
        "Barristrly matches you with vetted real estate lawyers who review documents before you sign, explain your rights in simple terms, and represent you if a dispute comes up. One free brief, proposals within 48 hours.",
      ],
    },
    situations: [
      "You are buying an off-plan or ready property and want the contract checked",
      "Your developer is late with handover or changed the project",
      "You want to cancel a purchase and get your money back",
      "You have a dispute with a tenant or landlord",
      "A contractor did poor work or did not finish the job",
      "You are buying property through a company",
    ],
    help: [
      {
        title: "Buying & selling",
        items: [
          "Sale and Purchase Agreement (SPA) review",
          "Off-plan payment plan and escrow checks",
          "Due diligence on title and the developer",
          "Transfers and registration support",
        ],
      },
      {
        title: "Disputes",
        items: [
          "Developer delay and non-delivery claims",
          "Contract cancellation and refunds",
          "Service charge and owners' association disputes",
          "Construction and contractor claims",
        ],
      },
      {
        title: "Renting",
        items: [
          "Lease drafting and review",
          "Rent increase and eviction notices",
          "Rental Dispute Centre cases",
          "Commercial lease negotiations",
        ],
      },
    ],
    keyFacts: [
      {
        title: "Off-plan payments go into escrow",
        body: "In Dubai, money paid for off-plan units should go into a project escrow account controlled by the authorities, not straight to the developer. This protects buyers if a project is delayed or cancelled.",
      },
      {
        title: "Register your purchase",
        body: "Off-plan purchases in Dubai are registered with the Dubai Land Department (often called Oqood). Registration records your ownership interest and is important if anything goes wrong later.",
      },
      {
        title: "Tenancy contracts must be registered",
        body: "Residential leases in Dubai are registered through Ejari. Rent increases follow official rules, and landlords must give proper written notice before most changes or evictions.",
      },
      {
        title: "Rental disputes have their own centre",
        body: "Disputes between landlords and tenants in Dubai usually go to the Rental Dispute Centre, which is faster and simpler than the regular courts.",
      },
    ],
    prepare: [
      "Your Sale and Purchase Agreement or lease",
      "Payment receipts and your payment plan",
      "Emails and letters from the developer, agent or landlord",
      "Title deed, Oqood or Ejari certificate (if you have one)",
      "Photos or reports for defects or unfinished work",
    ],
    costs: [
      "Contract reviews are usually a fixed fee.",
      "Disputes are often quoted per stage — notice, case filing, and any appeal.",
      "Land Department, registration and court fees are separate from the lawyer's fee.",
    ],
    faqs: [
      {
        question: "Should I get my SPA checked before signing?",
        answer:
          "Yes. The SPA decides what happens if the developer is late, changes the unit, or you cannot keep paying. A lawyer can explain the risky clauses and suggest changes before you commit.",
      },
      {
        question: "My developer is late. What can I do?",
        answer:
          "It depends on your contract and the project status. Options can include negotiating a settlement, claiming compensation, or asking to cancel and recover payments. A real estate lawyer will review your documents and explain the best route.",
      },
      {
        question: "Can my landlord increase the rent whenever they want?",
        answer:
          "No. In Dubai, rent increases must follow the official rental index rules and need proper advance notice. A lawyer can check whether an increase is allowed.",
      },
      {
        question: "Can you help if I live outside the UAE?",
        answer:
          "Yes. Many property matters can be handled through a lawyer under a power of attorney, so you do not always need to travel.",
      },
    ],
    relatedServices: ["contract-drafting", "lawyer-matching", "wills-estate"],
  },

  "labor-employment": {
    metaTitle: "Employment Lawyers in Dubai — Labour Disputes",
    metaDescription:
      "Employment lawyers in Dubai and the UAE for unfair dismissal, end-of-service gratuity, unpaid salary, non-compete clauses and employment contracts. Help for employees and employers.",
    heroLine:
      "Problem at work or hiring your team? Get clear advice on UAE labour law from vetted employment lawyers.",
    intro: {
      heading: "Employment and labour law help for employees and employers",
      paragraphs: [
        "Work problems are stressful — especially when your visa, salary and family are tied to your job. Employers also face risk if contracts, notices or terminations are not done properly.",
        "Most private-sector jobs on the UAE mainland follow the UAE Labour Law (Federal Decree-Law No. 33 of 2021). Free zones such as DIFC and ADGM have their own employment laws. The rules on notice, gratuity, leave and termination depend on which law applies to you.",
        "Barristrly matches employees and employers with vetted employment lawyers who explain your rights in simple words, check the numbers, and help you resolve the issue — through negotiation, a MOHRE complaint, or the labour court. Submit a free brief and get proposals within 48 hours.",
      ],
    },
    situations: [
      "You were dismissed and think it was unfair",
      "Your salary or end-of-service gratuity has not been paid",
      "Your employer wants you to sign a non-compete or resignation",
      "You received a warning, absconding report or ban",
      "You are an employer hiring staff or ending a contract",
      "You need employment contracts or an HR policy",
    ],
    help: [
      {
        title: "For employees",
        items: [
          "Unfair or arbitrary dismissal claims",
          "Unpaid salary and gratuity calculations",
          "MOHRE complaints and labour court cases",
          "Reviewing settlement and resignation papers",
        ],
      },
      {
        title: "For employers",
        items: [
          "Employment contracts and offer letters",
          "Termination and redundancy process",
          "Handling MOHRE complaints",
          "Employee handbooks and HR policies",
        ],
      },
      {
        title: "Senior & executive roles",
        items: [
          "Executive contract review",
          "Non-compete and confidentiality clauses",
          "Bonus, commission and share schemes",
          "Exit negotiations and settlements",
        ],
      },
    ],
    keyFacts: [
      {
        title: "How end-of-service gratuity works",
        body: "Under the UAE Labour Law, full-time employees who complete at least one year usually earn 21 days of basic salary for each of the first five years, and 30 days for each year after that. The total is capped at two years' pay.",
      },
      {
        title: "Notice periods are set in your contract",
        body: "The notice period must be between 30 and 90 days. If notice is not given properly, the other side may have to pay salary for the notice period instead.",
      },
      {
        title: "Complaints start with MOHRE",
        body: "Most mainland labour disputes start with a complaint to the Ministry of Human Resources and Emiratisation (MOHRE). If it is not settled there, the case can go to the labour court.",
      },
      {
        title: "Non-compete clauses have limits",
        body: "A non-compete clause must be reasonable. It must be limited in time (up to two years), place and type of work. A lawyer can tell you whether yours is likely to be enforceable.",
      },
    ],
    prepare: [
      "Your employment contract and offer letter",
      "Recent payslips and bank statements showing salary",
      "Any warning, termination or resignation letters",
      "Emails or messages about the problem",
      "Your start date and visa details",
    ],
    costs: [
      "A one-off consultation or contract review is often a fixed fee.",
      "Claims are usually quoted per stage — negotiation, MOHRE complaint and court.",
      "Employers can cover ongoing HR questions through a monthly legal retainer.",
    ],
    faqs: [
      {
        question: "How do I calculate my gratuity?",
        answer:
          "Gratuity is based on your basic salary (not your total package) and your years of service. Generally it is 21 days' basic pay for each of the first five years and 30 days for each year after. An employment lawyer can check your exact figure.",
      },
      {
        question: "Can I be fired without a reason?",
        answer:
          "The UAE Labour Law protects employees from unfair dismissal — for example, being fired for making a genuine complaint. If a dismissal is found to be unfair, the employer may have to pay compensation of up to three months' salary.",
      },
      {
        question: "Is my non-compete clause valid?",
        answer:
          "It depends on how long it lasts, where it applies and what work it covers. Clauses that are too broad may not be enforced. A lawyer can review it for you.",
      },
      {
        question: "Do DIFC and ADGM have different rules?",
        answer:
          "Yes. If your employer is registered in the DIFC or ADGM, their own employment laws apply, including different rules on end-of-service payments and disputes.",
      },
    ],
    relatedServices: ["retainers", "contract-drafting", "agreements-ebooks"],
  },

  "tech-ip-digital-assets": {
    metaTitle: "Tech, IP & Data Protection Lawyers in Dubai",
    metaDescription:
      "Technology and IP lawyers in Dubai and the UAE for trademark registration, software and SaaS agreements, website terms, privacy policies, data protection and Web3 regulation.",
    heroLine:
      "Protect your brand, your code and your customers' data — with vetted tech and IP lawyers who speak startup.",
    intro: {
      heading: "Technology, IP and data protection legal help in the UAE",
      paragraphs: [
        "For tech companies and online businesses, your most valuable assets are often things you cannot touch: your brand name, your software, your content and your customer data. If they are not protected properly, someone else can copy them — or you can be fined for misusing data.",
        "The UAE has clear rules for trademarks, copyright, e-commerce and data protection. The DIFC and ADGM have their own data protection laws, and Dubai has a dedicated regulator for virtual assets. Knowing which rules apply to you is the first step.",
        "Barristrly matches founders and businesses with vetted technology and IP lawyers who explain the rules simply, register your rights, and draft the agreements and policies your product needs. One free brief, proposals within 48 hours.",
      ],
    },
    situations: [
      "You want to register your brand name or logo as a trademark",
      "You are launching a website, app or online store",
      "You collect customer data and need a privacy policy",
      "You license software or sell a SaaS product",
      "Someone is copying your brand or content",
      "You are building a crypto, Web3 or fintech product",
    ],
    help: [
      {
        title: "Intellectual property",
        items: [
          "Trademark search and registration",
          "Copyright and content protection",
          "IP assignment from founders and freelancers",
          "Action against copying and infringement",
        ],
      },
      {
        title: "Tech contracts",
        items: [
          "SaaS and software licence agreements",
          "Website and app terms of use",
          "Developer and outsourcing contracts",
          "API, reseller and partnership terms",
        ],
      },
      {
        title: "Data & regulation",
        items: [
          "Privacy policies and cookie notices",
          "UAE, DIFC and ADGM data protection compliance",
          "Fintech and virtual asset licensing questions",
          "E-commerce and consumer protection rules",
        ],
      },
    ],
    keyFacts: [
      {
        title: "Register your trademark early",
        body: "In the UAE, trademarks are registered with the Ministry of Economy. Registration gives you the clearest legal right to stop others using your brand. Registering before you launch avoids costly rebranding later.",
      },
      {
        title: "Make sure your company owns the code",
        body: "If freelancers or founders built your product, the IP may legally belong to them unless there is a written assignment. Investors usually check this before they invest.",
      },
      {
        title: "Data protection laws apply to most businesses",
        body: "The UAE has a federal Personal Data Protection Law, and the DIFC and ADGM have their own data protection laws. If you collect names, emails or payment details, you need a clear privacy policy and a lawful reason to use the data.",
      },
      {
        title: "Virtual assets are regulated",
        body: "Crypto and other virtual asset businesses need the right licence. In Dubai this is overseen by the Virtual Assets Regulatory Authority (VARA), while the DIFC and ADGM have their own regimes.",
      },
    ],
    prepare: [
      "Your brand name, logo and the countries you sell in",
      "A short description of your product and business model",
      "Any existing terms, contracts or privacy policy",
      "Details of who built your product (employees, freelancers, agencies)",
    ],
    costs: [
      "Trademark filings and standard policies are usually fixed-fee.",
      "Custom SaaS or licensing agreements are quoted by scope.",
      "Official trademark and licensing fees are shown separately.",
    ],
    faqs: [
      {
        question: "How long does trademark registration take in the UAE?",
        answer:
          "It usually takes a few months from filing to registration, including examination and a publication period where others can object. A lawyer can run a search first to reduce the risk of rejection.",
      },
      {
        question: "Do I need a privacy policy for my website?",
        answer:
          "If your website or app collects any personal data — even just email addresses — you should have a clear privacy policy that explains what you collect and why.",
      },
      {
        question: "Can I copy terms and conditions from another website?",
        answer:
          "It is risky. Copied terms may not match your business, may not suit UAE law, and can even breach copyright. Tailored terms protect you much better.",
      },
      {
        question: "Can you help with crypto or Web3 projects?",
        answer:
          "Yes. We can match you with lawyers who understand virtual asset rules in Dubai, the DIFC and ADGM and can explain which licence, if any, your project needs.",
      },
    ],
    relatedServices: ["contract-drafting", "agreements-ebooks", "company-formation"],
  },

  "arbitration-debt-collection": {
    metaTitle: "Debt Recovery & Arbitration Lawyers in Dubai",
    metaDescription:
      "Recover unpaid debts and resolve cross-border disputes with vetted UAE lawyers. Debt collection, international arbitration, enforcement of foreign judgments and awards, and settlements.",
    heroLine:
      "Owed money by a company in the UAE or abroad? Get matched with vetted lawyers for debt recovery, arbitration and enforcement.",
    intro: {
      heading: "Debt recovery and cross-border disputes, handled clearly",
      paragraphs: [
        "Unpaid invoices hurt cash flow, and chasing a debtor in another country can feel impossible. The good news is that the UAE has well-established routes for recovering money — from a firm legal notice to court payment orders, arbitration and enforcement against assets.",
        "If your contract has an arbitration clause, the dispute may need to go to an arbitration centre such as DIAC or the ICC instead of the courts. If you already won a judgment or award in another country, it may be possible to enforce it in the UAE — and UAE awards can often be enforced abroad.",
        "Barristrly matches you with vetted lawyers and recovery specialists who look at your documents, explain the fastest realistic route, and help you recover what you are owed. Submit one free brief and receive proposals within 48 hours.",
      ],
    },
    situations: [
      "A client has not paid your invoices",
      "A debtor has moved assets or left the country",
      "Your contract says disputes go to arbitration",
      "You won a judgment or award abroad and want to enforce it in the UAE",
      "You want to settle a dispute without going to court",
      "You need to find out what assets a debtor owns",
    ],
    help: [
      {
        title: "Debt recovery",
        items: [
          "Demand letters and legal notices",
          "Negotiated settlements and payment plans",
          "Court payment orders",
          "Freezing and attaching assets",
        ],
      },
      {
        title: "Arbitration",
        items: [
          "Starting or defending an arbitration",
          "DIAC, ICC and ad hoc arbitration",
          "Emergency and interim relief",
          "Expert and quantum support",
        ],
      },
      {
        title: "Enforcement",
        items: [
          "Enforcing foreign judgments in the UAE",
          "Enforcing arbitration awards locally and abroad",
          "Asset tracing and investigations",
          "Execution against bank accounts and property",
        ],
      },
    ],
    keyFacts: [
      {
        title: "Check your contract first",
        body: "If your contract has an arbitration clause, you usually must use arbitration instead of the courts. If it names a court — for example the DIFC Courts — that court may be the right place to start.",
      },
      {
        title: "Arbitration awards travel well",
        body: "The UAE is a member of the New York Convention, which means arbitration awards can usually be enforced in more than 160 countries — and foreign awards can be enforced in the UAE.",
      },
      {
        title: "Payment orders can be fast",
        body: "For clear, documented debts — such as signed invoices or acknowledgments — the UAE courts offer a payment order procedure that is usually much faster than a full lawsuit.",
      },
      {
        title: "Act before assets disappear",
        body: "If you worry a debtor will move money or property, a lawyer can ask the court for a precautionary attachment to freeze assets while the case continues.",
      },
    ],
    prepare: [
      "The contract and any purchase orders",
      "Unpaid invoices and a statement of account",
      "Emails or messages where the debtor accepts the debt",
      "Any judgment or award you already have",
      "What you know about the debtor's assets and location",
    ],
    costs: [
      "Demand letters are usually a low fixed fee.",
      "Some recovery specialists work partly on a success-fee basis, depending on the case.",
      "Court and arbitration centre fees are separate and depend on the amount claimed.",
    ],
    faqs: [
      {
        question: "What is the first step to recover a debt in the UAE?",
        answer:
          "Usually a formal legal notice from a lawyer. Many debtors pay or agree a payment plan at this stage. If not, your lawyer can move to a payment order, a lawsuit or arbitration.",
      },
      {
        question: "Can I enforce a foreign court judgment in the UAE?",
        answer:
          "Often, yes — depending on the country and whether certain conditions are met. A lawyer will check whether your judgment can be enforced and through which court.",
      },
      {
        question: "Is arbitration faster than court?",
        answer:
          "Not always, but it is private, you can choose expert arbitrators, and the award is easier to enforce internationally. Your lawyer will explain which route suits your dispute.",
      },
      {
        question: "Do lawyers work on a no-win, no-fee basis?",
        answer:
          "Some debt recovery specialists offer partial success-fee arrangements for suitable cases. You will see each professional's fee model in their proposal.",
      },
    ],
    relatedServices: ["lawyer-matching", "contract-drafting", "retainers"],
  },

  "private-client-estate": {
    metaTitle: "Family, Wills & Estate Lawyers in Dubai",
    metaDescription:
      "Family and private client lawyers in Dubai and the UAE for non-Muslim wills, probate, inheritance, divorce, child custody, guardianship and family wealth planning.",
    heroLine:
      "Protect your family and your assets — with vetted UAE family and estate lawyers who handle sensitive matters with care.",
    intro: {
      heading: "Family law, wills and estate planning in the UAE",
      paragraphs: [
        "Family matters are personal and often emotional. Whether you are planning ahead with a Will, dealing with the loss of a loved one, or going through a divorce, you need clear advice and a lawyer you can trust.",
        "The UAE now has a civil personal status framework for non-Muslims, covering marriage, divorce, custody and inheritance. Non-Muslims can also register Wills with the DIFC Courts or the ADGM Courts. Which option suits you depends on your family, your assets and where they are.",
        "Barristrly matches you with vetted family and private client lawyers who listen first, explain your choices in simple words, and handle your matter discreetly. Submit a free, confidential brief and receive proposals within 48 hours.",
      ],
    },
    situations: [
      "You want to make a Will to protect your children and assets",
      "A family member passed away and you need to deal with their estate",
      "Bank accounts have been frozen after a death",
      "You are going through a separation or divorce",
      "You need to agree custody or guardianship of children",
      "You want to protect family wealth or a family business",
    ],
    help: [
      {
        title: "Wills & inheritance",
        items: [
          "DIFC and ADGM non-Muslim Wills",
          "Guardianship for minor children",
          "Probate and estate administration",
          "Unfreezing bank accounts and transferring assets",
        ],
      },
      {
        title: "Family law",
        items: [
          "Divorce and separation",
          "Child custody and visitation",
          "Financial settlements and maintenance",
          "Prenuptial and postnuptial agreements",
        ],
      },
      {
        title: "Family wealth",
        items: [
          "Cross-border estate planning",
          "Family foundations and holding structures",
          "Succession planning for family businesses",
          "Powers of attorney",
        ],
      },
    ],
    keyFacts: [
      {
        title: "Without a Will, the law decides",
        body: "If you pass away without a registered Will, UAE inheritance rules decide who receives your assets — and bank accounts can be frozen while this is worked out. A registered Will lets you choose.",
      },
      {
        title: "Non-Muslims have civil law options",
        body: "UAE civil personal status laws allow non-Muslims to marry, divorce and pass on assets under civil rules, rather than Sharia-based rules, in many cases.",
      },
      {
        title: "Name a guardian for your children",
        body: "A Will is the clearest way to say who should look after your children if something happens to you. Without one, a court may need to decide.",
      },
      {
        title: "Assets abroad may need separate planning",
        body: "A UAE Will may not cover property or accounts in other countries. Many families keep a UAE Will for UAE assets and a separate Will at home.",
      },
    ],
    prepare: [
      "Passports and Emirates IDs of family members involved",
      "Marriage certificate and children's birth certificates",
      "A list of main assets — property, bank accounts, shares",
      "Any existing Will, court documents or death certificate",
    ],
    costs: [
      "Wills are usually a fixed fee, with registration fees paid separately.",
      "Probate and divorce matters are often quoted per stage.",
      "All conversations are confidential, and submitting a brief is free.",
    ],
    faqs: [
      {
        question: "Is my information kept private?",
        answer:
          "Yes. Family matters are sensitive. Your brief is shared only with the professionals matched to your matter, and you decide whether to go ahead.",
      },
      {
        question: "What happens to bank accounts when someone dies in the UAE?",
        answer:
          "Accounts in the deceased person's name are often frozen until the court confirms who the heirs are. A registered Will and good planning can make this process much faster.",
      },
      {
        question: "Can non-Muslims get a civil divorce in the UAE?",
        answer:
          "Yes. The civil personal status laws allow non-Muslims to apply for divorce under civil rules in many cases. A family lawyer will explain the process and what it means for custody and finances.",
      },
      {
        question: "Which is better — a DIFC Will or an ADGM Will?",
        answer:
          "Both are recognised options for non-Muslims. The right choice depends on your assets, where you live and your plans. A Wills lawyer will compare them for you.",
      },
    ],
    relatedServices: ["wills-estate", "retainers", "company-formation"],
  },
};

export function getPracticeDetails(slug: string): PracticeDetails | null {
  return PRACTICE_DETAILS[slug] ?? null;
}
