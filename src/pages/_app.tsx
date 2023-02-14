import { Layout } from '@/components/Layout';
import type { AppProps } from 'next/app';
import { ThemeCustomProvider } from '@/context/ColorModeContext';
import { ToggleColorMode } from '@/components/ToggleColorMode/ToggleColorMode';
import { AuthProvider } from '@/context/AuthContext';
import Auth from './auth';

import '@/styles/globals.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeCustomProvider>
      <AuthProvider>
        {({ isAuth, changeAuth, setUser }) => (
          <Layout>
            <ToggleColorMode />
            {!isAuth ? (
              <Auth setIsAuth={changeAuth} setUser={setUser} />
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
