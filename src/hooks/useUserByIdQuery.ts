import { useInterlocutorData } from '@/context/InterlocutorContext';
import {
  LocalStorageKeys,
  LocalStorageService,
} from '@/services/LocalStorageService';
import MessageService from '@/services/MessageService';
import UserService from '@/services/UserService';
import { Chat } from '@/types/conversations';
import { Nullable } from '@/types/Nullable';
import { User } from '@/types/user';
import { useState } from 'react';
import { useQuery } from 'react-query';

export const useUserByIdQuery = ({
  interlocutorId,
  uniqueHash,
  enabled = true,
}: {
  interlocutorId: User['_id'];
  uniqueHash: string;
  enabled?: boolean;
}) => {
  const [userData, setUserData] = useState<Nullable<User>>(null);

  const { isLoading, isFetching, isSuccess, isError } = useQuery(
    [uniqueHash],
    () => UserService.getUserById(interlocutorId),
    {
      onSuccess: (user) => {
        setUserData(user);
      },
      enabled: enabled && !!interlocutorId,
    }
  );

  return {
    userData,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  };
};
