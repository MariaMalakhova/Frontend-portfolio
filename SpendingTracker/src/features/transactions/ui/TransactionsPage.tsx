import { useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks.ts';
import {
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} from '../api/transactionsApi.ts';
import { setActiveMonth, setFilters } from '../../ui/uiSlice.ts';
import { TransactionForm } from './TransactionForm.tsx';
import { formatAmount } from '../../../shared/lib/currency.ts';
import {
  CATEGORIES,
  getCategoryLabel,
} from '../../../shared/constants/categories.ts';
import type { Transaction, TransactionCreate } from '../model/types.ts';
import { MonthSwitcher } from '../../../shared/ui/MonthSwitcher.tsx';
import { getPrevMonth, getNextMonth } from '../../../shared/lib/date.ts';
import { useToast } from '../../../shared/ui/ToastContext.tsx';
import styles from './TransactionsPage.module.css';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  FormControl,
  IconButton,
  InputLabel,
  List,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog.tsx';

const SAVE_ERROR_MSG = 'Unable to save transaction. Please, try again later.';
const DELETE_ERROR_MSG =
  'Unable to delete transaction. Please, try again later.';

export function TransactionsPage() {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const activeMonth = useAppSelector((s) => s.ui.activeMonth);
  const filters = useAppSelector((s) => s.ui.filters);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: transactions = [], isLoading } = useGetTransactionsQuery();
  const [createTx, { isLoading: isCreating }] = useCreateTransactionMutation();
  const [updateTx, { isLoading: isUpdating }] = useUpdateTransactionMutation();
  const [deleteTx] = useDeleteTransactionMutation();

  const filtered = useMemo(() => {
    let list = transactions.filter(
      (t) => !activeMonth || t.date.startsWith(activeMonth),
    );
    if (filters.query.trim()) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (t) =>
          t.merchant?.toLowerCase().includes(q) ||
          t.note?.toLowerCase().includes(q) ||
          getCategoryLabel(t.categoryId).toLowerCase().includes(q),
      );
    }
    if (filters.categoryId) {
      list = list.filter((t) => t.categoryId === filters.categoryId);
    }
    if (filters.type) {
      list = list.filter((t) => t.type === filters.type);
    }
    return list.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [transactions, activeMonth, filters]);

  const handleSave = async (data: TransactionCreate) => {
    try {
      if (editing) {
        await updateTx({
          id: editing.id,
          body: {
            type: data.type,
            amount: data.amount,
            currency: data.currency,
            date: data.date,
            categoryId: data.categoryId,
            merchant: data.merchant,
            note: data.note,
          },
        }).unwrap();
      } else {
        await createTx(data).unwrap();
      }
      setFormOpen(false);
      setEditing(null);
    } catch {
      showToast(SAVE_ERROR_MSG);
    }
  };

  const handleEdit = (t: Transaction) => {
    setEditing(t);
    setFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmId(null);
  };

  const handleDeleteConfirm = async () => {
    const id = deleteConfirmId;
    if (!id) return;
    setDeleteConfirmId(null);
    try {
      await deleteTx(id).unwrap();
      if (editing?.id === id) {
        setFormOpen(false);
        setEditing(null);
      }
    } catch {
      showToast(DELETE_ERROR_MSG);
    }
  };

  return (
    <div className={styles.page}>
      <Typography variant='h6' fontWeight={600} margin='10px 0'>
        Transactions
      </Typography>

      <MonthSwitcher
        monthKey={activeMonth}
        onPrev={() => dispatch(setActiveMonth(getPrevMonth(activeMonth)))}
        onNext={() => dispatch(setActiveMonth(getNextMonth(activeMonth)))}
      />

      <div className={styles.filtersRow}>
        <input
          type='search'
          placeholder='Search merchant, note...'
          value={filters.query}
          onChange={(e) => dispatch(setFilters({ query: e.target.value }))}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filtersRow}>
        <FormControl sx={{ minWidth: 140 }} size='small'>
          <InputLabel id='type-label'>Type</InputLabel>
          <Select
            labelId='type-label'
            id='type-select'
            label='Type'
            value={filters.type ?? '__all__'}
            onChange={(e) => {
              const v = e.target.value;
              dispatch(
                setFilters({
                  type: v === '__all__' ? undefined : v,
                }),
              );
            }}
          >
            <MenuItem value=''>All types</MenuItem>
            <MenuItem value='expense'>Expense</MenuItem>
            <MenuItem value='income'>Income</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 140 }} size='small'>
          <InputLabel id='category-label'>Category</InputLabel>
          <Select
            labelId='category-label'
            id='category-select'
            label='Category'
            value={filters.categoryId ?? '__all__'}
            onChange={(e) => {
              const v = e.target.value;
              dispatch(
                setFilters({
                  categoryId: v === '__all__' ? undefined : v,
                }),
              );
            }}
          >
            <MenuItem value='__all__'>All categories</MenuItem>
            {CATEGORIES.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {formOpen ? (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>
            {editing ? 'Edit transaction' : 'New transaction'}
          </h2>
          <TransactionForm
            key={editing?.id ?? 'new'}
            initial={editing}
            onSave={handleSave}
            onCancel={() => {
              setFormOpen(false);
              setEditing(null);
            }}
            isUpdating={isCreating || isUpdating}
          />
        </div>
      ) : (
        <Button variant='contained' onClick={() => setFormOpen(true)}>
          + Add transaction
        </Button>
      )}

      {isLoading ? (
        <Typography className={styles.loading}>Loading…</Typography>
      ) : (
        <List className={styles.list}>
          {filtered.length === 0 ? (
            <Card sx={{ padding: 2 }}>No transactions match.</Card>
          ) : (
            filtered.map((t) => (
              <Card key={t.id} className={styles.item}>
                <CardActionArea
                  onClick={() => handleEdit(t)}
                  sx={{ marginRight: 2 }}
                >
                  <CardContent>
                    <Typography variant='h6' fontWeight={600}>
                      {t.merchant || getCategoryLabel(t.categoryId) || '—'}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {t.date} · {getCategoryLabel(t.categoryId)}
                    </Typography>
                  </CardContent>
                </CardActionArea>

                <Typography
                  variant='h6'
                  fontWeight={600}
                  className={
                    t.type === 'expense'
                      ? styles.amountExpense
                      : styles.amountIncome
                  }
                >
                  {formatAmount(t.amount, t.currency)}
                </Typography>
                <CardActions>
                  <IconButton
                    aria-label='delete'
                    onClick={() => handleDeleteClick(t.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))
          )}
        </List>
      )}

      <ConfirmDialog
        open={deleteConfirmId !== null}
        onClose={handleDeleteConfirmClose}
        onConfirm={handleDeleteConfirm}
        title='Delete transaction?'
        description='This action cannot be undone.'
        confirmLabel='Delete'
        cancelLabel='Cancel'
        confirmColor='error'
      />
    </div>
  );
}
