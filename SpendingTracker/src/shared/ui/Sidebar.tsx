import { useNavigate, useLocation } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsIcon from '@mui/icons-material/Settings';
import styles from './Sidebar.module.css';

const tabs = [
  { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/transactions', label: 'Transactions', icon: <ReceiptLongIcon /> },
  { to: '/scan', label: 'Scan Receipt', icon: <CameraAltIcon /> },
  { to: '/budgets', label: 'Budgets', icon: <AccountBalanceWalletIcon /> },
  { to: '/settings', label: 'Settings', icon: <SettingsIcon /> },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <List disablePadding>
        {tabs.map((t) => (
          <ListItemButton
            key={t.to}
            selected={location.pathname === t.to}
            onClick={() => navigate(t.to)}
            className={styles.item}
          >
            <ListItemIcon className={styles.icon}>{t.icon}</ListItemIcon>
            <ListItemText primary={t.label} />
          </ListItemButton>
        ))}
      </List>
    </aside>
  );
}
