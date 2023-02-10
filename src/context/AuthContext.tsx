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
}

const AuthProviderContext = createContext<AuthProviderProps>(
  {} as AuthProviderProps
);

interface AuthProviderComponentProps {
  children: (value: {
    isAuth: AuthProviderProps['isAuth'];
    changeAuth: AuthProviderProps['changeAuth'];
  }) => JSX.Element;
}

export const AuthProvider = ({ children }: AuthProviderComponentProps) => {
  const router = useRouter();
  const [isAuth, setAuth] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  useEffect(() => {
    const authCheck = async () => {
      setLoading(true);

      const user = await AuthService.checkAuth({});

      if (!user) {
        setUser(user);
        setAuth(false);
        router.push({
          pathname: '/auth',
          query: { type: 'login' },
        });
        setLoading(false);
      } else {
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

  const value: AuthProviderProps = useMemo(
    () => ({
      user,
      changeAuth,
      isAuth,
    }),
    [isAuth]
  );

  return (
    <AuthProviderContext.Provider value={value}>
      {children({ isAuth, changeAuth })}
      {isLoading && <Loader />}
    </AuthProviderContext.Provider>
  );
};

export const useAuth = () => useContext(AuthProviderContext);
