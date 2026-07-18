# ⚖️ Barristrly AI Schema

> Version: 1.0
> Status: Approved
> Owner: AI Engineering Team
> Depends On:
> - AUTH_SCHEMA.md
> - CRM_SCHEMA.md
> - MEETING_SCHEMA.md
> - STORAGE_SCHEMA.md
> - DATABASE_ARCHITECTURE.md
> Last Updated: July 2026

---

# Purpose

The AI domain provides a centralized intelligence layer for Barristrly.

It supports:

- AI Agents
- Conversations
- Chat History
- Prompt Management
- Prompt Versioning
- Model Routing
- Context Memory
- RAG
- Embeddings
- Vector Search
- Tool Calling
- AI Workflows
- Cost Tracking
- AI Evaluation
- Human Feedback
- Safety Monitoring

The AI domain is shared by every module across the platform.

---

# Architecture Overview

```
                User
                 │
                 ▼
         AI Gateway Service
                 │
     ┌───────────┼─────────────┐
     ▼           ▼             ▼
Prompt Engine Model Router Context Builder
     │           │             │
     └───────────┼─────────────┘
                 ▼
          LLM Provider Layer
     ┌──────┬────────┬──────────┐
     ▼      ▼        ▼
 Gemini   OpenAI  Anthropic
                 │
                 ▼
         Tool Calling Engine
                 │
     ┌───────────┼──────────────┐
     ▼           ▼              ▼
 CRM        Meetings       Documents
                 │
                 ▼
         Memory + Vector DB
```

---

# Core Tables

1. ai_agents
2. ai_conversations
3. ai_messages
4. ai_prompts
5. ai_prompt_versions
6. ai_models
7. ai_model_routes
8. ai_memories
9. ai_embeddings
10. ai_documents
11. ai_tool_calls
12. ai_workflows
13. ai_evaluations
14. ai_feedback
15. ai_usage_logs
16. ai_cost_tracking
17. ai_safety_logs

---

# Table: ai_agents

Purpose

Defines every specialized AI agent available within Barristrly.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| name | TEXT |
| code | TEXT UNIQUE |
| description | TEXT |
| default_model_id | UUID |
| system_prompt_version_id | UUID |
| active | BOOLEAN |
| created_at | TIMESTAMPTZ |

### Examples

- Legal Assistant
- Intake Agent
- Research Agent
- CRM Assistant
- Scheduling Agent
- Billing Assistant
- Meeting Assistant
- Compliance Agent

---

# Table: ai_conversations

Purpose

Conversation sessions between users and AI.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| profile_id | UUID |
| agent_id | UUID |
| title | TEXT |
| context_type | TEXT |
| context_reference_id | UUID NULL |
| status | conversation_status |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

---

# Table: ai_messages

Purpose

Stores every message exchanged.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| conversation_id | UUID |
| role | ai_role |
| content | TEXT |
| model_id | UUID |
| input_tokens | INTEGER |
| output_tokens | INTEGER |
| latency_ms | INTEGER |
| created_at | TIMESTAMPTZ |

---

# Table: ai_prompts

Purpose

Logical prompt definitions.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| code | TEXT UNIQUE |
| name | TEXT |
| description | TEXT |
| active_version_id | UUID |
| created_at | TIMESTAMPTZ |

---

# Table: ai_prompt_versions

Purpose

Version-controlled prompts.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| prompt_id | UUID |
| version | INTEGER |
| system_prompt | TEXT |
| developer_prompt | TEXT |
| change_notes | TEXT |
| published_at | TIMESTAMPTZ |

Prompt versions are immutable once published.

---

# Table: ai_models

Purpose

Available AI models.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| provider | ai_provider |
| model_name | TEXT |
| supports_tools | BOOLEAN |
| supports_vision | BOOLEAN |
| supports_streaming | BOOLEAN |
| context_window | INTEGER |
| active | BOOLEAN |

Examples

- Gemini 2.5 Flash
- Gemini 2.5 Pro
- GPT-5
- Claude Sonnet
- Llama 3

---

# Table: ai_model_routes

Purpose

Dynamic routing rules.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| agent_id | UUID |
| task_type | TEXT |
| preferred_model_id | UUID |
| fallback_model_id | UUID |
| priority | INTEGER |

Example

```
Research → Gemini Pro

Meeting Summary → Gemini Flash

OCR → GPT-5

Fallback → Claude
```

---

# Table: ai_memories

Purpose

Persistent AI memory.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| profile_id | UUID |
| memory_type | TEXT |
| summary | TEXT |
| importance_score | NUMERIC(5,2) |
| last_accessed_at | TIMESTAMPTZ |
| created_at | TIMESTAMPTZ |

Examples

- Preferred language
- Favorite lawyer
- Communication style
- Frequently used legal services

---

# Table: ai_embeddings

Purpose

Vector representations.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| source_type | TEXT |
| source_id | UUID |
| embedding_model | TEXT |
| vector_dimension | INTEGER |
| embedding | VECTOR |
| indexed_at | TIMESTAMPTZ |

---

# Table: ai_documents

Purpose

Knowledge base documents used for RAG.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| source_type | TEXT |
| source_reference_id | UUID |
| title | TEXT |
| content | TEXT |
| storage_path | TEXT |
| indexed | BOOLEAN |
| indexed_at | TIMESTAMPTZ |

---

# Table: ai_tool_calls

Purpose

Records AI tool execution.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| message_id | UUID |
| tool_name | TEXT |
| input | JSONB |
| output | JSONB |
| execution_time_ms | INTEGER |
| status | tool_call_status |

---

# Table: ai_workflows

Purpose

Multi-step AI automations.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| name | TEXT |
| description | TEXT |
| trigger_event | TEXT |
| workflow_definition | JSONB |
| active | BOOLEAN |

Examples

- Intake Analysis
- Contract Review
- Meeting Summary
- Invoice Explanation

---

# Table: ai_evaluations

Purpose

Automated quality evaluation.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| message_id | UUID |
| accuracy_score | NUMERIC(5,2) |
| relevance_score | NUMERIC(5,2) |
| safety_score | NUMERIC(5,2) |
| evaluator_model | TEXT |
| evaluated_at | TIMESTAMPTZ |

---

# Table: ai_feedback

Purpose

Human feedback.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| message_id | UUID |
| profile_id | UUID |
| rating | INTEGER |
| comments | TEXT |
| created_at | TIMESTAMPTZ |

---

# Table: ai_usage_logs

Purpose

Operational usage records.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| conversation_id | UUID |
| model_id | UUID |
| request_tokens | INTEGER |
| response_tokens | INTEGER |
| execution_time_ms | INTEGER |
| estimated_cost | NUMERIC(12,6) |
| created_at | TIMESTAMPTZ |

---

# Table: ai_cost_tracking

Purpose

Aggregated AI costs.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| organization_id | UUID |
| billing_period | DATE |
| provider | TEXT |
| total_requests | INTEGER |
| total_tokens | BIGINT |
| total_cost | NUMERIC(12,4) |
| updated_at | TIMESTAMPTZ |

---

# Table: ai_safety_logs

Purpose

Safety and compliance monitoring.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| message_id | UUID |
| violation_type | TEXT |
| severity | safety_severity |
| detected_by | TEXT |
| action_taken | TEXT |
| created_at | TIMESTAMPTZ |

---

# Relationships

```
Agents
   │
   ▼
Conversations
   │
   ▼
Messages
 ┌──────┼─────────────┬──────────────┬──────────────┐
 ▼      ▼             ▼              ▼
Prompts Models     Tool Calls   Evaluations
          │
          ▼
Usage Logs
          │
          ▼
Cost Tracking

Documents
     │
     ▼
Embeddings
     │
     ▼
RAG Search

Messages
     │
     ▼
Feedback
     │
     ▼
Safety Logs
```

---

# Enumerations

## ai_provider

- google
- openai
- anthropic
- mistral
- meta
- local

---

## ai_role

- system
- developer
- user
- assistant
- tool

---

## conversation_status

- active
- archived
- deleted

---

## tool_call_status

- pending
- running
- completed
- failed

---

## safety_severity

- low
- medium
- high
- critical

---

# Model Routing Strategy

| Task | Preferred Model | Fallback |
|------|-----------------|----------|
| Chat | Gemini Flash | GPT-5 |
| Research | Gemini Pro | Claude |
| Document Analysis | Gemini Pro | GPT-5 |
| OCR | GPT-5 | Gemini Pro |
| Summarization | Gemini Flash | Claude |
| Translation | Gemini Flash | GPT-5 |
| Meeting Summary | Gemini Flash | GPT-5 |

---

# RAG Workflow

```
Question
    │
    ▼
Embedding Generation
    │
    ▼
Vector Search
    │
    ▼
Top Relevant Chunks
    │
    ▼
Context Builder
    │
    ▼
Prompt Assembly
    │
    ▼
LLM Response
```

---

# Business Rules

- Every conversation belongs to one AI agent.
- Published prompt versions are immutable.
- Model routing supports automatic failover.
- Tool calls are fully audited.
- Embeddings are regenerated when source content changes.
- AI costs are attributable to organizations.
- Safety violations are logged and reviewable.

---

# Row-Level Security

- Users can access only their own conversations and memories.
- Organizations can view AI usage analytics for their workspace.
- Platform AI administrators manage models, prompts, and routing.
- Safety logs are restricted to authorized personnel.

---

# Background Jobs

- Embedding generation
- Vector indexing
- Prompt cache refresh
- Model health monitoring
- Cost aggregation
- AI evaluation runs
- Memory summarization
- Conversation archival

---

# Integrations

- CRM
- Meetings
- Bookings
- Documents
- Notifications
- Analytics
- Subscription quotas
- Payment cost allocation

---

# Future Enhancements

- Multi-agent collaboration
- Long-term semantic memory
- Autonomous workflow execution
- Fine-tuned legal models
- Voice agents
- Real-time multilingual conversations
- Agent marketplace
- AI governance dashboard
- Hallucination detection and citation scoring

---

# Success Criteria

The AI domain must:

✓ Provide a centralized AI platform for every Barristrly module.

✓ Support multiple AI providers with intelligent routing.

✓ Enable Retrieval-Augmented Generation (RAG) using embeddings and vector search.

✓ Track AI quality, cost, and safety.

✓ Scale from simple chat assistance to autonomous legal workflows.

✓ Deliver enterprise-grade governance, observability, and auditability.

This document is the authoritative specification for Barristrly's AI platform and intelligence layer.