import { getUser } from '@/api/UserRequests';
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
  const [userData, setUserData] = useState<any>({});

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await getUser(interlocutorId);
        setUserData(data);
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
