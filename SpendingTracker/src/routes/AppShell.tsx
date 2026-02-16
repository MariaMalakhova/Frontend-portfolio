import { Outlet } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { BottomTabs } from '../shared/ui/BottomTabs.tsx';
import { Sidebar } from '../shared/ui/Sidebar.tsx';
import styles from './AppShell.module.css';

export function AppShell() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <div className={isDesktop ? styles.wrapperDesktop : styles.wrapper}>
      {isDesktop && <Sidebar />}
      <main className={isDesktop ? styles.mainDesktop : styles.main}>
        <Outlet />
      </main>
      {!isDesktop && <BottomTabs />}
    </div>
  );
}
