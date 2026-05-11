# Glidr

Surfboard opinions from kooks and corelords. Find your next magic board.

**Live:** [glidr.surf](https://glidr.surf)

## Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **Web:** Vite + React + Tailwind CSS v4
- **Mobile:** Expo (placeholder)
- **Tokens:** Shared design tokens in `packages/tokens/`

## Development

```
pnpm install
pnpm dev
```

Web app runs at `http://localhost:5173`.

## Deploy

Pushes to `main` auto-deploy to GitHub Pages via the workflow in `.github/workflows/deploy.yml`.
