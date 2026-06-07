<p align="center">
  <img src="apps/web/public/social-card.png" alt="Glidr — community-owned surfboard ratings" width="640">
</p>

<p align="center">
  <a href="https://glidr.surf"><img alt="Live" src="https://img.shields.io/badge/live-glidr.surf-E8432A"></a>
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue"></a>
  <a href="./CONTRIBUTING.md"><img alt="PRs welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen"></a>
</p>

# Glidr

Surfboard opinions from kooks and corelords. Every board "paddles like a dream
and turns on a dime" — according to the shaper. Glidr is where surfers share how
boards **actually** ride, so you can find your next magic board without the
marketing froth.

Community-owned. Open source. **It's the board, silly.**

**Live:** [glidr.surf](https://glidr.surf)

## Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **Web:** Vite + React 19 + Tailwind CSS v4
- **Mobile:** Expo + React Native
- **Data:** Shared `@glidr/data` package — types, queries, Supabase client
- **Database:** Supabase (Postgres), Row-Level Security, Edge Functions
- **Auth:** Supabase email OTP (one-time codes), provider-agnostic identity
- **Tokens:** Shared design tokens in `packages/tokens/`

## Structure

```
apps/
  mobile/          Expo app
  web/             Vite landing page
packages/
  data/            @glidr/data — types, queries, migrations, seed, edge functions
  tokens/          @glidr/tokens — design tokens
```

## Setup

### Prerequisites

- Node.js 20+
- pnpm (`corepack enable`)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`brew install supabase/tap/supabase`)
- A Supabase project

### 1. Install dependencies

```
pnpm install
```

### 2. Create root `.env`

```
cp .env.example .env
```

Fill in your values:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

### 3. Run setup

This generates per-app `.env` files, pushes the database migrations, seeds data,
and deploys edge functions:

```
supabase login
pnpm --filter @glidr/data db:setup
```

### 4. Start developing

```
pnpm dev
```

Web at `http://localhost:5173`. Mobile via Expo Go.

## Commands

```
pnpm dev                              Start all apps
pnpm build                            Build all
pnpm typecheck                        Type check all
pnpm --filter @glidr/data db:setup    Full database setup from root .env
pnpm --filter @glidr/data db:push     Push migrations only
pnpm --filter @glidr/data db:reset    Reset and re-seed database
```

## Environment

All secrets live in the root `.env` (gitignored). The setup script generates
framework-prefixed `.env` files in each app directory:

- `apps/mobile/.env` — `EXPO_PUBLIC_*` prefixed
- `apps/web/.env` — `VITE_*` prefixed

These are also gitignored. Never commit `.env` files.

## Contributing

Froth welcome — corelords and kooks alike. See [CONTRIBUTING.md](./CONTRIBUTING.md)
for setup, conventions, and the brand voice. Be cool, don't be a kook
([Code of Conduct](./CODE_OF_CONDUCT.md)).

## Deploy

GitHub Pages via `.github/workflows/deploy.yml`. Custom domain: glidr.surf.
Pushes to main auto-deploy.

## License

[MIT](./LICENSE) © Dominik Harz
