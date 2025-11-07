import { createTheme } from '@mui/material/styles';

// Theme configuration based on mockup colors
export const theme = createTheme({
  palette: {
    primary: {
      main: '#2563EB', // Blue from mockup
      dark: '#1E40AF',
      light: '#3B82F6',
    },
    secondary: {
      main: '#EF4444', // Red for discounts/badges
    },
    success: {
      main: '#10B981', // Green for "Nuevo" badge
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 8,
  },
});
