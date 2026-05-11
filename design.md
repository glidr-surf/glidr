# Glidr Design System

## Brand

**Name:** Glidr
**Tagline:** it's the board, silly.
**Direction:** Exposé Light — STAB documentary confidence meets Neo Brutal colour. Warm sand background, ink-dark type, bold colour blocks punching through. Film grain. No border-radius. Bebas Neue doing the heavy lifting.

---

## Fonts

All served from Google Fonts.

```
https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&family=DM+Mono:wght@400;500&display=swap
```

| Role | Font | Usage |
|------|------|-------|
| Display | **Bebas Neue** | Headlines, wordmark, ratings, board names, CTAs. Always uppercase. Letter-spacing: 1–4px depending on size. |
| Body | **DM Sans** | Descriptions, reviews, UI text. Weights 300–700. |
| Mono | **DM Mono** | Labels, tags, type badges, stats, metadata. Weights 400–500. Letter-spacing: 0.08–0.15em. Always uppercase for labels. |

### Type Scale

| Token | Font | Size | Line-height | Letter-spacing | Usage |
|-------|------|------|-------------|----------------|-------|
| display-xl | Bebas Neue | 76–80px | 0.9 | 1px | Hero heading |
| display-l | Bebas Neue | 48px | 0.95 | 1px | Section headings, CTA titles |
| display-m | Bebas Neue | 32px | 1.0 | 1px | Stat numbers |
| display-s | Bebas Neue | 18px | 1.1 | 1px | Board names in list |
| rating | Bebas Neue | 28–36px | 1.0 | 0 | Board rating numbers (coloured) |
| body-l | DM Sans | 15px | 1.8 | 0 | Primary descriptions |
| body-m | DM Sans | 13px | 1.6 | 0 | Reviews, card body text |
| body-s | DM Sans | 12px | 1.5 | 0 | Shaper names, secondary info |
| body-xs | DM Sans | 11px | 1.5 | 0 | User names, small metadata |
| label | DM Mono | 10px | 1.4 | 0.15em | Section labels, hero label. Uppercase. |
| tag | DM Mono | 9px | 1.4 | 0.08em | Type badges (FISH, LOG, MID), stat labels |
| micro | DM Mono | 8px | 1.4 | 0.08em | Smallest labels, buy-again indicator |

---

## Colours

### Core Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#F2E6CE` | Page background. Warm sand. |
| `--text` | `#1A1714` | Primary text, headings, borders. Ink dark. |
| `--text-mid` | `#6A5A40` | Reviews, descriptions. |
| `--text-light` | `#8A7A60` | Metadata, placeholders, footer text. |
| `--border` | `#1A1714` | Hard borders — stat stack, CTA box, footer rule. 2px. |
| `--border-soft` | `#D8C8A8` | Row dividers, subtle separators. 1px. |

### Accent Colours

Used for rating numbers, stat blocks, tags, and CTAs. These are the colour "punches" through the warm neutral base.

| Token | Hex | Usage |
|-------|-----|-------|
| `--red` | `#E8432A` | Primary accent. CTA buttons, FISH/SHORT ratings, waitlist button, first stat block. |
| `--yellow` | `#FFD000` | LOG ratings, second stat block. |
| `--blue` | `#2A5CA8` | MID ratings, third stat block. |
| `--green` | `#2A7A4A` | ALT ratings, "would buy again" positive indicator. |

### Colour Block Rules

- Stat blocks use full-bleed accent backgrounds with white or dark text depending on contrast.
- Rating numbers in the board list are coloured per board type.
- Colour is never used on backgrounds outside of stat blocks and CTA buttons — the base is always `--bg`.
- The "would buy again" indicator uses `--green` for yes and `--red` for no.

### Dark Mode (for reference — not primary)

| Token | Hex |
|-------|-----|
| `--bg` | `#0C0A08` |
| `--surface` | `#141210` |
| `--text` | `#F2E6CE` |
| `--text-mid` | `#7A7268` |
| `--text-light` | `#5A5650` |
| `--border` | `#1E1C18` (soft), `#F2E6CE` (hard) |

Accent colours remain the same in dark mode.

---

## Spacing

Base unit: 4px. Use multiples.

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight gaps (between stat label and number) |
| `sm` | 8px | Inline gaps, small padding |
| `md` | 12px | Card internal gaps, row padding |
| `lg` | 16px | Section internal spacing |
| `xl` | 24px | Between sections within a view |
| `2xl` | 36px | Page edge padding |
| `3xl` | 48px | Major section gaps |
| `4xl` | 64px | Hero top padding |

---

## Borders & Radius

- **No border-radius anywhere.** Sharp corners only. This is a defining visual choice — do not add rounded corners to cards, buttons, inputs, or stat blocks.
- Exception: nav waitlist button and pill-shaped tags can optionally use `border-radius: 100px` for functional distinction.
- Hard borders: `2px solid var(--border)` — used on stat stack, CTA box, footer top, input fields, board list header.
- Soft borders: `1px solid var(--border-soft)` — used on board row dividers.

---

## Layout

### Landing Page (Single Screen)

```
grid-template-rows: auto 1fr auto
```

- **Nav:** top row, flex, logo left + CTA right.
- **Main:** two-column grid (1fr 1fr), vertically centered.
  - Left: hero (label, title, description, email form).
  - Right: board list + stat stack side by side.
- **Footer:** bottom row, flex, full-width border-top.
- Full viewport height (`100vh`), no scroll.
- Max width: `1200px`, centered.
- Page padding: `0 36px`.

### App Screens

- Bottom tab bar navigation: Home, Search, Rate, Profile.
- Mobile-first, max-width `480px` for mobile views.
- Card-based layouts for board reviews.
- List-based layouts for search results and ratings.

---

## Components

### Button — Primary (CTA)

```css
font-family: 'Bebas Neue';
font-size: 14px;
letter-spacing: 2px;
padding: 10px 18px;
background: var(--text); /* or var(--red) */
color: var(--bg);
border: none;
border-radius: 0;
```

### Button — Secondary

```css
font-family: 'Bebas Neue';
font-size: 13px;
letter-spacing: 2px;
padding: 8px 18px;
background: transparent;
color: var(--text);
border: 2px solid var(--border);
```

### Input

```css
padding: 10px 14px;
border: 2px solid var(--border);
background: transparent;
font-family: 'DM Sans';
font-size: 12px;
color: var(--text);
border-radius: 0;
```

Focus state: `border-color: var(--red)`.

### Stat Block

A vertical stack of coloured blocks with hard borders.

```css
.stat-stack {
  border: 2px solid var(--border);
}
.stat-block {
  padding: 14px 12px;
}
.stat-block + .stat-block {
  border-top: 2px solid var(--border);
}
```

Each block gets a colour class: `.bg-red`, `.bg-yellow`, `.bg-blue`.

### Board Row (List View)

```css
display: grid;
grid-template-columns: 42–60px 1fr 48px;
gap: 12–18px;
padding: 12–20px 0;
border-bottom: 1px solid var(--border-soft);
```

- Column 1: rating number (Bebas Neue, coloured) + type label (DM Mono).
- Column 2: board name (Bebas Neue) + shaper (DM Sans) + review (DM Sans italic).
- Column 3: buy-again indicator + user name.

### Board Card (Grid View — for app)

```css
border: 2px solid var(--border);
padding: 16–20px;
background: var(--bg);
```

Top row: type tag (left) + rating number (right).
Middle: board name + shaper.
Bottom: review snippet + buy-again.

### Type Tag

```css
font-family: 'DM Mono';
font-size: 9px;
letter-spacing: 0.08em;
color: var(--text-light);
```

Displayed inline, always uppercase. Colour matches the rating accent for that board type.

### Buy-Again Indicator

```css
font-family: 'DM Mono';
font-size: 8–9px;
letter-spacing: 0.03em;
```

- Yes: `↺ YES` in `var(--green)`
- No: `✗ NO` in `var(--red)`

---

## Film Grain

Applied as a fixed overlay on the page body:

```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.035;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,..."); /* fractalNoise SVG */
  background-size: 256px;
}
```

Use `opacity: 0.035` for light mode, `opacity: 0.06` for dark mode.

---

## Brand Voice (for copy)

| Principle | Description | Example |
|-----------|-------------|---------|
| Self-aware | We know the magic board quest is absurd. We're going anyway. | "0 magic boards found" |
| Dry & warm | British pub, not American billboard. Understatement, not exclamation marks. | "it's the board, silly." |
| Craft-agnostic | No elitism. Logs and thrusters get equal respect. | "Logs. Fish. Thrusters. Opinions." |
| Never try-hard | No forced surf slang. Humour through restraint. | "Would you buy it again?" |

### Loading States

"Waxing up..." / "Checking the cam..." / "Paddling out..." / "Reading the lineup..."

### Empty States

"No boards rated yet. It's not you, it's the board. Oh wait."

### Footer Line

"still looking for the magic board."
