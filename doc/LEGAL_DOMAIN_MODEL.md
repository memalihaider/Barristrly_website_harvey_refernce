# ⚖️ Barristrly Legal Domain Model

> Version: 1.0
> Status: Approved
> Owner: Product & Legal Domain Architecture
> Reviewers: Legal Advisory Board, AI Team, Platform Engineering
> Depends On:
> - PRD.md
> - DATABASE_SCHEMA.md
> - AI_ARCHITECTURE.md
> - WORKFLOW_AUTOMATION_ENGINE.md
> Last Updated: July 2026

---

# Purpose

This document defines the canonical legal business model used throughout Barristrly.

It establishes a shared vocabulary and business semantics for:

- Engineering
- Product
- AI Agents
- APIs
- Workflows
- Analytics
- Reporting
- Documentation

Every system should reference these domain definitions instead of inventing local terminology.

---

# Vision

Barristrly models the real-world operation of a legal practice.

```
Client

↓

Matter

↓

Legal Work

↓

Documents

↓

Meetings

↓

Tasks

↓

Billing

↓

Resolution

↓

Archive
```

The Matter is the central business entity.

---

# Core Domain Principles

✓ Matter-Centric

✓ Client-Focused

✓ Jurisdiction-Aware

✓ AI-Native

✓ Workflow Driven

✓ Document First

✓ Multi-Tenant

✓ Audit Ready

---

# Domain Hierarchy

```
Platform

↓

Organization

↓

Workspace

↓

Matter

↓

Participants

↓

Documents

↓

Meetings

↓

Tasks

↓

Financial Records

↓

Audit History
```

Every business object belongs to a matter directly or indirectly.

---

# Primary Business Entities

## Organization

Represents:

- Law Firm
- Corporate Legal Department
- Government Agency
- Consultancy

Owns:

- Users
- Clients
- Matters
- Billing
- Documents
- AI Memory

---

## Workspace

Logical division inside an organization.

Examples:

- Litigation
- Employment
- Corporate
- Intellectual Property
- Compliance

---

## User

A person with authenticated access.

Examples:

- Partner
- Associate
- Paralegal
- Legal Assistant
- Finance
- Administrator

---

## Client

Represents the organization or person receiving legal services.

Client Types:

- Individual
- Company
- Government Entity
- Non-Profit
- Partnership
- Trust

A client may have multiple matters.

---

## Contact

Individuals associated with a client.

Examples:

- CEO
- HR Manager
- Finance Director
- General Counsel

A contact belongs to exactly one client but may participate in multiple matters.

---

# Matter

The Matter is the heart of Barristrly.

Every legal activity belongs to a matter.

Examples:

- Employment Dispute
- Company Registration
- Trademark Filing
- Contract Review
- Litigation
- Due Diligence

---

Matter Attributes

- Matter Number
- Title
- Description
- Status
- Priority
- Practice Area
- Jurisdiction
- Responsible Lawyer
- Client
- Open Date
- Close Date

---

# Matter Lifecycle

```
Created

↓

Conflict Check

↓

Accepted

↓

Planning

↓

Active Work

↓

Review

↓

Completed

↓

Archived
```

Each transition may trigger workflows and AI assistance.

---

# Practice Areas

Illustrative categories:

- Corporate
- Commercial
- Employment
- Litigation
- Arbitration
- Criminal
- Civil
- Family
- Immigration
- Intellectual Property
- Tax
- Banking & Finance
- Real Estate
- Construction
- Technology
- Data Protection
- Compliance
- Mergers & Acquisitions
- Insolvency
- Healthcare

Organizations may define additional practice areas.

---

# Jurisdiction

Represents the legal system governing a matter.

Examples:

- Country
- State / Province
- Emirate
- Federal Court
- Specialized Tribunal

Jurisdiction influences:

- AI reasoning
- Templates
- Deadlines
- Compliance
- Court procedures

---

# Court / Tribunal

Represents the adjudicating authority.

Examples:

- Civil Court
- High Court
- Labor Court
- Arbitration Center
- Regulatory Tribunal

A matter may reference multiple proceedings over time.

---

# Parties

Participants in a legal matter.

Examples:

- Plaintiff
- Defendant
- Applicant
- Respondent
- Petitioner
- Witness
- Expert
- Third Party

A party may represent an individual or organization.

---

# Representation

Defines the legal relationship.

Examples:

- Represents Plaintiff
- Represents Defendant
- External Counsel
- Co-Counsel
- Opposing Counsel

Representation history is retained for auditing.

---

# Documents

Every legal document belongs to a matter.

Examples:

- Contract
- Pleading
- Motion
- Evidence
- Opinion
- Invoice
- Correspondence
- Court Order
- Affidavit
- Agreement

Documents support:

- Versioning
- OCR
- AI Review
- E-signature
- Classification

---

# Document Lifecycle

```
Draft

↓

Review

↓

Approved

↓

Executed

↓

Archived
```

Version history is preserved.

---

# Evidence

Evidence may include:

- Documents
- Images
- Audio
- Video
- Emails
- Metadata
- Physical Evidence Records

Evidence maintains:

- Chain of custody
- Source
- Collection date
- Integrity metadata

---

# Meetings

Meetings include:

- Client Consultation
- Court Hearing
- Internal Review
- Negotiation
- Mediation
- Arbitration Session

Meetings may generate:

- Notes
- AI Summaries
- Tasks
- Billing Entries

---

# Tasks

Examples:

- Review Contract
- Prepare Filing
- Collect Evidence
- Client Follow-up
- Research Case Law

Task states:

```
Open

↓

Assigned

↓

In Progress

↓

Blocked

↓

Completed
```

---

# Time Entries

Capture:

- Lawyer
- Matter
- Activity
- Duration
- Billable Flag
- Billing Rate

Time entries support billing and productivity analytics.

---

# Billing Models

Supported:

- Hourly
- Fixed Fee
- Retainer
- Subscription
- Contingency (where applicable)
- Hybrid

Billing rules are configurable per matter.

---

# Trust Accounting

For jurisdictions where required, support:

- Client Trust Accounts
- Deposits
- Withdrawals
- Reconciliation
- Ledger History

Implementation should respect jurisdiction-specific legal requirements.

---

# Deadlines

Types include:

- Court Deadline
- Filing Deadline
- Client Deadline
- Internal Deadline
- Statutory Deadline

Deadline calculations may depend on jurisdictional rules.

---

# Conflict of Interest

Conflict checks evaluate:

- Clients
- Related Parties
- Opposing Parties
- Lawyers
- Previous Matters

Potential conflicts require review before matter acceptance.

---

# Legal Research

Research artifacts include:

- Statutes
- Regulations
- Case Law
- Internal Knowledge
- Legal Opinions

AI-generated research must distinguish retrieved sources from generated analysis.

---

# Contracts

Contracts support:

- Drafting
- Clause Libraries
- Version Comparison
- Risk Analysis
- Approval Workflow
- E-Signature

Contracts may be standalone or associated with a matter.

---

# AI Domain Objects

AI interacts with:

- Matter Summary
- Client Profile
- Legal Timeline
- Clause Extraction
- Research Notes
- Risk Register
- Action Items

These are derived artifacts and never replace the underlying legal record.

---

# Notifications

Events include:

- Matter Assigned
- Deadline Approaching
- Document Approved
- Invoice Issued
- Hearing Scheduled
- Workflow Completed

Notification preferences are configurable by user and organization.

---

# Analytics Dimensions

Common reporting dimensions:

- Practice Area
- Lawyer
- Client
- Matter Status
- Jurisdiction
- Revenue
- Time Logged
- AI Usage
- Workflow Efficiency

---

# Business Rules

Core rules include:

1. Every matter belongs to one organization.
2. Every matter has exactly one primary client.
3. Documents belong to a matter unless explicitly marked as reusable templates.
4. Every financial transaction is auditable.
5. Every AI action is attributable.
6. Closed matters become read-only except through controlled administrative procedures.
7. Cross-tenant relationships are prohibited unless explicitly supported by a governed collaboration feature.

---

# Ubiquitous Language

| Term | Definition |
|------|------------|
| Matter | Primary legal engagement managed by the platform |
| Client | Recipient of legal services |
| Contact | Individual associated with a client |
| Party | Participant in legal proceedings |
| Workspace | Organizational subdivision |
| Practice Area | Area of legal specialization |
| Jurisdiction | Governing legal authority |
| Evidence | Material supporting legal claims |
| Time Entry | Record of work performed |
| Workflow | Automated business process |

These definitions should remain consistent across documentation, APIs, database schemas, AI prompts, and user interfaces.

---

# Future Enhancements

- Multi-jurisdiction matters
- Cross-border regulatory modeling
- Court-specific procedural rules
- Legal entity relationship graphs
- Knowledge graph integration
- Practice-area-specific domain extensions
- AI-generated legal timelines
- Jurisdictional rules engine

---

# Success Criteria

The Legal Domain Model must:

✓ Establish a shared legal vocabulary across the platform.

✓ Define the canonical business entities used by engineering, AI, and product teams.

✓ Ensure consistent modeling of matters, clients, documents, workflows, and financial records.

✓ Support multiple jurisdictions and practice areas.

✓ Serve as the authoritative reference for all future legal domain extensions.

This document is the canonical business domain specification for the Barristrly Legal Intelligence Platform.
