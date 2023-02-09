import { Layout } from '@/components/Layout';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';

import '@/styles/globals.css';
import { useRouter } from 'next/router';
import Auth from './auth';
import { ThemeCustomProvider } from '@/context/ColorModeContext';
import { ToggleColorMode } from '@/components/ToggleColorMode/ToggleColorMode';

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
  const router = useRouter();
  const [isAuth, setAuth] = useState(false);

  useEffect(() => {
    authCheck();

    const hideContent = () => setAuth(false);

    router.events.on('routeChangeComplete', hideContent);

    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);

  async function authCheck() {
    const user = await getUser();

    if (!user) {
      setAuth(false);
      router.push({
        pathname: '/auth',
        query: { type: 'login' },
      });
    } else {
      setAuth(true);
      router.push({
        pathname: '/',
        query: { returnUrl: router.asPath },
      });
    }
  }

  return (
    <ThemeCustomProvider>
      <Layout>
        <ToggleColorMode />
        {!isAuth ? <Auth /> : <Component {...pageProps} />}
      </Layout>
    </ThemeCustomProvider>
  );
};

export default App;
