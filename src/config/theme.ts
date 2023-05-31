import { createTheme } from '@mui/material';
import { orange } from '@mui/material/colors';

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    mode: 'dark',
    common: {},
    primary: {
      main: orange[500],
      light: '#ef0a0a',
      dark: '#662525',
      contrastText: '#fff',
    },
  },
});
