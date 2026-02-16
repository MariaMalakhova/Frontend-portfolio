import { useState } from 'react';
import type { CurrencyCode, Transaction, TransactionCreate, TransactionType } from '../model/types.ts';
import { CATEGORIES } from '../../../shared/constants/categories.ts';
import styles from './TransactionForm.module.css';

interface TransactionFormProps {
  initial?: Partial<Transaction> | null;
  onSave: (data: TransactionCreate) => void;
  onCancel: () => void;
  isUpdating: boolean,
}

const defaultValues: TransactionCreate = {
  type: 'expense',
  amount: 0,
  currency: 'PLN',
  date: new Date().toISOString().slice(0, 10),
  categoryId: 'other',
  merchant: null,
  note: null,
};

export function TransactionForm({
  initial,
  onSave,
  onCancel,
  isUpdating,
}: Readonly<TransactionFormProps>) {
  const [type, setType] = useState<TransactionType>(initial?.type ?? 'expense');
  const [amount, setAmount] = useState(
    initial?.amount != null ? String(initial.amount) : ''
  );
  const [currency, setCurrency] = useState(initial?.currency ?? 'PLN');
  const [date, setDate] = useState(initial?.date ?? defaultValues.date);
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? 'other'
  );
  const [merchant, setMerchant] = useState(initial?.merchant ?? '');
  const [note, setNote] = useState(initial?.note ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number.parseFloat(amount);
    if (Number.isNaN(num) || num < 0) return;
    onSave({
      type,
      amount: num,
      currency: currency as TransactionCreate['currency'],
      date,
      categoryId,
      merchant: merchant.trim() || null,
      note: note.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="type" className={styles.label}>Type</label>
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as TransactionType)}
          className={styles.select}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="amount" className={styles.label}>Amount *</label>
        <input
          name="amount"
          type="number"
          step="0.01"
          min="0"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.fieldGroup}>
        <div className={styles.field}>
          <label htmlFor="currency" className={styles.label}>Currency</label>
          <select
          name="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className={styles.select}
          >
            <option value="PLN">PLN</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="date" className={styles.label}>Date *</label>
          <input
            name="date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="category" className={styles.label}>Category</label>
        <select
          name="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={styles.select}
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="merchant" className={styles.label}>Merchant</label>
        <input
          name="merchant"
          type="text"
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
          placeholder="e.g. Biedronka"
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="note" className={styles.label}>Note</label>
        <input
          name="note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional"
          className={styles.input}
        />
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </button>
        <button type="submit" className={styles.submitButton}>
          {isUpdating ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}
