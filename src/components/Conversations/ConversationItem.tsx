import UserService from '@/services/UserService';
import { Nullable } from '@/types/Nullable';
import { User } from '@/types/user';
import Skeleton from '@mui/material/Skeleton';
import React, { useEffect, useState } from 'react';

interface ConversationItemProps {
  interlocutorId: string;
  isOnline: boolean;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  interlocutorId,
  isOnline,
}) => {
  const [isLoading, setLoading] = useState(true);
  const [userData, setUserData] = useState<Nullable<User>>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const user = await UserService.getUserById(interlocutorId);
        console.log('user', user);
        setUserData(user);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  if (isLoading) {
    return (
      <Skeleton
        variant="rounded"
        width="100%"
        height="100%"
        sx={{
          minHeight: '40px',
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {userData?.email}
      {isOnline && <span>Online</span>}
    </div>
  );
};
