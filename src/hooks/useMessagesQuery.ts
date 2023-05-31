import { useInterlocutorData } from '@/context/InterlocutorContext';
import MessageService from '@/services/MessageService';
import { Chat } from '@/types/conversations';
import { Message } from '@/types/message';
import { useState } from 'react';
import { useQuery } from 'react-query';

export const useMessagesQuery = (chatId: Chat['_id']) => {
  const { selectedChat } = useInterlocutorData();
  const [messages, setMessages] = useState<any[]>([]);

  const { isLoading, isSuccess, isError } = useQuery(
    [selectedChat],
    () => MessageService.getAllMessageByChatId(chatId),
    {
      onSuccess: (messages) => {
        if (!messages) {
          setMessages([]);

          return;
        }

        setMessages(messages);
      },
      enabled: !!selectedChat,
    }
  );

  return {
    messages,
    setMessages,
    isLoading,
    isSuccess,
    isError,
  };
};
