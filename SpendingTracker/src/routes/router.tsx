import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from './AppShell.tsx';
import { DashboardPage } from '../features/dashboard/ui/DashboardPage.tsx';
import { TransactionsPage } from '../features/transactions/ui/TransactionsPage.tsx';
import { ScanPage } from '../features/scan/ui/ScanPage.tsx';
import { BudgetsPage } from '../features/budgets/ui/BudgetsPage.tsx';
import { SettingsPage } from '../features/settings/ui/SettingsPage.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'scan', element: <ScanPage /> },
      { path: 'budgets', element: <BudgetsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);
