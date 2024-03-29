import ChatService from '@/services/ChatService';
import { Chat } from '@/types/conversations';
import { User } from '@/types/user';
import { getUserIdsFromMembers } from '@/utils/getUserIdsFromMembers';
import { useState } from 'react';
import { useQuery } from 'react-query';

export const useChatsQuery = (userId: User['_id']) => {
  const [addedUserIds, setAddedUserIds] = useState<User['_id'][]>([]);
  const [chats, setChats] = useState<Chat[]>([]);

  const {
    isLoading,
    isSuccess,
    isError,
  } = useQuery(
    [ChatService.uniqueName],
    () => ChatService.getChatsByUserId(userId),
    {
      onSuccess: (chatsByUserId) => {
        if (!chatsByUserId) return;

        setChats(chatsByUserId);
        setAddedUserIds(getUserIdsFromMembers(chatsByUserId, userId));
      },
    }
  );

  return {
    chats,
    addedUserIds,
    isLoading,
    isSuccess,
    isError,
  };
};
