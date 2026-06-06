# CLAUDE.md

## Project

Glidr — community-owned surfboard rating app. This repo is a pnpm monorepo with Turborepo.

## Structure

- `apps/web/` — Vite + React 19 + Tailwind CSS v4 landing page
- `apps/mobile/` — Expo + React Native app
- `packages/data/` — `@glidr/data` — types, Supabase queries, migrations, seed, edge functions
- `packages/tokens/` — Platform-agnostic design tokens (colors, spacing, typography as TS)

## Design system

All design tokens live in `apps/web/src/app.css` via Tailwind v4's `@theme` directive. No JS config, no preset package — CSS is the source of truth. The `@glidr/tokens` package exists for mobile/non-Tailwind consumers.

Fonts: Bebas Neue (display), DM Sans (body), DM Mono (mono). Loaded via Google Fonts in `index.html`.

### Mobile design language (risograph)

Established in the 2026-06 mobile redesign. Full spec: `docs/superpowers/specs/2026-06-06-mobile-riso-redesign-design.md` (local, gitignored).

- **Aesthetic:** risograph zine, *calibrated*. The core rule that creates hierarchy: **bold bordered blocks** (2.5px ink border + hard offset shadow + filled accent) for highlights/actions; **calm cards** (`surfaceCard` bg, thin `borderSoft` border, 4px radius, no shadow) for anything you read. ≤2 bold blocks per screen.
- **Primitives:** `BoldBlock`, `Card`, `Button` (minHeight 56). The hard offset shadow is faked with an offset ink `View` behind content (Android elevation can't do offset hard shadows).
- **Images:** render `board.imageUrl` in full colour inside riso frames (no duotone/Skia). Fallback when null = accent block with the board's Bebas initial + type tag. `object-position: top` to show the nose.
- **Icons:** Phosphor (`phosphor-react-native`) — bold weight default, fill for active. **No emoji anywhere in the UI.**
- **Type:** no readable/primary content below 15px; tiny uppercase reserved for section labels & metadata only.
- **Navigation:** dark tab bar, yellow active; 3 tabs (Browse / Rate / Profile). Search lives in a header magnifier → stacked search screen, not a tab. Tab bar + sticky CTAs use `useSafeAreaInsets()`; tap targets ≥48dp (Apple HIG 44pt / Material 48dp; bottom nav kept because it's the most thumb-reachable zone).

## Brand voice

Self-aware, dry, warm. British pub humor meets surf culture. Use actual surf lingo: kook, corelord, grom, froth, stoked, gnarly. Never sanitize into generic product-speak. The humor is in the understatement — never preachy, never try-hard. Less is more.

Community-owned app that helps surfers cut through shaper marketing. Every board "paddles like a log and turns like a shortie" according to shapers — Glidr is where people share what boards actually ride like.

## Key decisions

- Desktop layout: single viewport, no scroll (two-column grid). Mobile: scrollable, content-led.
- Responsive breakpoint: `lg:` (1024px). Mobile-first.
- Board images use `object-position: top` to show the nose.
- Ratings use **Phosphor stars** (mobile `Stars` component; `star-half` for fractional averages). This revises the earlier "surfer emoji / surfboard icon" approach — a custom surfboard-nose icon is parked for a professional designer (see spec §9). No emoji in the mobile UI.
- Film grain overlay via SVG fractalNoise on `body::after`.
- Database: Supabase (Postgres) with Supabase-native email-OTP auth (Privy removed). Flexible opinion schema (EAV for scores + tags).
- Root `.env` holds unprefixed secrets; `db:setup` script generates per-app prefixed `.env` files.
- Opinions, not ratings. "Magic boards" = 5/5 rated boards.

## Commands

```
pnpm dev                              # start all apps
pnpm build                            # build all
pnpm typecheck                        # type check all
pnpm --filter @glidr/data db:setup    # full DB setup from root .env
pnpm --filter @glidr/data db:push     # push migrations only
pnpm --filter @glidr/data db:reset    # reset and re-seed
```

## Deploy

GitHub Pages via `.github/workflows/deploy.yml`. Custom domain: glidr.surf. Pushes to main auto-deploy.
