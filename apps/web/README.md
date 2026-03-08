# @engram/web

Next.js frontend for Engram.

## Env

Create `apps/web/.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

## Scripts

From repo root:

```bash
npm run dev:web
npm run build:web
npm run start:web
```

From this directory:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Behavior

- Preserves existing UI flow and states.
- Submits notarization requests to `${NEXT_PUBLIC_API_BASE_URL}/notarize`.
