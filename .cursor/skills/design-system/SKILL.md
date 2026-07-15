---
name: design-system-harvey
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Layers (Harvey-structure + Orange primary)

## Mission
Deliver implementation-ready design-system guidance for Layers that mirrors Harvey.ai layout structure with orange as the primary accent, optimized for marketing and dashboard web app consistency.

## Brand
- Product/brand: Layers
- Reference URL: https://www.harvey.ai/
- Audience: buyers, teams, and decision-makers
- Product surface: marketing site + dashboard web app

## Style Foundations
- Visual style: high-contrast monochrome structure with orange primary actions; serif display + sans UI
- Main font style: `font.family.sans=DM Sans`, `font.family.serif=Instrument Serif`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=24px`
- Typography scale: `font.size.xs=14px`, `font.size.sm=16px`, `font.size.md=20px`, `font.size.lg=40px`, `font.size.xl=96px`
- Color palette: `color.primary=#E85D04`, `color.primary.hover=#D45103`, `color.primary.active=#C2410C`, `color.primary.light=#FF8A3D`, `color.on.primary=#FFFFFF`, `color.text.primary=#FAFAF9`, `color.text.secondary=#CCCAC6`, `color.text.tertiary=#0F0E0D`, `color.text.inverse=#FFFFFF`, `color.surface.base=#000000`, `color.surface.light=#FAFAF9`, `color.surface.soft=#F5F4F1`, `color.surface.muted=oklab(0.984819 -0.000328124 0.00128484 / 0.15)`
- Spacing scale: `space.1=7px`, `space.2=8px`, `space.3=10px`, `space.4=12px`, `space.5=16px`, `space.6=20px`, `space.7=24px`, `space.8=32px`
- Radius/shadow/motion tokens: `radius.xs=4px`, `radius.pill=9999px` | `motion.duration.instant=300ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
concise, confident, implementation-focused

## Rules: Do
- Use semantic tokens, not raw hex values in component guidance.
- Every component must define required states: default, hover, focus-visible, active, disabled, loading, error.
- Responsive behavior and edge-case handling should be specified for every component family.
- Accessibility acceptance criteria must be testable in implementation.
- Keep hero to brand + headline + support + CTA + full-bleed media only.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not place trust pills, stats, or floating badges in the hero.
- Do not use cream/terracotta or purple-glow default themes.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy, variants, and interactions.
4. Add accessibility acceptance criteria.
5. Add anti-patterns and migration notes.
6. End with QA checklist.

## Required Output Structure
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Prefer system consistency over local visual exceptions.

<!-- TYPEUI_SH_MANAGED_END -->

Full living spec: see `DESIGN.md` at the repository root.
