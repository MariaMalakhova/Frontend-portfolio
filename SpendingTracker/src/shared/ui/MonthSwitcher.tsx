import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { formatMonthLabel } from '../lib/date.ts';
import styles from './MonthSwitcher.module.css';

interface MonthSwitcherProps {
  monthKey: string;
  onPrev: () => void;
  onNext: () => void;
}

export function MonthSwitcher({ monthKey, onPrev, onNext }: MonthSwitcherProps) {
  return (
    <Paper variant="outlined" className={styles.root}>
      <IconButton size="small" onClick={onPrev} aria-label="Previous month">
        <ChevronLeftIcon />
      </IconButton>
      <Typography variant="subtitle1" fontWeight={600}>
        {formatMonthLabel(monthKey)}
      </Typography>
      <IconButton size="small" onClick={onNext} aria-label="Next month">
        <ChevronRightIcon />
      </IconButton>
    </Paper>
  );
}
