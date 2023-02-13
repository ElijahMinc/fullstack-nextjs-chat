import { Layout } from '@/components/Layout';
import type { AppProps } from 'next/app';

import Auth from './auth';
import { ThemeCustomProvider } from '@/context/ColorModeContext';
import { ToggleColorMode } from '@/components/ToggleColorMode/ToggleColorMode';
import { AuthProvider } from '@/context/AuthContext';
import ChatLayout from '@/components/ChatLayout/ChatLayout';

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
              // <ChatLayout>
              <Component {...pageProps} />
              // </ChatLayout>
            )}
          </Layout>
        )}
      </AuthProvider>
    </ThemeCustomProvider>
  );
};

export default App;
