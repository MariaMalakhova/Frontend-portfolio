import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsIcon from '@mui/icons-material/Settings';
import styles from './BottomTabs.module.css';

const tabs = [
  { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/transactions', label: 'Transactions', icon: <ReceiptLongIcon /> },
  { to: '/scan', label: 'Scan', icon: <CameraAltIcon /> },
  { to: '/budgets', label: 'Budgets', icon: <AccountBalanceWalletIcon /> },
  { to: '/settings', label: 'Settings', icon: <SettingsIcon /> },
];

export function BottomTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const value = tabs.findIndex((t) => t.to === location.pathname);

  return (
    <Paper className={styles.nav} elevation={3}>
      <BottomNavigation
        showLabels
        value={value >= 0 ? value : 0}
        onChange={(_, newValue) => navigate(tabs[newValue].to)}
        className={styles.navInner}
      >
        {tabs.map((t) => (
          <BottomNavigationAction
            key={t.to}
            label={t.label}
            icon={t.icon}
            className={styles.action}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
