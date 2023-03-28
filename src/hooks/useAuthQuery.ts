import AuthService from '@/services/AuthService';
import { Nullable } from '@/types/Nullable';
import { User } from '@/types/user';
import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';
import { useQuery } from 'react-query';

export const useAuthQuery = () => {
  const router = useRouter();
  const [isAuth, setAuth] = useState(false);
  const [user, setUser] = useState<Nullable<User>>(null);

  const changeAuth = useCallback(() => setAuth(true), []);

  const { isLoading, isSuccess, isError } = useQuery(
    [AuthService.uniqueName],
    () => AuthService.checkAuth(),
    {
      onSuccess: (user) => {
        if (!user) {
          setAuth(false);
          router.push({
            pathname: '/auth',
            query: { type: 'login' },
          });
        } else {
          setAuth(true);
          router.push({
            pathname: router.pathname === '/auth' ? '/' : router.pathname,
          });
        }
        setUser(user);
      },
      select: (data) => data,
    }
  );

  const logoutAuth = useCallback(async () => {
    await AuthService.logout();
    setAuth(false);
    setUser(null);
    router.push({
      pathname: '/auth',
      query: { type: 'login' },
    });
  }, []);

  return {
    user,
    setUser,
    isAuth,
    changeAuth,
    isLoading,
    isSuccess,
    isError,
    logoutAuth,
  };
};
