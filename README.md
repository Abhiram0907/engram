# Engram Monorepo

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **pnpm** (preferred) or npm

### 2. Installation
Install all dependencies from the root:
```bash
pnpm install
```

### 3. Running the Web App
Start the Next.js development server:
```bash
# Run from root
pnpm --filter web dev
# OR cd into the app
cd apps/web && pnpm dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 🛠 Testing the API
The `POST /api/log` endpoint is ready for testing.

### Using cURL (Terminal)
**Test a Valid Request:**
```bash
curl -X POST http://localhost:3000/api/log \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "test-key", "hash": "my-secure-hash", "metadata": {"source": "manual"}}'
```

**Response:**
```json
{
  "success": true,
  "transactionId": "tx_12345...",
  "status": "logged",
  "timestamp": "..."
}
```

### Using Browser Console
1. Open [http://localhost:3000](http://localhost:3000) in Chrome/Safari/Firefox.
2. Open Developer Tools (Cmd+Option+J).
3. Paste this snippet:
```javascript
fetch('/api/log', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apiKey: 'browser-test',
    hash: 'browser-hash-123',
    metadata: { userAgent: navigator.userAgent }
  })
})
.then(res => res.json())
.then(console.log);
```

## 📂 Structure
- `apps/web`: Next.js App Router application.
- `packages/`: Shared packages (currently holds `sdk-python`).
