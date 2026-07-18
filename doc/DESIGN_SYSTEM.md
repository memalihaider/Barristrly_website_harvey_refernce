# ⚖️ Barristrly Design System

> Version: 1.0
> Status: Approved
> Owner: Product Design & Frontend Engineering
> Depends On:
> - FRONTEND_ARCHITECTURE.md
> - DESIGN_TOKENS.md (Future)
> Last Updated: July 2026

---

# Purpose

The Barristrly Design System defines the complete visual language, interaction principles, UI components, design tokens, accessibility standards, and implementation guidelines for every product surface.

It ensures:

- Visual consistency
- Faster development
- Better accessibility
- Predictable user experience
- Enterprise-quality interfaces
- AI-first interactions

This design system is intended to be implemented using **Tailwind CSS + shadcn/ui** while remaining framework-agnostic at the design level.

---

# Design Philosophy

Barristrly is not designed like a traditional ERP.

It is designed like a professional legal workspace.

The interface should feel:

✓ Calm

✓ Focused

✓ Intelligent

✓ Trustworthy

✓ Premium

✓ Minimal

The interface should never compete with the user's work.

---

# Core Principles

### Content First

Documents, conversations, and matters receive more visual emphasis than UI chrome.

---

### AI First

AI is always accessible but never intrusive.

---

### Progressive Disclosure

Show only what the user needs now.

Advanced functionality appears when relevant.

---

### Consistency Over Creativity

Every interaction should behave predictably.

---

### Accessibility by Default

Accessibility is a requirement, not an enhancement.

---

# Visual Identity

Barristrly should establish its own identity rather than resemble any single competitor.

Characteristics:

- Clean layouts
- Generous whitespace
- Precise typography
- Light cream page backgrounds with orange as the primary brand accent
- Subtle elevation
- Gentle motion
- Rounded corners used consistently, not excessively

---

# Layout Grid

Desktop

```
12 Columns
```

Tablet

```
8 Columns
```

Mobile

```
4 Columns
```

Maximum content width:

```
1440px
```

Reading width:

```
720–800px
```

---

# Spacing System

Base unit

```
4px
```

Scale

```
4

8

12

16

20

24

32

40

48

64

80

96
```

Spacing should rely exclusively on this scale.

---

# Border Radius

| Component | Radius |
|-----------|--------|
| Button | 10px |
| Input | 10px |
| Card | 14px |
| Modal | 18px |
| Popover | 16px |
| Tooltip | 8px |

Avoid excessive rounding.

---

# Typography

Primary

```
Inter
```

Legal document editor

```
Source Serif 4
```

Monospace

```
JetBrains Mono
```

---

# Typography Scale

| Style | Size |
|---------|------|
| Display | 56 |
| H1 | 40 |
| H2 | 32 |
| H3 | 24 |
| H4 | 20 |
| H5 | 18 |
| Body Large | 18 |
| Body | 16 |
| Small | 14 |
| Caption | 12 |

Use typography—not color—as the primary hierarchy.

---

# Color Philosophy

Use a restrained palette anchored by two brand commitments:

1. **Primary theme color — Orange** for actions, focus, active states, and key accents
2. **Background color — Light cream** for the default page canvas and light surfaces

Orange communicates action and brand presence. It must not flood large surfaces.

Light cream keeps the product calm and readable. Primary surfaces stay soft and neutral; orange is reserved for CTAs, links, active capability states, and focus indicators.

## Brand Colors (Current)

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Primary | `color.primary` | `#E85D04` | Primary buttons, active accents, focus rings |
| Primary hover | `color.primary.hover` | `#D45103` | Hover on primary actions |
| Primary active | `color.primary.active` | `#C2410C` | Pressed / high-contrast orange on light |
| Primary light | `color.primary.light` | `#FF8A3D` | Accents on dark sections |
| On primary | `color.on.primary` | `#FFFFFF` | Text and icons on orange fills |
| Background (light cream) | `color.surface.light` / `color.ivory` | `#FAFAF9` | Default page background |
| Soft cream surface | `color.surface.soft` | `#F2F1F0` | Alternating light sections |
| Ink text on light | `color.text.on.light` | `#0F0E0D` | Primary body/heading text on cream |
| Dark surface | `color.surface.base` | `#000000` | Hero overlays, stats, security, footer |

## Semantic Colors

- Success
- Warning
- Error
- Information

Dark and light themes must share the same semantic meaning.

Orange remains the only brand primary across marketing and product surfaces. Do not introduce competing brand hues (for example purple or teal) as a second primary.

---

# Elevation

Three levels only.

```
Flat

↓

Raised

↓

Overlay
```

Avoid deep shadows.

Prefer subtle contrast.

---

# Iconography

Library

```
Lucide
```

Guidelines:

- 20px default
- 16px compact
- 24px prominent

Icons should clarify meaning, not replace text.

---

# Buttons

Variants

- Primary
- Secondary
- Outline
- Ghost
- Destructive
- Link

Sizes

- Small
- Medium
- Large
- Icon

Rules

- One primary action per screen
- Avoid multiple competing primary buttons

---

# Inputs

Supported:

- Text
- Number
- Email
- Password
- Search
- Date
- Time
- Currency
- File Upload
- Combobox
- Multi-select

Features:

- Inline validation
- Clear labels
- Helper text
- Keyboard support

---

# Navigation

Primary navigation:

- Fixed left sidebar
- Collapsible
- Icon + label
- Favorites
- Recently visited

Top navigation:

- Search
- AI Command
- Notifications
- Organization switcher
- User menu

Navigation should remain stable across the application.

---

# Tables

Capabilities:

- Sticky headers
- Column resizing
- Column visibility
- Filtering
- Sorting
- Pagination
- Bulk actions
- Saved views
- CSV export

Density modes:

- Comfortable
- Compact

---

# Cards

Cards are containers—not decoration.

Use cards only to group related content.

Avoid card-heavy dashboards.

---

# Forms

Requirements:

- Single-column by default
- Logical grouping
- Autosave where appropriate
- Required field indicators
- Inline validation
- Clear success and error feedback

---

# AI Components

## AI Prompt Box

Supports:

- Rich text
- File attachments
- Matter context
- Jurisdiction selection
- Agent selection

---

## AI Response

Features:

- Markdown rendering
- Citations
- Copy
- Export
- Regenerate
- Feedback
- Follow-up prompts

---

## AI Streaming

Display:

- Typing indicator
- Progressive rendering
- Cancellation
- Partial responses

---

# Document Viewer

Capabilities:

- Multi-page preview
- Zoom
- Search
- Highlighting
- Annotations
- Split view with AI
- Version comparison

The document viewer is a first-class workspace, not a modal.

---

# Empty States

Every empty state should include:

- Clear explanation
- Primary action
- Optional documentation link

Avoid generic "No data" messaging.

---

# Loading States

Use:

- Skeleton loaders
- Progressive rendering
- Optimistic UI where appropriate

Avoid full-screen spinners except during initial application boot.

---

# Feedback

Provide immediate feedback for:

- Saves
- Uploads
- AI generation
- Payments
- Errors
- Background processing

Prefer non-blocking toast notifications for transient events.

---

# Motion

Motion should communicate state changes.

Use for:

- Dialogs
- Drawers
- Page transitions
- Expand/collapse
- Reordering

Duration:

- Fast: 150ms
- Standard: 200–250ms
- Slow: 300ms

Animations should respect reduced-motion preferences.

---

# Accessibility

Target:

WCAG 2.2 AA

Requirements:

- Visible focus indicators
- Keyboard navigation
- Semantic HTML
- Screen reader support
- Accessible color contrast
- Reduced motion support

Accessibility testing is part of the design process.

---

# Responsive Behavior

Desktop:

- Persistent sidebar
- Multi-column layouts

Tablet:

- Condensed navigation
- Adaptive panels

Mobile:

- Bottom navigation
- Drawer-based secondary navigation
- Simplified layouts

Critical workflows must remain fully functional on all supported devices.

---

# Dark Mode

Dark mode is not an inverted light theme.

Design specifically for:

- Reduced eye strain
- Appropriate contrast
- Consistent semantic colors
- Comfortable document reading

---

# Component Library

Core components include:

- Button
- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Badge
- Avatar
- Card
- Table
- Tabs
- Dialog
- Drawer
- Tooltip
- Popover
- Command Palette
- Date Picker
- File Uploader
- AI Chat Panel
- Document Viewer
- Timeline
- Activity Feed
- Notification Center

All components should support light mode, dark mode, keyboard interaction, and accessibility.

---

# Design Tokens (Future)

Tokens should define:

- Colors (primary orange `#E85D04`, light cream background `#FAFAF9`, ink, grays, semantic)
- Typography
- Spacing
- Radius
- Shadows
- Motion
- Breakpoints
- Z-index
- Opacity

Tokens are the single source of truth for implementation. Current brand color tokens live in `app/globals.css` and must stay aligned with this document.

---

# Figma Standards

Every component should include:

- Variants
- States
- Auto Layout
- Design Tokens
- Component Properties
- Documentation
- Accessibility Notes

Design and code should remain synchronized.

---

# Future Enhancements

- Multi-brand theming
- Customer-specific themes
- White-label support
- AI-generated layouts
- Adaptive interfaces
- Collaborative cursors
- Plugin component SDK

---

# Success Criteria

The Design System must:

✓ Create a distinctive Barristrly visual identity.

✓ Provide a calm, professional workspace for legal professionals.

✓ Maintain consistency across every screen.

✓ Enable rapid development through reusable components.

✓ Meet enterprise accessibility and usability standards.

✓ Scale as the platform grows without visual fragmentation.

This document is the authoritative visual and interaction specification for the Barristrly platform.