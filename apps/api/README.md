# @engram/api

Fastify TypeScript API for Engram.

## Endpoints

- `GET /health`
- `POST /notarize`

`POST /notarize` request body:

```json
{
  "content": "string"
}
```

`POST /notarize` success response:

```json
{
  "status": "success",
  "topicId": "0.0.x",
  "sequenceNumber": "1",
  "url": "https://hashscan.io/testnet/transaction/...",
  "topicUrl": "https://hashscan.io/testnet/topic/..."
}
```

## Architecture

- Route handlers stay thin in `src/routes`.
- Hedera/notarization logic is isolated in `src/lib/engram-client.ts`.
- `engram-client.ts` exports an interface and factory so it can be replaced later by a real SDK implementation.

## Env

Create `apps/api/.env`:

```bash
PORT=4000
HOST=0.0.0.0
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.12345
HEDERA_PRIVATE_KEY=302e020100300506032b657004220420...
```

## Scripts

From repo root:

```bash
npm run dev:api
npm run build:api
npm run start:api
```

From this directory:

```bash
npm run dev
npm run build
npm run start
npm run lint
```
