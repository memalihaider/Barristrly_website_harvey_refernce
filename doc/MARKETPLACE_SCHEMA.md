# ⚖️ Barristrly Marketplace Schema

> Version: 1.0
> Status: Approved
> Owner: Engineering Team
> Depends On:
> - USER_SCHEMA.md
> - AUTH_SCHEMA.md
> - DATABASE_ARCHITECTURE.md
> Last Updated: July 2026

---

# Purpose

The Marketplace domain powers the public lawyer marketplace.

It enables users to:

- Search lawyers
- Browse legal services
- Filter professionals
- View profiles
- Compare lawyers
- Read reviews
- Save favorites
- Receive AI recommendations

---

# Domain Overview

```
Lawyers
    │
    ├──────────────┐
    ▼              ▼
Practice Areas   Legal Services
    │              │
    ▼              ▼
Listings      Service Pricing
    │              │
    ├──────┐       │
    ▼      ▼       ▼
Reviews Favorites Availability
      │
      ▼
AI Recommendation Engine
```

---

# Core Tables

1. practice_areas
2. legal_services
3. lawyer_services
4. lawyer_listings
5. listing_media
6. lawyer_reviews
7. review_replies
8. lawyer_favorites
9. lawyer_badges
10. featured_listings
11. lawyer_statistics

---

# Table: practice_areas

Purpose

Master list of legal practice areas.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| name | TEXT |
| slug | TEXT UNIQUE |
| icon | TEXT |
| description | TEXT |
| seo_title | TEXT |
| seo_description | TEXT |
| created_at | TIMESTAMPTZ |

### Examples

- Family Law
- Criminal Law
- Corporate Law
- Civil Litigation
- Tax Law
- Employment Law
- Immigration Law
- Intellectual Property
- Real Estate Law

---

# Table: legal_services

Purpose

Defines standardized consultation services.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| practice_area_id | UUID |
| name | TEXT |
| slug | TEXT |
| description | TEXT |
| default_duration | INTEGER |
| active | BOOLEAN |

Examples

- Initial Consultation
- Contract Review
- Legal Notice
- Case Evaluation
- Court Representation
- Arbitration
- Mediation

---

# Table: lawyer_services

Purpose

Connects lawyers to offered services.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| lawyer_id | UUID |
| service_id | UUID |
| custom_price | NUMERIC(10,2) |
| currency | TEXT |
| duration_minutes | INTEGER |
| online_available | BOOLEAN |
| office_available | BOOLEAN |

---

# Table: lawyer_listings

Purpose

Public marketplace profile.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| lawyer_id | UUID |
| headline | TEXT |
| short_bio | TEXT |
| profile_url | TEXT UNIQUE |
| seo_title | TEXT |
| seo_description | TEXT |
| featured | BOOLEAN |
| visibility | BOOLEAN |
| profile_views | INTEGER |
| consultation_count | INTEGER |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

---

# Table: listing_media

Purpose

Stores public profile media.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| listing_id | UUID |
| media_type | TEXT |
| storage_path | TEXT |
| display_order | INTEGER |

Supported media:

- Profile Photo
- Cover Image
- Certificates
- Videos

---

# Table: lawyer_reviews

Purpose

Verified client reviews.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| lawyer_id | UUID |
| client_id | UUID |
| meeting_id | UUID |
| rating | SMALLINT |
| title | TEXT |
| review | TEXT |
| verified | BOOLEAN |
| published | BOOLEAN |
| helpful_votes | INTEGER |
| created_at | TIMESTAMPTZ |

Rules

- Rating: 1–5
- Only completed meetings may create reviews.
- One review per meeting.

---

# Table: review_replies

Purpose

Lawyer responses to reviews.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| review_id | UUID |
| lawyer_id | UUID |
| reply | TEXT |
| created_at | TIMESTAMPTZ |

Only one reply per review.

---

# Table: lawyer_favorites

Purpose

Stores saved lawyers.

### Columns

| Column | Type |
|---------|------|
| client_id | UUID |
| lawyer_id | UUID |
| created_at | TIMESTAMPTZ |

Composite Unique

```
(client_id, lawyer_id)
```

---

# Table: lawyer_badges

Purpose

Marketplace achievements.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| lawyer_id | UUID |
| badge | TEXT |
| awarded_at | TIMESTAMPTZ |
| expires_at | TIMESTAMPTZ NULL |

Examples

- Top Rated
- Verified Expert
- Fast Responder
- Rising Lawyer
- AI Recommended
- Premium Member

---

# Table: featured_listings

Purpose

Homepage promotions.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| lawyer_id | UUID |
| start_date | DATE |
| end_date | DATE |
| priority | INTEGER |

---

# Table: lawyer_statistics

Purpose

Precomputed analytics.

### Columns

| Column | Type |
|---------|------|
| lawyer_id | UUID |
| average_rating | NUMERIC(3,2) |
| total_reviews | INTEGER |
| total_clients | INTEGER |
| completed_consultations | INTEGER |
| profile_views | INTEGER |
| response_rate | NUMERIC(5,2) |
| response_time_minutes | INTEGER |
| recommendation_score | NUMERIC(5,2) |
| updated_at | TIMESTAMPTZ |

Maintained through background jobs.

---

# Relationships

```
Practice Areas
        │
        ▼
Legal Services
        │
        ▼
Lawyer Services
        │
        ▼
Lawyers
        │
 ┌──────┼───────────────┐
 ▼      ▼               ▼
Listings Reviews Favorites
 │        │
 ▼        ▼
Media   Replies

Lawyers
   │
   ▼
Statistics

Lawyers
   │
   ▼
Badges

Lawyers
   │
   ▼
Featured Listings
```

---

# Search Filters

Supported filters include:

- Practice Area
- Service
- Country
- City
- Language
- Years of Experience
- Rating
- Price Range
- Consultation Type
- Availability
- Verified Only
- Featured Only
- Online Now

---

# Marketplace Ranking

Ranking score considers:

- AI recommendation score
- Verification status
- Average rating
- Number of reviews
- Recent activity
- Response rate
- Profile completeness
- Premium placement
- Featured status

Ranking weights should remain configurable.

---

# AI Recommendation Inputs

The AI matching engine may consider:

- Legal issue category
- Practice area
- Language
- Budget
- Jurisdiction
- Lawyer expertise
- Consultation history
- Client preferences
- Lawyer availability
- Review quality
- Response performance

The recommendation engine should explain why a lawyer was suggested.

---

# Row-Level Security

## Listings

Public:

- Read published listings.

Lawyers:

- Edit only their own listing.

Admins:

- Full access.

---

## Reviews

Clients:

- Create only after completed consultations.
- Edit within configured review window.

Lawyers:

- Cannot modify reviews.
- May add a single reply.

Admins:

- Moderate and hide inappropriate reviews.

---

## Favorites

Clients:

- Read and manage only their own favorites.

Admins:

- Read-only for support purposes.

---

# Business Rules

- Only verified lawyers may publish listings.
- Hidden profiles do not appear in search.
- Featured listings require an active promotion.
- Review averages update asynchronously.
- Duplicate favorites are not permitted.
- Reviews remain linked to completed consultations for verification.

---

# Future Enhancements

- AI-generated lawyer summaries
- Video introductions
- Awards and certifications showcase
- Case study portfolios
- Success rate metrics
- Knowledge articles
- Multilingual SEO pages
- Personalized recommendation feeds
- Sponsored listings with disclosure labels

---

# Success Criteria

The Marketplace domain must:

✓ Provide a rich public lawyer directory.

✓ Support advanced search and filtering.

✓ Deliver trustworthy reviews and ratings.

✓ Power AI-driven lawyer recommendations.

✓ Scale to large numbers of lawyers and listings.

✓ Optimize public profiles for search engines while respecting privacy and platform policies.

This schema is the authoritative reference for the Barristrly lawyer marketplace.