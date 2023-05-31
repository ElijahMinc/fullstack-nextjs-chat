import React, { useContext, useEffect } from 'react';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { createContext, useMemo, useState } from 'react';
import {
  LocalStorageKeys,
  LocalStorageService,
} from '@/services/LocalStorageService';
import { CssBaseline, PaletteMode } from '@mui/material';
import { amber, deepOrange, grey, orange } from '@mui/material/colors';
import { setCookie, getCookie } from 'cookies-next';

export interface ThemedProviderProps {
  handleToggleTheme: () => void;
  toggleTheme: PaletteMode | undefined;
}
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    dashed: true;
  }
}

const defaultThemeLight = createTheme({
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'dashed' },
          style: {
            textTransform: 'none',
            border: `2px dashed ${deepOrange}`,
            color: '#fff',
          },
        },
        {
          props: { variant: 'dashed', size: 'large' },
          style: {
            borderWidth: 4,
          },
        },
        {
          props: { variant: 'dashed', color: 'secondary', size: 'large' },
          style: {
            fontSize: 18,
          },
        },
      ],
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        // size: 'small',
        sx: {},
        InputLabelProps: {
          // fontSize: '10px',
          sx: {
            height: '5px',
            fontWeight: 600,
            fontSize: '15px',
            lineHeight: '26px',
            color: '#0C1628',
            opacity: '0.5',
          },
        },
        InputProps: {
          sx: {
            height: '10px',
            fontWeight: 600,
            fontSize: '20px',
            lineHeight: '26px',
            color: '#0C1628',
            opacity: '0.5',
          },

          // disableUnderline: true,
        },
      },
    },
    // TextField: {
    //   styleOverrides: {
    //     // Name of the slot
    //     defaultProps: {
    //       // The props to change the default for.
    //       // size: 'small', // No more ripple, on the whole application 💣!
    //     },
    //     root: {
    //       // Some CSS
    //       fontSize: '15px',
    //     },
    //   },
    // },
  },
});

const defaultThemeDark = createTheme({
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'dashed' },
          style: {
            textTransform: 'none',
            border: `2px dashed ${deepOrange}`,
            color: '#fff',
          },
        },
        {
          props: { variant: 'dashed', size: 'large' },
          style: {
            borderWidth: 4,
          },
        },
        {
          props: { variant: 'dashed', color: 'secondary', size: 'large' },
          style: {
            fontSize: 18,
          },
        },
      ],
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        sx: {},
        InputLabelProps: {
          sx: {
            fontWeight: 600,
            fontSize: '15px',
            lineHeight: '26px',
            color: amber,
            opacity: '0.5',
          },
          size: 'small',
        },
        InputProps: {
          sx: {
            fontWeight: 600,
            fontSize: '20px',
            lineHeight: '26px',
            color: amber,
            opacity: '0.5',
          },
          size: 'small',
          // disableUnderline: true,
        },
      },
    },
  },
});

const getDesignTokens = (mode: PaletteMode) => ({
  ...(mode === 'light'
    ? {
        ...defaultThemeLight,
      }
    : {
        ...defaultThemeDark,
      }),

  palette: {
    mode,
    ...(mode === 'light'
      ? {}
      : {}),
  },
  typography: {
    fonSize: '15px',
    button: {
      fontSize: '10px',
    },
  },
});

const ThemedProviderContext = createContext<ThemedProviderProps>(
  {} as ThemedProviderProps
);

interface ThemedProverProps {
  children: React.ReactNode;
}

export const ThemeCustomProvider = ({ children }: ThemedProverProps) => {
  const [toggleTheme, setToggleTheme] = useState<PaletteMode>('light');

  useEffect(() => {
    const themeFromLocalStorage = LocalStorageService.get<PaletteMode>(
      LocalStorageKeys.THEME
    );
    setToggleTheme(themeFromLocalStorage ?? 'light');
  }, []);

  const handleToggleTheme = () => {
    setToggleTheme((prevTheme) => {
      const currentTheme = prevTheme === 'light' ? 'dark' : 'light';
      setCookie('theme', currentTheme);
      LocalStorageService.set(LocalStorageKeys.THEME, currentTheme);

      return currentTheme;
    });
  };

  const value: ThemedProviderProps = useMemo(
    () => ({
      handleToggleTheme,
      toggleTheme,
    }),
    [toggleTheme]
  );

  const theme = React.useMemo(
    () => createTheme(getDesignTokens(toggleTheme)),
    [toggleTheme]
  );

  return (
    <ThemedProviderContext.Provider value={value}>
      <CssBaseline />
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemedProviderContext.Provider>
  );
};

export const useCustomTheme = () => useContext(ThemedProviderContext);
