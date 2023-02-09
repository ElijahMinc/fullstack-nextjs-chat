import React, { useContext, useEffect } from 'react';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { createContext, useMemo, useState } from 'react';
import {
  LocalStorageKeys,
  LocalStorageService,
} from '@/services/LocalStorageService';
import { CssBaseline, PaletteMode } from '@mui/material';
import { amber, deepOrange, grey } from '@mui/material/colors';
import { setCookie, getCookie } from 'cookies-next';

export interface ThemedProviderProps {
  handleToggleTheme: () => void;
  toggleTheme: PaletteMode | undefined;
}

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          // primary: amber,
          // divider: amber[200],
          // text: {
          //   primary: grey[900],
          //   secondary: grey[800],
          // },
        }
      : {
          // palette values for dark mode
          // primary: deepOrange,
          // divider: deepOrange[700],
          // background: {
          //   default: deepOrange[900],
          //   paper: deepOrange[900],
          // },
          // text: {
          //   primary: '#fff',
          //   secondary: grey[500],
          // },
        }),
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
