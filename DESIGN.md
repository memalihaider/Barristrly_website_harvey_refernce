# Layers Design System

> Implementation-ready UI guidance for the Layers marketing site and dashboard web app.
> Visual reference: Harvey.ai structure · Primary accent: Orange · WCAG 2.2 AA

---

## 1. Context and goals

**Design intent:** Deliver a high-contrast, Harvey-structured legal SaaS marketing system where **Layers** is the hero brand signal, **orange** is the sole primary action color, and every interactive control has explicit, testable states.

**Audience:** Buyers, legal teams, and decision-makers across UAE, GCC, and Pakistan.

**Product surfaces:** Marketing landing pages first; tokens must extend to the dashboard web app without one-off exceptions.

---

## 2. Design tokens and foundations

### 2.1 Typography

| Token | Value |
| --- | --- |
| `font.family.sans` | DM Sans, system-ui, sans-serif |
| `font.family.serif` | Instrument Serif, Georgia, serif |
| `font.size.base` | 16px |
| `font.weight.base` | 400 |
| `font.lineHeight.base` | 24px |
| `font.size.xs` | 14px |
| `font.size.sm` | 16px |
| `font.size.md` | 20px |
| `font.size.lg` | 40px |
| `font.size.xl` | 96px (hero display) |

- Display / section headings **must** use `font.family.serif`.
- UI labels, body, nav, and buttons **must** use `font.family.sans`.
- Do **not** introduce Inter, Roboto, or Arial as brand fonts.

### 2.2 Color (semantic)

| Token | Value | Use |
| --- | --- | --- |
| `color.primary` | `#E85D04` | Primary CTAs, active capability, key accents |
| `color.primary.hover` | `#D45103` | Hover on primary actions |
| `color.primary.active` | `#C2410C` | Pressed / high-contrast on light |
| `color.primary.light` | `#FF8A3D` | Accents on dark surfaces |
| `color.on.primary` | `#FFFFFF` | Text/icons on primary fills |
| `color.surface.base` | `#000000` | Hero overlay sections, stats, security, footer |
| `color.surface.raised` | `#0F0E0D` | Elevated dark panels |
| `color.surface.light` | `#FAFAF9` | Page canvas (light) |
| `color.surface.soft` | `#F5F4F1` | Alternating light sections |
| `color.text.primary` | `#FAFAF9` | Primary text on dark |
| `color.text.secondary` | `#CCCAC6` | Secondary text on dark |
| `color.text.tertiary` / `color.text.on.light` | `#0F0E0D` | Primary text on light |
| `color.text.on.light.muted` | `#5C5954` | Body on light |
| `color.text.muted` | `#8A8780` | Meta / helpers |

**Contrast rules (must):**
- Body text on light **must** meet ≥ 4.5:1 against its surface.
- Primary button text (`color.on.primary` on `color.primary`) **must** meet ≥ 4.5:1.
- Links and active capability text using orange on light **must** use `color.primary` or darker (`color.primary.active`) — never washed pastels.
- Focus rings **must** remain visible on both light and dark surfaces (`outline: 2px solid color.primary`).

### 2.3 Spacing, radius, motion

| Token | Value |
| --- | --- |
| `space.1`–`space.8` | 7 / 8 / 10 / 12 / 16 / 20 / 24 / 32px |
| `radius.xs` | 4px (media frames) |
| `radius.pill` | 9999px (buttons) |
| `motion.duration.instant` | 200–300ms |
| `motion.ease` | `cubic-bezier(0.22, 1, 0.36, 1)` |

---

## 3. Component-level rules

### 3.1 Button

**Anatomy:** label · optional trailing icon · optional loading spinner.

**Variants:** `primary` (orange fill) · `white` (on dark hero/nav) · `ghost` (outline on dark).

| State | Behavior |
| --- | --- |
| default | Filled / outlined per variant |
| hover | Darken fill 1 step; optional 1px lift |
| focus-visible | 2px `color.primary` outline, 3px offset |
| active | `color.primary.active` (primary) |
| disabled | opacity 0.45; `pointer-events: none`; no hover |
| loading | spinner replaces icon; keep width; `aria-busy` |
| error | not used on static CTAs; form submits use inline error |

**Keyboard:** Enter / Space activates.  
**Pointer / touch:** min height 44px on touch targets.  
**Overflow:** label truncates with ellipsis after 2 lines max — prefer shorter copy.

### 3.2 Navigation

**Anatomy:** brand wordmark · centered links · Log in · Get Started · mobile menu.

| State | Rule |
| --- | --- |
| default (over hero) | Transparent bar; white text |
| scrolled | `surface.base` / 90% blur; border `white/10` |
| hover link | Increase opacity to solid white |
| focus-visible | Primary outline on link / button |
| mobile open | Full-width dark drawer; Esc closes (recommended) |

**Responsive:** `< lg` collapses to icon button. Drawer **must** trap focus while open.

### 3.3 Hero

**Must contain only:** brand signal · one headline · one supporting sentence · one CTA group · full-bleed media.

**Must not include:** trust pills, stats strips, floating badges, or overlay chips on media.

### 3.4 Capability list

Large serif titles; inactive at ~28% opacity; active / hover / focus → full opacity + `color.primary`.

**Keyboard:** Tab between items; Enter/Space expands description.  
**Empty / long content:** description max ~2 sentences; wrap gracefully under title.

### 3.5 Stats row

Dark surface; label left, large serif numeral right; hairline dividers.

### 3.6 Security badges

Outlined square icons; no heavy cards; label + certification under each.

### Density note (marketing page)

Expect high link/button counts on footer + nav. Prefer system button/link styles — no local color overrides.

---

## 4. Accessibility requirements

Target: **WCAG 2.2 AA**.

| Check | Pass criterion |
| --- | --- |
| Contrast | Text ≥ 4.5:1; large text ≥ 3:1 |
| Focus | Every interactive control shows `:focus-visible` |
| Keyboard | Full page operable without pointer |
| Labels | Buttons/links have accessible names |
| Motion | `prefers-reduced-motion` disables ticker / non-essential motion |
| Images / video | Decorative video `aria-hidden`; meaningful images have alt |

---

## 5. Content and tone

Concise, confident, implementation-focused.

| Do | Don’t |
| --- | --- |
| “Get Started” | “Click here” |
| “Practice Made Perfect.” | Long stacked marketing claims in the hero |
| One idea per section | Multiple competing CTAs in one viewport |

---

## 6. Anti-patterns (prohibited)

- Cream / terracotta AI-default themes on this product.
- Purple gradients, glow stacked shadows, emoji as UI.
- Hidden focus outlines.
- Raw hex in component JSX when a semantic token exists.
- Cards in the hero; badges floating on hero media.
- One-off spacing outside the `space.*` scale.

---

## 7. QA checklist

- [ ] Hero reads as one composition with brand + headline + sentence + CTA + media
- [ ] Primary CTAs use orange with white label and pass contrast
- [ ] Nav contrast correct over video and after scroll
- [ ] Capability list active state uses orange; keyboard operable
- [ ] Stats / security / footer on black with secondary text ≥ 4.5:1 where required
- [ ] No low-contrast gray-on-gray body text
- [ ] Focus-visible visible on buttons, links, FAQ, pricing toggle
- [ ] Reduced-motion respected on ticker and entrance animations
- [ ] Mobile: menu, hero, capability list, and pricing usable at 375px
