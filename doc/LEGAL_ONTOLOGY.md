# ⚖️ Barristrly Legal Ontology

> Version: 1.0
> Status: Approved
> Owner: AI Knowledge Platform
> Reviewers: AI Engineering, Product Architecture, Legal Advisory Board
> Depends On:
> - LEGAL_DOMAIN_MODEL.md
> - LEGAL_KNOWLEDGE_GRAPH.md
> - AI_ARCHITECTURE.md
> - DATABASE_SCHEMA.md
> - API_ARCHITECTURE.md
> Last Updated: July 2026

---

# Purpose

The Legal Ontology defines the official semantic model of Barristrly.

It standardizes the meaning of legal concepts across every module, ensuring that humans, AI agents, APIs, databases, workflows, analytics, and integrations interpret legal information consistently.

The ontology is the single source of truth for legal terminology and semantic relationships.

---

# Vision

```
              Legal Ontology

                     │

        Defines Meaning of Everything

                     │

──────────────────────────────────────────

Database

Knowledge Graph

AI Agents

APIs

Search

Analytics

Workflows

Documents

Marketplace

Research Engine
```

---

# Objectives

The ontology shall:

✓ Define canonical legal entities

✓ Standardize terminology

✓ Enable AI reasoning

✓ Improve interoperability

✓ Support semantic search

✓ Eliminate ambiguous meanings

✓ Enable explainable AI

✓ Support multi-jurisdiction law

---

# Design Principles

✓ Domain Driven

✓ Jurisdiction Neutral Core

✓ Jurisdiction Extensions

✓ AI Friendly

✓ Machine Readable

✓ Human Readable

✓ Versioned

✓ Extensible

---

# Ontology Architecture

```
Legal Ontology

│

├── Core Concepts

├── Actors

├── Organizations

├── Legal Objects

├── Legal Events

├── Relationships

├── Jurisdictions

├── Legal Authorities

├── Documents

├── Procedures

├── Obligations

├── Rights

└── Metadata
```

---

# Ontology Layers

```
Business Layer

↓

Legal Domain Layer

↓

Semantic Layer

↓

Knowledge Graph

↓

Database

↓

Infrastructure
```

The ontology sits above storage and below business applications.

---

# Core Entity Categories

## Legal Actor

Definition:

A person or organization capable of participating in legal relationships.

Examples:

- Client
- Lawyer
- Judge
- Witness
- Expert
- Government Authority
- Regulator
- Company
- Court Clerk

---

## Organization

Represents legally recognized entities.

Examples:

- Law Firm
- Corporation
- Government
- NGO
- Court
- Arbitration Centre

---

## Matter

Definition:

A legal engagement representing work performed for one or more clients.

Examples:

- Litigation
- Contract Review
- Due Diligence
- Employment Advice
- Arbitration

---

## Court Case

Definition:

A judicial proceeding associated with a Matter.

Attributes:

- Court
- Judge
- Parties
- Hearings
- Orders
- Judgment

---

## Contract

Definition:

A legally enforceable agreement between two or more parties.

Relationships:

- Parties
- Clauses
- Obligations
- Amendments
- Signatures

---

## Document

Definition:

A legal artifact containing structured or unstructured information.

Examples:

- Contract
- Memo
- Affidavit
- Pleading
- Policy
- Legal Opinion

---

## Clause

Definition:

A reusable legal provision within a document.

Examples:

- Confidentiality
- Indemnity
- Termination
- Governing Law
- Force Majeure

---

## Obligation

Definition:

An enforceable duty owed by one legal actor to another.

Attributes:

- Responsible Party
- Due Date
- Trigger Event
- Completion Status

---

## Right

Definition:

A legally recognized entitlement.

Examples:

- Termination Right
- Payment Right
- Renewal Right
- Access Right
- IP Ownership

---

## Legal Authority

Definition:

An authoritative legal source.

Examples:

- Constitution
- Statute
- Regulation
- Case Law
- Administrative Guidance

---

## Evidence

Definition:

Information used to establish facts.

Examples:

- Documents
- Images
- Videos
- Audio
- Emails
- Physical Evidence

---

## Legal Event

Definition:

A legally meaningful occurrence.

Examples:

- Filing
- Hearing
- Signature
- Judgment
- Appeal
- Settlement
- Notice

---

# Canonical Relationships

Examples:

```
Lawyer

REPRESENTS

Client

----------------------

Client

OWNS

Matter

----------------------

Matter

CONTAINS

Document

----------------------

Document

CONTAINS

Clause

----------------------

Clause

CREATES

Obligation

----------------------

Court

ISSUES

Judgment

----------------------

Judgment

INTERPRETS

Statute

----------------------

Contract

BINDS

Parties
```

Relationship names are standardized platform-wide.

---

# Semantic Inheritance

```
Legal Object

↓

Document

↓

Contract

↓

Employment Contract
```

Inheritance enables specialized behavior while preserving common attributes.

---

# Jurisdiction Model

```
Global

↓

Country

↓

State / Province

↓

City

↓

Court

↓

Matter
```

Jurisdiction-specific rules extend, but do not replace, the core ontology.

---

# Practice Area Taxonomy

Top-level categories:

- Corporate
- Commercial
- Employment
- Litigation
- Criminal
- Family
- Tax
- Intellectual Property
- Real Estate
- Banking
- Compliance
- Immigration
- Arbitration
- Data Protection

Sub-specialties may be defined by tenants.

---

# Document Taxonomy

```
Document

├── Contract

├── Pleading

├── Motion

├── Affidavit

├── Court Order

├── Memorandum

├── Policy

├── Invoice

├── Research

└── Correspondence
```

Every document belongs to one canonical category.

---

# Event Taxonomy

Examples:

Matter Created

Matter Closed

Document Uploaded

Document Approved

Contract Executed

Payment Received

Court Filing

Hearing Held

Judgment Issued

Appeal Filed

Workflow Completed

Events drive workflows and analytics.

---

# Obligation Ontology

Every obligation includes:

- Subject
- Responsible Actor
- Beneficiary
- Trigger
- Due Date
- Completion Evidence
- Current Status

This enables structured obligation tracking across contracts and litigation.

---

# Metadata Standards

Each entity stores:

- UUID
- Canonical Type
- Display Name
- Description
- Jurisdiction
- Language
- Effective Date
- Version
- Source
- Tags

Metadata supports interoperability.

---

# AI Semantic Layer

AI agents consume ontology definitions to:

- Understand legal terminology
- Resolve ambiguous terms
- Classify documents
- Infer relationships
- Validate outputs
- Improve retrieval quality

Prompt engineering references ontology terms rather than free-form labels.

---

# Knowledge Graph Alignment

Every ontology entity maps directly to one or more graph node types.

Example:

```
Ontology

Contract

↓

Knowledge Graph Node

Contract

↓

Database

contracts table
```

This ensures semantic consistency across layers.

---

# API Alignment

REST and GraphQL APIs expose ontology-compliant resource names.

Examples:

```
Matter

Contract

CourtCase

LegalAuthority

Evidence

Obligation
```

Avoid duplicate concepts with different names.

---

# Search Alignment

Semantic search indexes ontology metadata.

Searching for:

"Employment Agreement"

also returns:

- Employment Contract
- Offer Letter
- Consultancy Agreement

based on ontology relationships.

---

# Multi-Language Support

The ontology stores:

- Canonical identifier
- English label
- Localized labels
- Synonyms
- Legal abbreviations

Example:

```
Canonical

Employment Contract

↓

Arabic

عقد عمل

↓

French

Contrat de Travail
```

The canonical identifier remains stable.

---

# Versioning

Ontology versions include:

- Added entities
- Deprecated entities
- Renamed concepts
- New relationships
- Breaking changes

AI models reference ontology versions to ensure reproducibility.

---

# Governance

Ontology governance requires:

- Architecture review
- Legal review
- AI compatibility review
- Backward compatibility analysis
- Documentation updates

No ontology change is published without approval.

---

# Security

The ontology itself contains no tenant-specific information.

However, ontology terms influence:

- Authorization
- AI reasoning
- Workflow execution
- Data classification
- Search permissions

---

# Integrations

The ontology integrates with:

- Knowledge Graph
- AI Gateway
- Legal Research Engine
- Document Automation
- Contract Lifecycle Management
- Court Case Management
- Workflow Engine
- Analytics Platform
- API Platform

Every integration uses canonical terminology.

---

# Future Enhancements

- OWL/RDF export
- JSON-LD support
- Industry ontology mappings
- Government legal vocabulary mappings
- AI ontology reasoning
- Automatic ontology evolution
- Cross-jurisdiction semantic alignment
- Open standards interoperability

---

# Success Criteria

The Legal Ontology must:

✓ Define a canonical vocabulary for every legal concept in Barristrly.

✓ Provide a shared semantic foundation for AI, APIs, databases, workflows, analytics, and integrations.

✓ Enable consistent interpretation of legal entities, relationships, and events across jurisdictions.

✓ Support semantic search, explainable AI, and knowledge graph reasoning.

✓ Maintain strict versioning, governance, extensibility, and backward compatibility.

✓ Serve as the authoritative semantic specification for the Barristrly Legal Intelligence Platform.

This document is the authoritative specification for the legal ontology and semantic model across the Barristrly platform.