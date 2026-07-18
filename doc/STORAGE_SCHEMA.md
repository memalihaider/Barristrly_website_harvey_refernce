# ⚖️ Barristrly Storage Schema

> Version: 1.0
> Status: Approved
> Owner: Platform Infrastructure Team
> Depends On:
> - AUTH_SCHEMA.md
> - USER_SCHEMA.md
> - AI_SCHEMA.md
> - DATABASE_ARCHITECTURE.md
> Last Updated: July 2026

---

# Purpose

The Storage domain manages all digital assets across Barristrly.

It supports:

- Secure file storage
- Folder hierarchy
- Document versioning
- Metadata management
- Access control
- Secure uploads
- Signed URLs
- File sharing
- OCR indexing
- AI document indexing
- Virus scanning
- Lifecycle policies
- Legal evidence storage
- Archive management

The Storage domain provides secure, scalable, and compliant document management for the entire platform.

---

# Architecture Overview

```
User Upload
      │
      ▼
Upload Service
      │
      ▼
Storage Bucket
      │
 ┌────┼──────────────┬───────────────┐
 ▼    ▼              ▼               ▼
Metadata Versions    AI Index     Virus Scan
 │
 ▼
Access Control
 │
 ▼
Signed URL
 │
 ▼
Download
```

---

# Storage Buckets

Logical buckets may include:

- avatars
- identity-documents
- legal-documents
- evidence
- contracts
- invoices
- receipts
- recordings
- transcripts
- ai-generated
- organization-assets
- exports
- temporary-uploads

Buckets define retention rules, encryption policies, and access behavior.

---

# Core Tables

1. storage_buckets
2. storage_folders
3. storage_files
4. storage_file_versions
5. storage_metadata
6. storage_permissions
7. storage_signed_urls
8. storage_shares
9. storage_processing_jobs
10. storage_ai_indexes
11. storage_retention_policies
12. storage_archives
13. storage_audit_logs

---

# Table: storage_buckets

Purpose

Logical storage containers.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| bucket_name | TEXT UNIQUE |
| description | TEXT |
| visibility | bucket_visibility |
| encrypted | BOOLEAN |
| versioning_enabled | BOOLEAN |
| created_at | TIMESTAMPTZ |

---

# Table: storage_folders

Purpose

Virtual folder hierarchy.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| bucket_id | UUID |
| parent_folder_id | UUID NULL |
| organization_id | UUID NULL |
| name | TEXT |
| path | TEXT |
| created_by | UUID |
| created_at | TIMESTAMPTZ |

Folders are logical; physical storage remains object-based.

---

# Table: storage_files

Purpose

Primary file records.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| bucket_id | UUID |
| folder_id | UUID NULL |
| owner_profile_id | UUID |
| organization_id | UUID NULL |
| original_filename | TEXT |
| stored_filename | TEXT |
| mime_type | TEXT |
| file_extension | TEXT |
| file_size_bytes | BIGINT |
| checksum_sha256 | TEXT |
| storage_path | TEXT |
| status | file_status |
| uploaded_at | TIMESTAMPTZ |

---

# Table: storage_file_versions

Purpose

Document version history.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| file_id | UUID |
| version_number | INTEGER |
| storage_path | TEXT |
| checksum_sha256 | TEXT |
| created_by | UUID |
| created_at | TIMESTAMPTZ |

Versions are immutable.

---

# Table: storage_metadata

Purpose

Extensible metadata.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| file_id | UUID |
| metadata | JSONB |
| indexed | BOOLEAN |
| updated_at | TIMESTAMPTZ |

Examples

- Matter ID
- Client ID
- Lawyer ID
- OCR Status
- Language
- Tags

---

# Table: storage_permissions

Purpose

Fine-grained access control.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| file_id | UUID |
| profile_id | UUID NULL |
| organization_role | TEXT NULL |
| permission | storage_permission |
| granted_by | UUID |
| granted_at | TIMESTAMPTZ |

---

# Table: storage_signed_urls

Purpose

Temporary secure access.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| file_id | UUID |
| token | TEXT UNIQUE |
| expires_at | TIMESTAMPTZ |
| max_downloads | INTEGER NULL |
| download_count | INTEGER |
| created_by | UUID |

Signed URLs should expire automatically.

---

# Table: storage_shares

Purpose

Document sharing.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| file_id | UUID |
| shared_with_profile_id | UUID NULL |
| shared_email | TEXT NULL |
| access_level | share_access |
| expires_at | TIMESTAMPTZ NULL |
| created_at | TIMESTAMPTZ |

---

# Table: storage_processing_jobs

Purpose

Background processing.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| file_id | UUID |
| job_type | processing_job |
| status | processing_status |
| worker | TEXT |
| result | JSONB |
| started_at | TIMESTAMPTZ |
| completed_at | TIMESTAMPTZ |

Examples

- OCR
- Virus Scan
- Thumbnail Generation
- Audio Transcription
- AI Embedding
- PDF Preview

---

# Table: storage_ai_indexes

Purpose

Links files to AI knowledge.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| file_id | UUID |
| embedding_id | UUID |
| indexed_at | TIMESTAMPTZ |
| chunk_count | INTEGER |

---

# Table: storage_retention_policies

Purpose

Lifecycle management.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| bucket_id | UUID |
| retention_days | INTEGER |
| archive_after_days | INTEGER |
| delete_after_days | INTEGER NULL |
| legal_hold_supported | BOOLEAN |

---

# Table: storage_archives

Purpose

Archived documents.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| file_id | UUID |
| archived_at | TIMESTAMPTZ |
| archive_reason | TEXT |
| restored_at | TIMESTAMPTZ NULL |

---

# Table: storage_audit_logs

Purpose

Immutable audit trail.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| file_id | UUID |
| action | storage_action |
| performed_by | UUID |
| ip_address | INET |
| metadata | JSONB |
| created_at | TIMESTAMPTZ |

Examples

- Uploaded
- Downloaded
- Shared
- Deleted
- Archived
- Restored
- Version Created

---

# Relationships

```
Buckets
   │
   ▼
Folders
   │
   ▼
Files
 ┌──────┼────────────┬──────────────┬───────────────┐
 ▼      ▼            ▼              ▼
Versions Metadata Permissions Processing Jobs
 │                                   │
 ▼                                   ▼
Signed URLs                      AI Indexes
 │
 ▼
Audit Logs
```

---

# Enumerations

## bucket_visibility

- private
- organization
- public

---

## file_status

- uploading
- processing
- available
- archived
- deleted
- quarantined

---

## storage_permission

- read
- write
- delete
- share
- manage

---

## share_access

- view
- comment
- edit
- download

---

## processing_job

- virus_scan
- ocr
- thumbnail
- transcription
- embedding
- preview
- compression

---

## processing_status

- queued
- running
- completed
- failed

---

## storage_action

- upload
- download
- update
- version_created
- share
- archive
- restore
- delete

---

# Security Requirements

- AES-256 encryption at rest.
- TLS 1.3 encryption in transit.
- SHA-256 checksum verification.
- Immutable version history.
- Optional customer-managed encryption keys (future).
- Malware scanning before file availability.
- Signed URLs for temporary external access.

---

# Business Rules

- Files are immutable after upload; modifications create new versions.
- Every upload must complete virus scanning before becoming available.
- Deleted files follow retention policies unless under legal hold.
- Signed URLs automatically expire.
- AI indexing occurs only after successful processing.
- Every access event is audited.

---

# Row-Level Security

- Users access only files they own or have been granted permission to.
- Organization administrators manage organization-owned files.
- Legal holds override deletion requests.
- Audit logs are append-only and cannot be modified.

---

# Background Jobs

- Virus scanning
- OCR extraction
- Audio transcription
- PDF preview generation
- Thumbnail generation
- AI embedding creation
- Retention policy enforcement
- Archive migration
- Storage integrity verification

---

# Integrations

- AI (Embeddings & RAG)
- CRM (Case documents)
- Meetings (Recordings & transcripts)
- Identity (Verification documents)
- Payments (Invoices & receipts)
- Notifications (Shared file alerts)
- Analytics (Storage usage metrics)

---

# Future Enhancements

- Digital signatures
- Immutable evidence vault
- Blockchain-backed document verification
- Data Loss Prevention (DLP)
- Watermarking
- eDiscovery support
- Full-text legal search
- Regional data residency
- Multi-cloud object replication

---

# Success Criteria

The Storage domain must:

✓ Securely store all platform documents and digital assets.

✓ Support immutable versioning and complete auditability.

✓ Enforce fine-grained access control.

✓ Integrate seamlessly with AI for indexing and Retrieval-Augmented Generation (RAG).

✓ Comply with enterprise legal retention and security requirements.

✓ Scale to billions of files while maintaining high availability and performance.

This document is the authoritative specification for file storage, document management, and digital asset lifecycle within Barristrly.