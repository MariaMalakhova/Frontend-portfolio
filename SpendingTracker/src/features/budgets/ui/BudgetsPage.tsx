import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks.ts';
import { useGetTransactionsQuery } from '../../transactions/api/transactionsApi.ts';
import { formatAmount } from '../../../shared/lib/currency.ts';
import { getCategoryLabel } from '../../../shared/constants/categories.ts';
import { CATEGORIES } from '../../../shared/constants/categories.ts';
import type { CurrencyCode } from '../../ui/uiSlice.ts';
import { MonthSwitcher } from '../../../shared/ui/MonthSwitcher.tsx';
import { getPrevMonth, getNextMonth } from '../../../shared/lib/date.ts';
import { setActiveMonth } from '../../ui/uiSlice.ts';
import styles from './BudgetsPage.module.css';
import { List, Typography } from '@mui/material';

const BUDGETS_KEY = 'spending-tracker-budgets';

function getStoredBudgets(month: string): Record<string, number> {
  try {
    const raw = localStorage.getItem(BUDGETS_KEY);
    if (!raw) return {};
    const all = JSON.parse(raw) as Record<string, Record<string, number>>;
    return all[month] ?? {};
  } catch {
    return {};
  }
}

function setStoredBudgets(month: string, budgets: Record<string, number>) {
  try {
    const raw = localStorage.getItem(BUDGETS_KEY);
    const all = (raw ? JSON.parse(raw) : {}) as Record<
      string,
      Record<string, number>
    >;
    all[month] = budgets;
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(all));
  } catch (e) {
    console.error(e);
  }
}

export function BudgetsPage() {
  const dispatch = useAppDispatch();
  const activeMonth = useAppSelector((s) => s.ui.activeMonth);
  const currency = useAppSelector((s) => s.ui.currency) as CurrencyCode;
  const { data: transactions = [] } = useGetTransactionsQuery(activeMonth);

  const [budgets, setBudgets] = useState<Record<string, number>>(() =>
    getStoredBudgets(activeMonth)
  );

  useEffect(() => {
    setBudgets(getStoredBudgets(activeMonth));
  }, [activeMonth]);

  const spentByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce<Record<string, number>>((acc, t) => {
      const cat = t.categoryId || 'other';
      acc[cat] = (acc[cat] ?? 0) + t.amount;
      return acc;
    }, {});

  const updateBudget = (categoryId: string, limit: number) => {
    const next = { ...budgets, [categoryId]: limit };
    setBudgets(next);
    setStoredBudgets(activeMonth, next);
  };

  return (
    <div className={styles.page}>
      <Typography variant="h6" fontWeight={600} margin="10px 0">
        Budgets
      </Typography>

      <MonthSwitcher
        monthKey={activeMonth}
        onPrev={() => dispatch(setActiveMonth(getPrevMonth(activeMonth)))}
        onNext={() => dispatch(setActiveMonth(getNextMonth(activeMonth)))}
      />

      <p className={styles.intro}>Set limits per category for this month.</p>

      <List className={styles.list}>
        {CATEGORIES.map((cat) => {
          const spent = spentByCategory[cat.id] ?? 0;
          const limit = budgets[cat.id] ?? 0;
          const pct = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
          const over = limit > 0 && spent > limit;

          return (
            <li key={cat.id} className={styles.item}>
              <div className={styles.itemHeader}>
                <span className={styles.itemTitle}>
                  {getCategoryLabel(cat.id)}
                </span>
                <span className={styles.itemMeta}>
                  {formatAmount(spent, currency)} /{' '}
                  {limit > 0 ? formatAmount(limit, currency) : '—'}
                </span>
              </div>
              <div className={styles.progressTrack}>
                <div
                  className={`${styles.progressBar} ${over ? styles.over : styles.under}`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Budget limit"
                value={limit > 0 ? limit : ''}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  updateBudget(cat.id, Number.isNaN(v) || v < 0 ? 0 : v);
                }}
                className={styles.budgetInput}
              />
            </li>
          );
        })}
      </List>
    </div>
  );
}
