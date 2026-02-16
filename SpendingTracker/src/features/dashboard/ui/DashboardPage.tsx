import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../app/hooks.ts';
import { useGetTransactionsQuery } from '../../transactions/api/transactionsApi.ts';
import { setActiveMonth } from '../../ui/uiSlice.ts';
import { formatAmount } from '../../../shared/lib/currency.ts';
import { getCategoryLabel } from '../../../shared/constants/categories.ts';
import { getPrevMonth, getNextMonth } from '../../../shared/lib/date.ts';
import { MonthSwitcher } from '../../../shared/ui/MonthSwitcher.tsx';
import type { CurrencyCode } from '../../ui/uiSlice.ts';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const activeMonth = useAppSelector((s) => s.ui.activeMonth);
  const currency = useAppSelector((s) => s.ui.currency) as CurrencyCode;
  const { data: transactions = [], isLoading } = useGetTransactionsQuery(activeMonth);

  const spent = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const net = income - spent;

  const byCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce<Record<string, number>>((acc, t) => {
      const cat = t.categoryId || 'other';
      acc[cat] = (acc[cat] ?? 0) + t.amount;
      return acc;
    }, {});

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  return (
    <Box className={styles.page}>
      <Typography variant="h6" fontWeight={600} margin="10px 0">
        Dashboard
      </Typography>

      <MonthSwitcher
        monthKey={activeMonth}
        onPrev={() => dispatch(setActiveMonth(getPrevMonth(activeMonth)))}
        onNext={() => dispatch(setActiveMonth(getNextMonth(activeMonth)))}
      />

      {isLoading ? (
        <Typography variant="body2" color="text.secondary">
          Loading…
        </Typography>
      ) : (
        <>
          <Grid container spacing={1.5}>
            {/* Mobile: 2 in first row. Web: 3 in one row */}
            <Grid size={{ xs: 6, md: 4 }}>
              <Card variant="outlined" className={styles.cardSpent}>
                <CardContent className={styles.cardContent}>
                  <Typography variant="caption" color="text.secondary">
                    Total Spent
                  </Typography>
                  <Typography variant="h6" fontWeight={700} className={styles.amountError}>
                    {formatAmount(spent, currency)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <Card variant="outlined" className={styles.cardIncome}>
                <CardContent className={styles.cardContent}>
                  <Typography variant="caption" color="text.secondary">
                    Total Income
                  </Typography>
                  <Typography variant="h6" fontWeight={700} className={styles.amountSuccess}>
                    {formatAmount(income, currency)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" className={styles.cardNet}>
                <CardContent className={styles.cardContent}>
                  <Typography variant="caption" color="text.secondary">
                    Net Balance
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    className={net >= 0 ? styles.amountSuccess : styles.amountError}
                  >
                    {formatAmount(net, currency)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {Object.keys(byCategory).length > 0 && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Spending by category
                </Typography>
                <List dense disablePadding>
                  {Object.entries(byCategory)
                    .sort(([, a], [, b]) => b - a)
                    .map(([catId, amount]) => (
                      <ListItem key={catId} disablePadding className={styles.categoryItem}>
                        <ListItemText primary={getCategoryLabel(catId)} />
                        <Typography variant="body2" fontWeight={600} className={styles.amountError}>
                          {formatAmount(amount, currency)}
                        </Typography>
                      </ListItem>
                    ))}
                </List>
              </CardContent>
            </Card>
          )}

          <Card variant="outlined">
            <CardContent sx={{ '&:last-child': { pb: 2 } }}>
              <Box className={styles.sectionHeader}>
                <Typography variant="subtitle2" color="text.secondary">
                  Recent transactions
                </Typography>
                <Link component={RouterLink} to="/transactions" variant="body2">
                  View all
                </Link>
              </Box>
              <List dense disablePadding>
                {recent.length === 0 ? (
                  <ListItem>
                    <ListItemText
                      primary="No transactions this month"
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    />
                  </ListItem>
                ) : (
                  recent.map((t) => (
                    <ListItem
                      key={t.id}
                      disablePadding
                      className={styles.recentItem}
                    >
                      <ListItemText
                        primary={t.merchant || getCategoryLabel(t.categoryId) || '—'}
                        secondary={t.date}
                        primaryTypographyProps={{ fontWeight: 500 }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        className={t.type === 'expense' ? styles.amountError : styles.amountSuccess}
                      >
                        {formatAmount(t.amount, t.currency)}
                      </Typography>
                    </ListItem>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}
