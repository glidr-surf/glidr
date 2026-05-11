# CLAUDE.md

## Project

Glidr — community-owned surfboard rating app. This repo is a pnpm monorepo with Turborepo.

## Structure

- `apps/web/` — Vite + React 19 + Tailwind CSS v4 landing page
- `apps/mobile/` — Expo placeholder (tokens wiring only)
- `packages/tokens/` — Platform-agnostic design tokens (colors, spacing, typography as TS)

## Design system

All design tokens live in `apps/web/src/app.css` via Tailwind v4's `@theme` directive. No JS config, no preset package — CSS is the source of truth. The `@glidr/tokens` package exists for mobile/non-Tailwind consumers.

Fonts: Bebas Neue (display), DM Sans (body), DM Mono (mono). Loaded via Google Fonts in `index.html`.

## Brand voice

Self-aware, dry, warm. British pub humor meets surf culture. Use actual surf lingo: kook, corelord, grom, froth, stoked, gnarly. Never sanitize into generic product-speak. The humor is in the understatement — never preachy, never try-hard. Less is more.

Community-owned app that helps surfers cut through shaper marketing. Every board "paddles like a log and turns like a shortie" according to shapers — Glidr is where people share what boards actually ride like.

## Key decisions

- Desktop layout: single viewport, no scroll (two-column grid). Mobile: scrollable, content-led.
- Responsive breakpoint: `lg:` (1024px). Mobile-first.
- Board images use `object-position: top` to show the nose.
- Surfer emoji (🏄) ratings, not stars.
- Film grain overlay via SVG fractalNoise on `body::after`.
- Waitlist form is UI-only (no backend yet).
- Web3 backend planned (progressive decentralization) — deferred to app brief.

## Commands

```
pnpm dev          # start all apps
pnpm build        # build all
pnpm typecheck    # type check all
```

## Deploy

GitHub Pages via `.github/workflows/deploy.yml`. Custom domain: glidr.surf. Pushes to main auto-deploy.
