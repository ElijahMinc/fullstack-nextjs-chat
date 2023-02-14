import { Loader } from '@/common/Loader/Loader';
import AuthService from '@/services/AuthService';
import { Nullable } from '@/types/Nullable';
import { User } from '@/types/user';
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
  user: Nullable<User>;
  isAuth: boolean;
  changeAuth: () => void;
  handleSetUser: (user: User) => void;
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
  const [user, setUser] = useState<Nullable<User>>(null);

  useEffect(() => {
    const authCheck = async () => {
      setLoading(true);

      const user = await AuthService.checkAuth({});

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
          pathname: router.pathname === '/auth' ? '/' : router.pathname,
        });
        setLoading(false);
      }
    };

    authCheck();
  }, []);

  const changeAuth = useCallback(() => setAuth(true), []);

  const handleSetUser = useCallback((user: User) => setUser(user), []);

  const logoutAuth = useCallback(async () => {
    await AuthService.logout();
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
