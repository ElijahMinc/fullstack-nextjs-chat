import { useInterlocutorData } from '@/context/InterlocutorContext';
import ChatService from '@/services/ChatService';
import MessageService, {
  AddNewMessageRequest,
} from '@/services/MessageService';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';

export const useMessagesMutation = () => {
  const queryClient = useQueryClient();
  const route = useRouter();

  const { handleSelectedChat } = useInterlocutorData();

  const mutation = useMutation(
    (newMessage: AddNewMessageRequest) =>
      MessageService.addNewMessage(newMessage),
    {
      onSuccess: async (fetchedMessageData) => {
        if (!fetchedMessageData?.isNewChatCreated) return;
        if (!fetchedMessageData.message.chatId) return;

        route.push({
          query: {
            chatId: fetchedMessageData.message.chatId,
          },
        });

        const currentChat = await ChatService.getChatById(
          fetchedMessageData.message.chatId
        );

        if (!currentChat) {
          handleSelectedChat(null);
          return;
        }

        handleSelectedChat(currentChat);

        queryClient.invalidateQueries(ChatService.uniqueName);
      },
    }
  );

  return mutation;
};
