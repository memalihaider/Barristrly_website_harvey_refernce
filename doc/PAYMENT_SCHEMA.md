# ⚖️ Barristrly Payment Schema

> Version: 1.0
> Status: Approved
> Owner: Engineering Team
> Depends On:
> - BOOKING_SCHEMA.md
> - MEETING_SCHEMA.md
> - CRM_SCHEMA.md
> - DATABASE_ARCHITECTURE.md
> Last Updated: July 2026

---

# Purpose

The Payment domain manages all financial transactions within Barristrly.

It supports:

- Consultation payments
- Invoice generation
- Payment processing
- Refunds
- Lawyer payouts
- Wallet balances
- Promotional discounts
- Taxes
- Receipts
- Multi-currency transactions

The Payment domain records **money movement**, while the Accounting domain records **financial reporting and ledgers**.

---

# Domain Overview

```
Booking
    │
    ▼
Invoice
    │
    ▼
Payment Intent
    │
    ▼
Transaction
 ┌──┼──────────────┐
 ▼  ▼              ▼
Receipt Refund   Payout
 │
 ▼
Accounting
```

---

# Core Tables

1. invoices
2. invoice_items
3. payment_intents
4. payment_transactions
5. payment_methods
6. refunds
7. payouts
8. wallets
9. wallet_transactions
10. promo_codes
11. invoice_discounts
12. taxes
13. receipts

---

# Table: invoices

Purpose

Primary billing document.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| invoice_number | TEXT UNIQUE |
| client_id | UUID |
| lawyer_id | UUID |
| booking_id | UUID NULL |
| currency | TEXT |
| subtotal | NUMERIC(12,2) |
| tax_amount | NUMERIC(12,2) |
| discount_amount | NUMERIC(12,2) |
| total_amount | NUMERIC(12,2) |
| status | invoice_status |
| due_date | DATE |
| paid_at | TIMESTAMPTZ NULL |
| created_at | TIMESTAMPTZ |

---

# Table: invoice_items

Purpose

Line items.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| invoice_id | UUID |
| description | TEXT |
| quantity | NUMERIC(10,2) |
| unit_price | NUMERIC(12,2) |
| tax_rate | NUMERIC(5,2) |
| line_total | NUMERIC(12,2) |

---

# Table: payment_intents

Purpose

Gateway payment request.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| invoice_id | UUID |
| gateway | payment_gateway |
| gateway_reference | TEXT |
| amount | NUMERIC(12,2) |
| currency | TEXT |
| status | payment_intent_status |
| expires_at | TIMESTAMPTZ |
| created_at | TIMESTAMPTZ |

One invoice may have multiple payment attempts.

---

# Table: payment_transactions

Purpose

Successful or failed payment attempts.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| payment_intent_id | UUID |
| gateway_transaction_id | TEXT |
| amount | NUMERIC(12,2) |
| currency | TEXT |
| gateway_fee | NUMERIC(12,2) |
| platform_fee | NUMERIC(12,2) |
| net_amount | NUMERIC(12,2) |
| status | transaction_status |
| processed_at | TIMESTAMPTZ |

Append-only.

---

# Table: payment_methods

Purpose

Saved payment methods.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| profile_id | UUID |
| provider | TEXT |
| provider_token | TEXT |
| card_brand | TEXT |
| last_four | TEXT |
| expiry_month | SMALLINT |
| expiry_year | SMALLINT |
| is_default | BOOLEAN |
| created_at | TIMESTAMPTZ |

Sensitive payment data must never be stored directly.

---

# Table: refunds

Purpose

Refund processing.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| transaction_id | UUID |
| amount | NUMERIC(12,2) |
| reason | TEXT |
| status | refund_status |
| processed_at | TIMESTAMPTZ |

---

# Table: payouts

Purpose

Lawyer earnings.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| lawyer_id | UUID |
| transaction_id | UUID |
| gross_amount | NUMERIC(12,2) |
| platform_fee | NUMERIC(12,2) |
| tax_withheld | NUMERIC(12,2) |
| net_amount | NUMERIC(12,2) |
| payout_status | payout_status |
| payout_date | TIMESTAMPTZ |

---

# Table: wallets

Purpose

Platform wallet.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| profile_id | UUID |
| currency | TEXT |
| balance | NUMERIC(12,2) |
| updated_at | TIMESTAMPTZ |

---

# Table: wallet_transactions

Purpose

Wallet ledger.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| wallet_id | UUID |
| transaction_type | wallet_transaction_type |
| amount | NUMERIC(12,2) |
| balance_after | NUMERIC(12,2) |
| reference_type | TEXT |
| reference_id | UUID |
| created_at | TIMESTAMPTZ |

Append-only.

---

# Table: promo_codes

Purpose

Discount campaigns.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| code | TEXT UNIQUE |
| discount_type | discount_type |
| value | NUMERIC(12,2) |
| usage_limit | INTEGER |
| usage_count | INTEGER |
| valid_from | DATE |
| valid_until | DATE |
| active | BOOLEAN |

---

# Table: invoice_discounts

Purpose

Applied discounts.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| invoice_id | UUID |
| promo_code_id | UUID |
| discount_amount | NUMERIC(12,2) |

---

# Table: taxes

Purpose

Tax configuration.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| country | TEXT |
| tax_name | TEXT |
| rate | NUMERIC(5,2) |
| active | BOOLEAN |

---

# Table: receipts

Purpose

Payment confirmation.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| transaction_id | UUID |
| receipt_number | TEXT UNIQUE |
| pdf_path | TEXT |
| issued_at | TIMESTAMPTZ |

---

# Relationships

```
Bookings
    │
    ▼
Invoices
    │
 ┌──┼─────────────┐
 ▼  ▼             ▼
Items Payment Intent Discounts
        │
        ▼
Transactions
 ┌──────┼───────────────┐
 ▼      ▼               ▼
Receipt Refund       Payout
        │
        ▼
Wallet Transactions
```

---

# Enumerations

## invoice_status

- draft
- issued
- partially_paid
- paid
- overdue
- cancelled

---

## payment_gateway

- stripe
- paypal
- adyen
- bank_transfer
- wallet

---

## payment_intent_status

- pending
- requires_action
- succeeded
- failed
- cancelled
- expired

---

## transaction_status

- pending
- processing
- completed
- failed
- reversed

---

## refund_status

- pending
- approved
- processed
- rejected

---

## payout_status

- pending
- processing
- paid
- failed

---

## wallet_transaction_type

- credit
- debit
- adjustment

---

## discount_type

- percentage
- fixed_amount

---

# Business Rules

- Every paid invoice must have at least one successful transaction.
- Transactions are immutable after completion.
- Refunds may not exceed the original transaction amount.
- Wallet balances are derived from wallet transactions.
- Promo codes respect validity dates and usage limits.
- Payouts are generated only after successful payment settlement.

---

# Row-Level Security

Clients

- View only their invoices, receipts, refunds, and payment methods.

Lawyers

- View invoices and payouts related to their services.

Administrators

- Full financial access with audit logging.

Wallets

- Owners may view their own wallets.
- Direct balance updates are prohibited.

---

# Background Jobs

- Payment webhook processing
- Invoice generation
- Receipt generation
- Payout scheduling
- Wallet reconciliation
- Failed payment retries
- Refund synchronization
- Currency exchange rate updates (if enabled)

---

# Integrations

Payment Providers

- Stripe (Primary)
- PayPal
- Adyen
- Bank Transfer

Notifications

- Email receipts
- Payment reminders
- Refund notifications
- Payout confirmations

Accounting

- General Ledger
- Revenue Recognition
- Tax Reporting

---

# Future Enhancements

- Escrow accounts
- Installment payments
- Subscription billing integration
- Multi-currency settlement
- Regional tax engines
- Apple Pay / Google Pay
- Cryptocurrency support (optional)
- Fraud detection
- AI payment risk scoring

---

# Success Criteria

The Payment domain must:

✓ Process payments securely.

✓ Maintain immutable financial records.

✓ Support multiple payment providers.

✓ Integrate with bookings, meetings, subscriptions, and accounting.

✓ Enable accurate lawyer payouts and client refunds.

✓ Meet enterprise-grade audit and compliance requirements.

This document is the authoritative specification for all payment processing and financial transaction workflows within Barristrly.