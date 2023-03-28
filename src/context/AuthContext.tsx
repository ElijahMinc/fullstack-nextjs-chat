import { Loader } from '@/common/Loader/Loader';
import { useAuthQuery } from '@/hooks/useAuthQuery';
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
  const { user, setUser, isLoading, changeAuth, isAuth, logoutAuth } =
    useAuthQuery();

  const handleSetUser = useCallback((user: User) => setUser(user), []);

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
