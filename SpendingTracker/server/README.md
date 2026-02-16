# Spending Tracker – Backend (Express)

File-based backend for transactions and receipt images. Express, `body-parser`, CORS, JSON + disk storage.

## Run

From project root:

```bash
npm install
npm run server
```

Server runs at **http://localhost:3000**.

- **Development:** Run `npm run dev` (Vite) in one terminal and `npm run server` in another. Point the frontend API base URL to `http://localhost:3000`.

## Data

- **Transactions:** `server/data/transactions.json`
- **Receipt images:** `server/data/receipts/` (one file per transaction, e.g. `<transactionId>.jpg`)

## API

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions?month=YYYY-MM` | List transactions (optional filter by month) |
| POST | `/api/transactions` | Create transaction (body: `type`, `amount`, `currency`, `date`, `categoryId`, `merchant`, `note`) |
| PATCH | `/api/transactions/:id` | Update transaction (partial body) |
| DELETE | `/api/transactions/:id` | Delete transaction (and its receipt file if any) |

### Receipts

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/receipts` | Upload receipt image. Body: `{ transactionId, image }` where `image` is a data URL (`data:image/jpeg;base64,...`). Saves file to disk and sets `receiptPath` on the transaction. |
| GET | `/api/receipts/files/:filename` | Serve stored receipt image (e.g. `/api/receipts/files/abc123.jpg`) |

Transaction shape: `id`, `type` (`expense` \| `income`), `amount`, `currency`, `date` (YYYY-MM-DD), `categoryId`, `merchant`, `note`, `createdAt`, `updatedAt`, `receiptPath` (e.g. `receipts/abc123.jpg` or `null`).

## Later: S3

Later switch to S3-compatible storage:

1. Keep the same API: `POST /api/receipts` can generate a presigned URL or accept upload and proxy to S3.
2. Store only the S3 key/URL in `transactions.receiptPath` and stop writing files under `server/data/receipts/`.
