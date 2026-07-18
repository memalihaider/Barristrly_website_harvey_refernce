# ⚖️ Barristrly Accounting Schema

> Version: 1.0
> Status: Approved
> Owner: Engineering Team
> Depends On:
> - PAYMENT_SCHEMA.md
> - DATABASE_ARCHITECTURE.md
> Last Updated: July 2026

---

# Purpose

The Accounting domain manages the financial ledger and reporting system for Barristrly.

It supports:

- Double-entry bookkeeping
- General Ledger
- Journal Entries
- Chart of Accounts
- Financial Periods
- Accounts Receivable
- Accounts Payable
- Revenue Recognition
- Bank Reconciliation
- Financial Statements
- Audit Trail
- Multi-currency accounting

The Accounting domain is the financial source of truth for reporting, taxation, and compliance.

---

# Domain Overview

```
Payment
    │
    ▼
Journal Entry
    │
    ▼
General Ledger
    │
 ┌──┼─────────────┬──────────────┐
 ▼  ▼             ▼              ▼
AR  AP      Revenue       Cost Centers
 │
 ▼
Financial Statements
```

---

# Core Tables

1. chart_of_accounts
2. accounting_periods
3. journal_entries
4. journal_entry_lines
5. general_ledger
6. accounts_receivable
7. accounts_payable
8. bank_accounts
9. bank_transactions
10. bank_reconciliations
11. cost_centers
12. exchange_rates
13. financial_reports
14. accounting_audit_logs

---

# Table: chart_of_accounts

Purpose

Master list of accounting accounts.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| account_code | TEXT UNIQUE |
| account_name | TEXT |
| account_type | account_type |
| parent_account_id | UUID NULL |
| active | BOOLEAN |
| created_at | TIMESTAMPTZ |

### Examples

Assets

- Cash
- Accounts Receivable
- Bank

Liabilities

- Accounts Payable
- Taxes Payable

Equity

Revenue

Expenses

---

# Table: accounting_periods

Purpose

Financial periods.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| period_name | TEXT |
| start_date | DATE |
| end_date | DATE |
| status | accounting_period_status |
| closed_at | TIMESTAMPTZ NULL |

---

# Table: journal_entries

Purpose

Accounting transaction header.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| journal_number | TEXT UNIQUE |
| transaction_date | DATE |
| description | TEXT |
| source_module | TEXT |
| source_reference_id | UUID |
| accounting_period_id | UUID |
| posted | BOOLEAN |
| posted_at | TIMESTAMPTZ NULL |
| created_by | UUID |
| created_at | TIMESTAMPTZ |

---

# Table: journal_entry_lines

Purpose

Debit and credit lines.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| journal_entry_id | UUID |
| account_id | UUID |
| debit | NUMERIC(14,2) |
| credit | NUMERIC(14,2) |
| currency | TEXT |
| exchange_rate | NUMERIC(18,8) |
| description | TEXT |

Business Rule

Total Debits = Total Credits

---

# Table: general_ledger

Purpose

Ledger balances.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| account_id | UUID |
| journal_line_id | UUID |
| running_balance | NUMERIC(14,2) |
| transaction_date | DATE |
| created_at | TIMESTAMPTZ |

Append-only.

---

# Table: accounts_receivable

Purpose

Outstanding customer balances.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| invoice_id | UUID |
| client_id | UUID |
| amount_due | NUMERIC(14,2) |
| due_date | DATE |
| status | receivable_status |

---

# Table: accounts_payable

Purpose

Outstanding liabilities.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| vendor_name | TEXT |
| invoice_reference | TEXT |
| amount_due | NUMERIC(14,2) |
| due_date | DATE |
| status | payable_status |

---

# Table: bank_accounts

Purpose

Connected financial accounts.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| bank_name | TEXT |
| account_name | TEXT |
| account_number_masked | TEXT |
| currency | TEXT |
| active | BOOLEAN |

Sensitive account details must be encrypted or tokenized where applicable.

---

# Table: bank_transactions

Purpose

Imported banking activity.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| bank_account_id | UUID |
| transaction_date | DATE |
| description | TEXT |
| amount | NUMERIC(14,2) |
| reference | TEXT |
| reconciled | BOOLEAN |

---

# Table: bank_reconciliations

Purpose

Matches ledger entries with bank transactions.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| bank_transaction_id | UUID |
| journal_entry_id | UUID |
| reconciled_by | UUID |
| reconciled_at | TIMESTAMPTZ |

---

# Table: cost_centers

Purpose

Track financial activity by department or business unit.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| code | TEXT |
| name | TEXT |
| active | BOOLEAN |

Examples

- Operations
- Marketing
- Engineering
- Legal
- Customer Success

---

# Table: exchange_rates

Purpose

Currency conversion rates.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| base_currency | TEXT |
| target_currency | TEXT |
| exchange_rate | NUMERIC(18,8) |
| effective_date | DATE |

---

# Table: financial_reports

Purpose

Generated financial statements.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| report_type | financial_report_type |
| period_id | UUID |
| generated_at | TIMESTAMPTZ |
| storage_path | TEXT |

Examples

- Balance Sheet
- Profit & Loss
- Cash Flow
- Trial Balance
- General Ledger Export

---

# Table: accounting_audit_logs

Purpose

Immutable accounting audit trail.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| entity_type | TEXT |
| entity_id | UUID |
| action | TEXT |
| performed_by | UUID |
| metadata | JSONB |
| created_at | TIMESTAMPTZ |

---

# Relationships

```
Payments
    │
    ▼
Journal Entries
    │
    ▼
Journal Entry Lines
    │
    ▼
General Ledger
    │
 ┌──┼───────────────┬──────────────┐
 ▼  ▼               ▼              ▼
AR  AP      Bank Reconciliation  Reports
```

---

# Enumerations

## account_type

- asset
- liability
- equity
- revenue
- expense

---

## accounting_period_status

- open
- closed
- archived

---

## receivable_status

- outstanding
- partially_paid
- paid
- written_off

---

## payable_status

- pending
- approved
- paid
- cancelled

---

## financial_report_type

- balance_sheet
- income_statement
- cash_flow
- trial_balance
- general_ledger

---

# Double-Entry Accounting Rules

Every journal entry must satisfy:

- At least two journal lines.
- Total debits equal total credits.
- Posted entries are immutable.
- Reversals create new journal entries; they never edit posted entries.

---

# Revenue Recognition

Revenue is recognized based on configurable rules.

Examples

- On successful payment.
- After consultation completion.
- Over subscription periods (for recurring services).

Revenue recognition events must be traceable back to source transactions.

---

# Multi-Currency

- Store original transaction currency.
- Store exchange rate used.
- Calculate functional currency values for reporting.
- Preserve historical exchange rates for auditability.

---

# Row-Level Security

- Financial data is restricted to authorized finance roles.
- Lawyers may view only reports relevant to their own practice where permitted.
- Journal entries and ledger records are immutable after posting.
- Audit logs are append-only.

---

# Background Jobs

- Automatic journal posting
- Revenue recognition
- Bank reconciliation
- Exchange rate updates
- Financial report generation
- Period close validation
- Trial balance verification

---

# Integrations

- Payment Gateway
- Banking APIs (future)
- ERP exports
- Tax reporting
- Analytics
- Audit system

---

# Future Enhancements

- Budgeting and forecasting
- Fixed asset management
- Deferred revenue schedules
- Consolidated reporting for multi-office firms
- IFRS/GAAP reporting modes
- AI anomaly detection
- Automated bank feeds
- Financial KPI dashboards

---

# Success Criteria

The Accounting domain must:

✓ Maintain complete financial integrity.

✓ Support enterprise-grade reporting.

✓ Enforce double-entry bookkeeping.

✓ Integrate seamlessly with payments and subscriptions.

✓ Provide immutable audit trails.

✓ Scale from solo practitioners to multinational law firms.

This document is the authoritative specification for Barristrly's accounting and financial reporting system.