import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import bodyParser from 'body-parser';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');
const RECEIPTS_DIR = path.join(DATA_DIR, 'receipts');

const app = express();

// Increase limit for base64 image uploads
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Serve uploaded receipt images
app.use('/api/receipts/files', express.static(RECEIPTS_DIR));

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(RECEIPTS_DIR, { recursive: true });
}

async function readTransactions() {
  try {
    const raw = await fs.readFile(TRANSACTIONS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
}

async function writeTransactions(transactions) {
  await fs.writeFile(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));
}

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// --- Transactions ---

app.get('/api/transactions', async (req, res) => {
  try {
    const month = req.query.month;
    let transactions = await readTransactions();
    if (month) {
      transactions = transactions.filter((t) => t.date && t.date.startsWith(String(month)));
    }
    res.json(transactions);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to load transactions.' });
  }
});

app.post('/api/transactions', async (req, res) => {
  const data = req.body;
  if (data == null) {
    return res.status(400).json({ message: 'Missing data.' });
  }
  const { type, amount, currency, date, categoryId, merchant, note } = data;
  if (
    type == null ||
    !['expense', 'income'].includes(type) ||
    amount == null ||
    typeof amount !== 'number' ||
    !currency ||
    !date
  ) {
    return res.status(400).json({
      message: 'Missing or invalid: type (expense|income), amount (number), currency, date.',
    });
  }
  try {
    await ensureDataDir();
    const transactions = await readTransactions();
    const now = new Date().toISOString();
    const newTransaction = {
      id: generateId(),
      type,
      amount,
      currency: currency || 'PLN',
      date: String(date).slice(0, 10),
      categoryId: categoryId || '',
      merchant: merchant ?? null,
      note: note ?? null,
      createdAt: now,
      updatedAt: now,
      receiptPath: null,
    };
    transactions.push(newTransaction);
    await writeTransactions(transactions);
    res.status(201).json(newTransaction);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to create transaction.' });
  }
});

app.patch('/api/transactions/:id', async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  if (data == null) {
    return res.status(400).json({ message: 'Missing data.' });
  }
  try {
    const transactions = await readTransactions();
    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }
    const allowed = ['type', 'amount', 'currency', 'date', 'categoryId', 'merchant', 'note'];
    const updated = { ...transactions[index], updatedAt: new Date().toISOString() };
    for (const key of allowed) {
      if (data[key] !== undefined) updated[key] = data[key];
    }
    if (updated.date) updated.date = String(updated.date).slice(0, 10);
    transactions[index] = updated;
    await writeTransactions(transactions);
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to update transaction.' });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const transactions = await readTransactions();
    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }
    const removed = transactions[index];
    transactions.splice(index, 1);
    await writeTransactions(transactions);
    // Optionally delete receipt file if exists
    if (removed.receiptPath) {
      const receiptPath = path.join(RECEIPTS_DIR, path.basename(removed.receiptPath));
      try {
        await fs.unlink(receiptPath);
      } catch (_) {}
    }
    res.status(200).json({ message: 'Deleted.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to delete transaction.' });
  }
});

// --- Receipts (store image on disk, link to transaction) ---

app.post('/api/receipts', async (req, res) => {
  const { transactionId, image } = req.body;
  if (transactionId == null || !image || typeof image !== 'string') {
    return res.status(400).json({
      message: 'Missing transactionId or image (data URL, e.g. data:image/jpeg;base64,...).',
    });
  }
  const match = image.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!match) {
    return res.status(400).json({ message: 'Invalid image: expected data URL (base64).' });
  }
  const ext = match[1] === 'jpeg' || match[1] === 'jpg' ? 'jpg' : match[1];
  const base64 = match[2];
  try {
    await ensureDataDir();
    const transactions = await readTransactions();
    const index = transactions.findIndex((t) => t.id === transactionId);
    if (index === -1) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }
    const filename = `${transactionId}.${ext}`;
    const filePath = path.join(RECEIPTS_DIR, filename);
    await fs.writeFile(filePath, Buffer.from(base64, 'base64'));
    const receiptPath = `receipts/${filename}`;
    transactions[index] = {
      ...transactions[index],
      receiptPath,
      updatedAt: new Date().toISOString(),
    };
    await writeTransactions(transactions);
    res.status(201).json({
      receiptPath,
      url: `/api/receipts/files/${filename}`,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to save receipt image.' });
  }
});

app.use((req, res) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  res.status(404).json({ message: 'Not found' });
});

const PORT = process.env.PORT || 3000;
ensureDataDir()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error('Failed to start server:', e);
    process.exit(1);
  });
