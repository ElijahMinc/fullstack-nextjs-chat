import { Layout } from '@/components/Layout';
import type { AppProps } from 'next/app';
import { ThemeCustomProvider } from '@/context/ColorModeContext';
import { ToggleColorMode } from '@/components/ToggleColorMode/ToggleColorMode';
import { AuthProvider } from '@/context/AuthContext';
import Auth from './auth';

import '@/styles/globals.css';
import { useState } from 'react';
import { QueryClient, QueryClientProvider, Hydrate } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

export const QueryClientWithConfig = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

const App = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(QueryClientWithConfig);
  console.log('here');
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
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
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
