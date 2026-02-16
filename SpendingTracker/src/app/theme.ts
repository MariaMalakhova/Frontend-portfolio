import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    error: { main: '#d32f2f' },
    success: { main: '#2e7d32' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          textTransform: 'none',
          padding: '0.375rem 1rem',
        },
      },
    },
  },
});
