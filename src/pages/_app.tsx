import { Layout } from '@/components/Layout';
import type { AppProps } from 'next/app';
import { useEffect, useState, useCallback } from 'react';

import '@/styles/globals.css';
import { useRouter } from 'next/router';
import Auth from './auth';
import { ThemeCustomProvider } from '@/context/ColorModeContext';
import { ToggleColorMode } from '@/components/ToggleColorMode/ToggleColorMode';
import AuthService from '@/services/AuthService';
import { Loader } from '@/common/Loader/Loader';
import { AuthProvider } from '@/context/AuthContext';

const getRandomError = () => {
  const errors = [false, true, true, false];

  return errors[Math.floor(Math.random() * errors.length)];
};

const getUser = async () => {
  try {
    const request = await fetch('api/user');
    const response = await request.json();
    const someError = getRandomError();

    if (someError) {
      throw new Error('error');
    }

    return response;
  } catch {
    return null;
  }
};

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeCustomProvider>
      <AuthProvider>
        {({ isAuth, changeAuth }) => (
          <Layout>
            <ToggleColorMode />
            {!isAuth ? (
              <Auth setIsAuth={changeAuth} />
            ) : (
              <Component {...pageProps} />
            )}
          </Layout>
        )}
      </AuthProvider>
    </ThemeCustomProvider>
  );
};

export default App;
