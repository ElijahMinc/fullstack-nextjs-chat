import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

const withCheckUser =
  <T extends Record<string, unknown>>(Component: React.ComponentType<T>) =>
  (props: T): JSX.Element => {
    const { user } = useAuth();
    const router = useRouter();

    if (!user) {
      router.replace({
        pathname: '/auth',
        query: {
          type: 'login',
        },
      });
    }

    return <Component {...props} authUser={user as NonNullable<typeof user>} />;
  };

export default withCheckUser;
