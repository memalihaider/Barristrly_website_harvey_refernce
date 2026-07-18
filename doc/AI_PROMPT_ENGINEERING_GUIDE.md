# ⚖️ Barristrly AI Prompt Engineering Guide

> Version: 1.0
> Status: Approved
> Owner: AI Platform Engineering
> Depends On:
> - AI_ARCHITECTURE.md
> - AI_AGENTS_SPECIFICATION.md
> - SECURITY_ARCHITECTURE.md
> - OBSERVABILITY_ARCHITECTURE.md
> Last Updated: July 2026

---

# Purpose

This document defines how prompts are designed, managed, tested, secured, versioned, and deployed across the Barristrly Legal Intelligence Platform.

Prompts are considered production software assets.

They must be:

- Version controlled
- Testable
- Reviewable
- Observable
- Secure
- Reusable

No production prompt should exist directly inside application code.

---

# Prompt Philosophy

Every prompt should:

✓ Produce predictable outputs

✓ Minimize hallucinations

✓ Be reusable

✓ Support multiple AI providers

✓ Be easy to update

✓ Remain legally appropriate

---

# Prompt Architecture

Every request is composed dynamically.

```
System Instructions

↓

Platform Rules

↓

Agent Instructions

↓

Organization Context

↓

Matter Context

↓

Retrieved Knowledge

↓

User Request

↓

Output Schema

↓

LLM
```

Every layer has a clear responsibility.

---

# Prompt Layers

## Layer 1

System Prompt

Defines:

- AI identity
- Global rules
- Safety
- Behavior
- Tone

Never contains business-specific logic.

---

## Layer 2

Platform Rules

Examples:

- Never invent facts
- Prefer retrieved evidence
- Preserve confidentiality
- Explain uncertainty
- Cite supporting material where available

Shared by every AI agent.

---

## Layer 3

Agent Prompt

Defines:

- Responsibilities
- Available tools
- Decision boundaries
- Reasoning style
- Output expectations

Each agent has its own prompt.

---

## Layer 4

Organization Context

Includes:

- Firm preferences
- Templates
- Branding
- Policies
- Jurisdiction defaults

Injected dynamically.

---

## Layer 5

Matter Context

Examples:

- Matter summary
- Parties
- Timeline
- Documents
- Meeting history
- Tasks

Only authorized context is included.

---

## Layer 6

Retrieved Knowledge

From RAG.

Examples:

- Contracts
- Policies
- Previous documents
- Internal guidance
- Legal references

Knowledge is ranked before inclusion.

---

## Layer 7

User Prompt

Actual user request.

Example

```
Summarize this agreement.

Highlight termination risks.
```

---

## Layer 8

Output Schema

Defines expected response.

Examples

- Markdown
- JSON
- Table
- Timeline
- Structured object

Avoid free-form responses when structured outputs are more reliable.

---

# Prompt Repository

Prompts should live in a dedicated repository.

Example

```
prompts/

system/

agents/

shared/

tools/

output/

evaluations/

versions/
```

Never hardcode prompts in application logic.

---

# Prompt Naming

Example

```
contract_review_v3

client_intake_v5

meeting_summary_v2

billing_assistant_v4
```

Names should be stable and descriptive.

---

# Prompt Variables

Allowed variables include:

```
{{organization}}

{{matter}}

{{jurisdiction}}

{{language}}

{{documents}}

{{client}}

{{today}}

{{user_role}}

{{ai_capabilities}}
```

Variables should be validated before rendering.

---

# Prompt Templates

Templates should support:

- Conditional sections
- Reusable fragments
- Localization
- Provider-specific adjustments

Keep templates modular to reduce duplication.

---

# Output Contracts

Every prompt should define its expected output.

Example:

```json
{
  "summary": "",
  "key_risks": [],
  "recommended_actions": [],
  "confidence": ""
}
```

Structured outputs simplify downstream automation and validation.

---

# Legal Tone

AI responses should be:

- Professional
- Neutral
- Precise
- Respectful
- Understandable

Avoid:

- Emotional language
- Marketing language
- Unsupported certainty

---

# Citation Strategy

Whenever possible:

```
Claim

↓

Evidence

↓

Citation

↓

Explanation
```

Responses should distinguish between:

- Retrieved information
- AI reasoning
- User-provided facts

---

# Hallucination Reduction

Prompts should instruct the model to:

- Prefer retrieved evidence
- State uncertainty
- Ask clarifying questions when necessary
- Avoid fabricating citations
- Avoid inventing legal authorities

If evidence is unavailable, the response should say so explicitly.

---

# Tool Calling Prompts

When tools are available, prompts should define:

- When to call a tool
- Which tool to use
- Required inputs
- Expected outputs
- Failure behavior

Models should not guess information that a tool can retrieve.

---

# Context Budgeting

Context windows are finite.

Priority order:

1. User request
2. Matter context
3. Retrieved knowledge
4. Organization preferences
5. Conversation history
6. Additional metadata

Include only what improves the task.

---

# Jurisdiction Awareness

Prompts should receive jurisdiction as structured metadata.

Example:

```
Country

State

Court

Practice Area

Applicable Regulations
```

Never rely solely on user wording when structured jurisdiction data exists.

---

# Localization

Prompts must support:

- English
- Arabic
- Future languages

Translation should preserve legal meaning rather than perform literal word-for-word conversion.

---

# Prompt Security

Defend against:

- Prompt injection
- Context leakage
- Tool misuse
- Hidden instructions in uploaded files
- Cross-tenant data access

The system prompt must always take precedence over user instructions.

---

# Prompt Injection Handling

If a user attempts to override system behavior, the AI should:

- Ignore unauthorized instructions
- Continue following platform rules
- Explain limitations where appropriate

Retrieved documents should be treated as untrusted input unless validated.

---

# Prompt Versioning

Each prompt includes:

- Version number
- Author
- Review date
- Change summary
- Deployment status

Example:

```
contract_review_v4

Approved

Production
```

Version history must remain auditable.

---

# Prompt Review Workflow

```
Draft

↓

Peer Review

↓

Legal Review (where required)

↓

Automated Evaluation

↓

Staging

↓

Production
```

Prompt changes should follow the same discipline as code changes.

---

# Evaluation Framework

Every prompt should be tested against:

- Expected outputs
- Legal scenarios
- Edge cases
- Adversarial prompts
- Safety checks
- Regression datasets

Changes should not reduce quality without explicit approval.

---

# A/B Testing

Prompts may be evaluated using controlled experiments.

Metrics include:

- User acceptance
- Response quality
- Latency
- Cost
- Hallucination rate
- Tool usage

Winning variants become the new production baseline.

---

# Cost Optimization

Reduce cost through:

- Shorter prompts
- Context compression
- Prompt reuse
- Efficient output schemas
- Dynamic context selection
- Appropriate model routing

Prompt quality should never be sacrificed solely to reduce token usage.

---

# Observability

Track:

- Prompt version
- Agent
- Model
- Latency
- Tokens
- Cost
- Success rate
- User feedback

Prompt performance should be visible through operational dashboards.

---

# Prompt Documentation

Every prompt should include:

- Purpose
- Inputs
- Outputs
- Variables
- Example request
- Example response
- Known limitations
- Evaluation status

Documentation should evolve alongside the prompt.

---

# Deprecation

Deprecated prompts should:

- Remain archived
- Retain evaluation history
- Not receive new traffic
- Be removable after the retention period

---

# Future Enhancements

- Prompt optimization using automated evaluation
- Provider-specific prompt compilation
- Dynamic prompt selection
- Self-improving prompt recommendations
- Visual prompt editor
- Prompt dependency graphs
- Prompt impact analysis

---

# Success Criteria

The Prompt Engineering framework must:

✓ Treat prompts as production software assets.

✓ Produce reliable, consistent, and auditable AI behavior.

✓ Support multiple AI providers through a common architecture.

✓ Protect against prompt injection and context leakage.

✓ Enable structured outputs that integrate with platform workflows.

✓ Provide comprehensive testing, versioning, and governance for every production prompt.

This document is the authoritative engineering standard for prompt design, management, and lifecycle within the Barristrly Legal Intelligence Platform.