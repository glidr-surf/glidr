# Glidr

Surfboard opinions from kooks and corelords. Find your next magic board.

**Live:** [glidr.surf](https://glidr.surf)

## Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **Web:** Vite + React 19 + Tailwind CSS v4
- **Mobile:** Expo + React Native
- **Data:** Shared `@glidr/data` package — types, queries, Supabase client
- **Database:** Supabase (Postgres), Row-Level Security, Edge Functions
- **Auth:** Privy (social OAuth + web3 wallets)
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
- A Privy app

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
PRIVY_APP_ID=your-privy-app-id
```

### 3. Run setup

This generates per-app `.env` files, pushes the database migration, seeds data, deploys edge functions, and sets edge-function secrets:

```
supabase login
pnpm --filter @glidr/data db:setup
```

> **Auth note:** Supabase doesn't support Privy as a native third-party JWT provider, so authenticated writes need a token-exchange flow (verify the Privy JWT in an edge function, then mint/link a Supabase session). That's wired separately — `AuthContext` currently has stubs. Read-only data works immediately via the anon key + RLS.

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

All secrets live in the root `.env` (gitignored). The setup script generates framework-prefixed `.env` files in each app directory:

- `apps/mobile/.env` — `EXPO_PUBLIC_*` prefixed
- `apps/web/.env` — `VITE_*` prefixed

These are also gitignored. Never commit `.env` files.

## Deploy

GitHub Pages via `.github/workflows/deploy.yml`. Custom domain: glidr.surf. Pushes to main auto-deploy.
