import { useAppSelector, useAppDispatch } from '../../../app/hooks.ts';
import { setCurrency } from '../../ui/uiSlice.ts';
import type { CurrencyCode } from '../../ui/uiSlice.ts';
import { useGetTransactionsQuery } from '../../transactions/api/transactionsApi.ts';
import type { Transaction } from '../../transactions/model/types.ts';
import styles from './SettingsPage.module.css';
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';

const CURRENCIES: { value: CurrencyCode; label: string }[] = [
  { value: 'PLN', label: 'PLN' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
];

function downloadCsv(transactions: Transaction[]) {
  const headers = [
    'id',
    'type',
    'amount',
    'currency',
    'date',
    'categoryId',
    'merchant',
    'note',
    'createdAt',
  ];
  const rows = transactions.map((t) =>
    [
      t.id,
      t.type,
      t.amount,
      t.currency,
      t.date,
      t.categoryId,
      t.merchant ?? '',
      t.note ?? '',
      t.createdAt,
    ].join(','),
  );
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const currency = useAppSelector((s) => s.ui.currency);
  const { data: transactions = [] } = useGetTransactionsQuery();

  return (
    <div className={styles.page}>
      <Typography variant='h6' fontWeight={600} margin='10px 0'>
        Settings
      </Typography>

      <Stack spacing={1}>
        <Typography className={styles.sectionTitle}>Currency</Typography>
        <FormControl size='small'>
          <Select
            value={currency}
            onChange={(e) =>
              dispatch(setCurrency(e.target.value as CurrencyCode))
            }
          >
            {CURRENCIES.map((c) => (
              <MenuItem key={c.value} value={c.value}>
                {c.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Stack spacing={1}>
        <Typography className={styles.sectionTitle}>Data</Typography>
        <Typography
          variant="subtitle2"
          color="secondary"
          className={styles.description}
        >
          Export all transactions as CSV. Data is stored on the backend.
        </Typography>
        <Button
          variant="outlined"
          onClick={() => downloadCsv(transactions)}
        >
          Export CSV
        </Button>
      </Stack>
    </div>
  );
}
