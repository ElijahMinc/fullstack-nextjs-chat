import { AvatarUser } from '@/common/AvatarUser/AvatarUser';
import { useInterlocutorData } from '@/context/InterlocutorContext';
import { useUserByIdQuery } from '@/hooks/useUserByIdQuery';
import UserService from '@/services/UserService';
import { Nullable } from '@/types/Nullable';
import { User } from '@/types/user';
import Skeleton from '@mui/material/Skeleton';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface ConversationItemProps {
  interlocutorId: string;
  isOnline: boolean;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  interlocutorId,
  isOnline,
}) => {
  const { isLoading, isSuccess, isFetching, userData } = useUserByIdQuery({
    interlocutorId,
    uniqueHash: UserService.uniqueKeyUserById + `/${interlocutorId}`,
  });

  if (isLoading || isFetching) {
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
  console.log('isSuccess', isSuccess);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {userData?.avatarUrl && <AvatarUser url={userData.avatarUrl} />}
        <p
          style={{
            marginLeft: '10px',
          }}
        >
          {' '}
          {`${userData?.name} ${userData?.surname}`}
        </p>
      </div>

      {isOnline && <span>Online</span>}
    </div>
  );
};
