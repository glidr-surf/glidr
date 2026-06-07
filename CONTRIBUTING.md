# Contributing to Glidr

Froth welcome. Whether you're a corelord or a kook who just got their first
soft-top, here's how to get involved without anyone dropping in on anyone.

## Ground rules

Be cool, don't be a kook. We follow a [Code of Conduct](./CODE_OF_CONDUCT.md) —
the short version: respect people, share waves, no aggro in the lineup.

## Getting set up

Read the [README](./README.md) — it has the full local setup (pnpm monorepo,
Supabase, the lot). TL;DR:

```
pnpm install
cp .env.example .env   # fill in your Supabase values
pnpm --filter @glidr/data db:setup
pnpm dev
```

## Making changes

1. Fork the repo and branch off `main`.
2. Keep changes focused — one fix or feature per PR. Smaller is easier to review.
3. Match the existing style. Don't reformat code you aren't touching.
4. **Run `pnpm typecheck` before you push.** Green or it's not done.
5. Use [Conventional Commits](https://www.conventionalcommits.org): `feat(web): ...`,
   `fix(data): ...`, `chore: ...`. Scope is the package or app you touched.
6. Open a PR against `main`. Fill in the template. Add screenshots for anything
   that changes the UI.

## Brand voice

Glidr talks like the surf, not like a SaaS landing page. Dry, warm, a bit of
British pub humour. Real surf lingo, never sanitised. If a string sounds like
marketing wrote it, it's wrong.

## Questions / ideas

Open a [Discussion](https://github.com/glidr-surf/glidr/discussions) for chatter
and half-baked ideas. Open an [Issue](https://github.com/glidr-surf/glidr/issues)
for concrete bugs and requests.
