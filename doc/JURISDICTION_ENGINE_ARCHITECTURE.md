# ⚖️ Barristrly Jurisdiction Engine Architecture

> Version: 1.0
> Status: Approved
> Owner: Legal Intelligence Platform
> Reviewers: Product, AI Engineering, Legal Advisory Board
> Depends On:
> - LEGAL_DOMAIN_MODEL.md
> - PRACTICE_AREA_FRAMEWORK.md
> - RAG_ARCHITECTURE.md
> - AI_MODEL_ROUTING.md
> Last Updated: July 2026

---

# Purpose

The Jurisdiction Engine enables Barristrly to operate across multiple countries, states, provinces, courts, and regulatory systems without changing the core platform.

It ensures that AI, workflows, legal research, templates, deadlines, compliance requirements, and document generation are automatically adapted to the governing legal jurisdiction.

---

# Vision

```
Matter

↓

Jurisdiction

↓

Jurisdiction Engine

↓

AI

↓

Workflow

↓

Templates

↓

Court Rules

↓

Deadlines

↓

Compliance

↓

Legal Output
```

The same AI request should produce different legal outputs depending on the governing jurisdiction.

---

# Design Principles

✓ Jurisdiction-Aware by Default

✓ Configuration over Code

✓ Multi-Level Legal Hierarchy

✓ AI Context Isolation

✓ Localization First

✓ Extensible to New Countries

✓ Rule-Based Decision Engine

✓ Evidence-Based Legal Reasoning

---

# Jurisdiction Hierarchy

```
Global

↓

Country

↓

State / Province / Emirate

↓

Court System

↓

Court

↓

Judge (Optional)

↓

Matter
```

Each level may override rules defined by higher levels.

---

# Jurisdiction Object

Every jurisdiction contains:

- ID
- Name
- ISO Code
- Parent Jurisdiction
- Time Zone
- Official Languages
- Currency
- Court System
- Applicable Laws
- Procedural Rules
- Filing Requirements
- Holidays
- Working Days
- Compliance Requirements
- Supported AI Packs

---

# Multi-Level Inheritance

Example:

```
United States

↓

California

↓

Los Angeles County

↓

Superior Court
```

Inheritance order:

1. Global Rules
2. Country Rules
3. State Rules
4. Court Rules
5. Matter Overrides

Lower levels override higher levels where conflicts exist.

---

# Supported Jurisdictions

The engine should support:

- Pakistan
- United Arab Emirates
- Saudi Arabia
- Qatar
- Bahrain
- Oman
- Kuwait
- United Kingdom
- United States
- Canada
- Australia
- European Union
- Singapore
- Malaysia
- India

The architecture must allow onboarding of new jurisdictions through configuration.

---

# Legal System Types

Supported legal traditions include:

- Common Law
- Civil Law
- Mixed Systems
- Sharia-Based Systems
- Customary Law (where applicable)

Legal reasoning, templates, and workflows should reflect the governing legal system.

---

# Court Hierarchy

Example:

```
Supreme Court

↓

Court of Appeal

↓

High Court

↓

District Court

↓

Specialized Tribunal
```

Court structures vary by jurisdiction and are modeled independently.

---

# Court Metadata

Each court records:

- Name
- Jurisdiction
- Court Level
- Filing Methods
- Accepted Document Formats
- Operating Hours
- Fee Schedule
- Contact Information

---

# Procedural Rules

Each jurisdiction defines:

- Filing Deadlines
- Service Requirements
- Hearing Procedures
- Appeal Windows
- Notice Periods
- Limitation Rules
- Evidence Standards

These rules drive workflows and AI recommendations.

---

# Limitation Period Engine

Each matter type may define:

- Trigger Event
- Limitation Period
- Pause Rules
- Extension Rules
- Expiry Calculation

Example:

```
Cause of Action

↓

Limitation Rule

↓

Applicable Exceptions

↓

Deadline Calculation

↓

Reminder Workflow
```

---

# Legal Calendar

Every jurisdiction maintains:

- Public Holidays
- Court Holidays
- Working Days
- Emergency Closures

Deadline calculations respect the legal calendar.

---

# Deadline Engine

Inputs:

- Matter Type
- Jurisdiction
- Court
- Trigger Date

Outputs:

- Filing Deadline
- Response Deadline
- Appeal Deadline
- Reminder Schedule

All calculations are versioned and auditable.

---

# AI Context Selection

The Jurisdiction Engine injects:

- Governing Laws
- Practice Area
- Court Rules
- Relevant Templates
- Regulatory Guidance
- Local Terminology

before the prompt reaches the AI model.

---

# Jurisdiction-Specific Prompt Packs

Example:

```
Matter

↓

Employment Law

↓

United Arab Emirates

↓

Employment Prompt Pack

↓

Gemini / GPT

↓

Localized Output
```

Different jurisdictions use different prompt instructions.

---

# RAG Partitioning

Legal knowledge retrieval is filtered by:

- Country
- State
- Practice Area
- Court
- Language
- Document Type

Cross-jurisdiction retrieval occurs only when explicitly requested.

---

# Template Localization

Templates vary by:

- Jurisdiction
- Language
- Court
- Practice Area

Examples:

- Employment Contract (UAE)
- Employment Contract (Pakistan)
- Employment Contract (England & Wales)

Each template includes version history and effective dates.

---

# Regulatory Engine

Supports:

- Regulatory Authorities
- Filing Requirements
- Reporting Obligations
- Licensing Rules
- Compliance Deadlines

Organizations may enable only the regulators relevant to their practice.

---

# Language Support

Each jurisdiction defines:

- Primary Language
- Secondary Languages
- Legal Terminology
- Date Formats
- Number Formats
- Currency

AI responses may be localized while preserving legal meaning.

---

# Legal Citation Standards

Support jurisdiction-specific citation styles.

Examples:

- OSCOLA
- Bluebook
- AGLC
- Local court citation formats

Citation generation should be configurable.

---

# Conflict Resolution

When multiple legal systems apply:

```
Matter

↓

Applicable Jurisdictions

↓

Priority Rules

↓

Conflict Analysis

↓

Law Selection

↓

AI Guidance
```

The platform should explain which jurisdiction was applied and why.

---

# Cross-Border Matters

Support:

- Multiple governing laws
- Multiple courts
- Multiple parties
- Multiple currencies
- Local counsel coordination

Cross-border workflows maintain separate jurisdictional timelines where required.

---

# Versioned Legal Rules

Every legal rule stores:

- Effective Date
- Expiry Date
- Source
- Jurisdiction
- Version
- Change Notes

Historical matters continue using the rules in effect at the relevant time unless overridden by law.

---

# AI Guardrails

AI must:

- Identify the governing jurisdiction
- Avoid assuming foreign legal rules
- Cite retrieved sources where available
- State uncertainty when jurisdiction is ambiguous
- Recommend human review for high-risk legal advice

---

# Analytics

Track:

- Matters by Jurisdiction
- Filing Success Rates
- Court Processing Times
- AI Usage by Jurisdiction
- Deadline Compliance
- Regulatory Activity

Analytics help organizations compare operational performance across jurisdictions.

---

# Security

Jurisdiction metadata is shared platform configuration.

Matter-specific legal data remains isolated by tenant through the multi-tenancy architecture.

Jurisdiction rules must never expose confidential customer information.

---

# Governance

Jurisdiction updates require:

- Legal review
- Version approval
- Effective date
- Regression testing
- AI evaluation

Changes are published through controlled releases.

---

# Future Enhancements

- Automated legal update ingestion
- Court rule change monitoring
- AI-assisted rule drafting
- Interactive jurisdiction comparison
- International treaty modeling
- Choice-of-law recommendation engine
- Court filing API integrations
- Predictive procedural timeline estimation

---

# Success Criteria

The Jurisdiction Engine must:

✓ Support multiple countries, regions, and court systems using configuration rather than application code.

✓ Provide jurisdiction-aware AI, workflows, templates, and compliance logic.

✓ Accurately calculate legal deadlines using local procedural rules and calendars.

✓ Enable localized legal reasoning while maintaining a unified platform architecture.

✓ Scale to hundreds of jurisdictions and evolving legal systems through versioned rule management.

✓ Serve as the authoritative foundation for Barristrly's global Legal Intelligence Platform.

This document is the canonical specification for jurisdiction-aware behavior across the Barristrly platform.