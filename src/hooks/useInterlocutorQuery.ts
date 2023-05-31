import { useAuth } from '@/context/AuthContext';
import ChatService from '@/services/ChatService';
import UserService from '@/services/UserService';
import { Chat } from '@/types/conversations';
import { Nullable } from '@/types/Nullable';
import { User } from '@/types/user';
import { getUserIdsFromMembers } from '@/utils/getUserIdsFromMembers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

export const useInterlocutorQuery = () => {
  const route = useRouter();

  const { user } = useAuth();
  const [interlocutorData, setInterlocutorData] =
    useState<Nullable<User>>(null);

  const [selectedChat, setSelectedChat] = useState<Nullable<Chat>>(null);

  const { isLoading, isSuccess, isError } = useQuery(
    [UserService.uniqueKeyUserById, selectedChat],
    () => {
      if (!selectedChat) return;
      if (!user) return;

      const userId =
        selectedChat?.members.find((id: string) => id !== user?._id) ?? '';

      return UserService.getUserById(userId);
    },
    {
      onSuccess: (interlocutorData) => {
        console.log('interlocutorData,', interlocutorData);
        if (!selectedChat) return;
        if (!interlocutorData) {
          setInterlocutorData(null);

          return;
        }

        setInterlocutorData(interlocutorData);

        route.push({
          query: {
            chatId: selectedChat._id,
          },
        });
      },
      enabled: !!selectedChat && !!user,
    }
  );

  useEffect(() => {
    const selectedChatFromLocalStorage = localStorage.getItem('selectedChat')
      ? JSON.parse(localStorage.getItem('selectedChat') as string)
      : null;
    if (!!selectedChatFromLocalStorage) {
      setSelectedChat(selectedChatFromLocalStorage);
    }
  }, []);

  const handleInterlocutorData = (data: Nullable<User>) =>
    setInterlocutorData(data);

  const handleSelectedChat = (chat: Nullable<Chat>) => {
    if (!chat) {
      localStorage.removeItem('selectedChat');
    } else {
      localStorage.setItem('selectedChat', JSON.stringify(chat));
    }

    setSelectedChat(chat);
  };

  return {
    interlocutorData,
    handleInterlocutorData,
    selectedChat,
    handleSelectedChat,
    isLoading,
    isSuccess,
    isError,
  };
};
