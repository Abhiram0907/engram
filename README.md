# Engram Monorepo

Workspace monorepo for Engram:

- `apps/web`: Next.js frontend
- `apps/api`: Fastify TypeScript backend

## Requirements

- Node.js 20+
- npm 10+

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Configure env files:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

3. Run both services:

```bash
npm run dev
```

- Web: `http://localhost:3000`
- API: `http://localhost:4000`

## Workspace scripts

- `npm run dev`: run web + api concurrently
- `npm run dev:web`: run only Next.js app
- `npm run dev:api`: run only Fastify API
- `npm run build`: build all workspaces
- `npm run start`: start built web + api
- `npm run lint`: run lint/type checks across workspaces

## Notes

- Web calls `${NEXT_PUBLIC_API_BASE_URL}/notarize`.
- API preserves notarize response shape:

```json
{
  "status": "success",
  "topicId": "0.0.x",
  "sequenceNumber": "1",
  "url": "https://hashscan.io/testnet/transaction/...",
  "topicUrl": "https://hashscan.io/testnet/topic/..."
}
```
