import { logout } from '@/api/AuthRequests';
import { Loader } from '@/common/Loader/Loader';
import AuthService from '@/services/AuthService';
import { useRouter } from 'next/router';
import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from 'react';

export interface AuthProviderProps {
  user: any;
  isAuth: boolean;
  changeAuth: () => void;
  handleSetUser: (user: any) => void;
  logoutAuth: () => void;
}

const AuthProviderContext = createContext<AuthProviderProps>(
  {} as AuthProviderProps
);

interface AuthProviderComponentProps {
  children: (value: {
    isAuth: AuthProviderProps['isAuth'];
    changeAuth: AuthProviderProps['changeAuth'];
    setUser: (user: any) => void;
  }) => JSX.Element;
}

export const AuthProvider = ({ children }: AuthProviderComponentProps) => {
  const router = useRouter();
  const [isAuth, setAuth] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const authCheck = async () => {
      setLoading(true);

      const user = await AuthService.checkAuth({});
      console.log('user', user);
      if (!user) {
        setAuth(false);
        router.push({
          pathname: '/auth',
          query: { type: 'login' },
        });
        setLoading(false);
      } else {
        setUser(user);
        setAuth(true);
        router.push({
          pathname: '/',
        });
        setLoading(false);
      }
    };

    authCheck();
  }, []);

  const changeAuth = useCallback(() => setAuth(true), []);

  const handleSetUser = useCallback((user: any) => setUser(user), []);

  const logoutAuth = useCallback(async () => {
    await logout();
    setAuth(false);
    setUser(null);
    router.push({
      pathname: '/auth',
      query: { type: 'login' },
    });
  }, []);

  const value: AuthProviderProps = useMemo(
    () => ({
      user,
      changeAuth,
      handleSetUser,
      isAuth,
      logoutAuth,
    }),
    [isAuth]
  );

  return (
    <AuthProviderContext.Provider value={value}>
      {children({ isAuth, changeAuth, setUser })}
      {isLoading && <Loader />}
    </AuthProviderContext.Provider>
  );
};

export const useAuth = () => useContext(AuthProviderContext);
