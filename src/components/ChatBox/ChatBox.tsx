import { TextInput } from '@/common/TextInput/TextInput';
import { socket } from '@/config/socket';
import { useAuth } from '@/context/AuthContext';
import { useInterlocutorData } from '@/context/InterlocutorContext';
import ChatService from '@/services/ChatService';
import MessageService, {
  AddNewMessageRequest,
} from '@/services/MessageService';
import { Message } from '@/types/message';
import { SOCKET_EMIT_KEYS, SOCKET_ON_KEYS } from '@/types/socket';
import { styled } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState, memo } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Messages } from '../Messages/Messages';

const ContainerChat = styled('div')(({ theme }) => ({
  width: '100%',
  // maxWidth: '900px',
  height: '100%',
  display: 'flex',
  // margin: '0 auto',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
}));

const ChatBox = memo(() => {
  const queryClient = useQueryClient();
  const route = useRouter();
  const { user } = useAuth();
  const { interlocutorData, selectedChat, handleSelectedChat } =
    useInterlocutorData();
  const mutation = useMutation(
    (newMessage: AddNewMessageRequest) =>
      MessageService.addNewMessage(newMessage),
    {
      onSuccess: async (fetchedMessageData) => {
        if (!fetchedMessageData?.isNewChatCreated) return;
        route.push({
          query: {
            chatId: fetchedMessageData.message.chatId,
          },
        });
        const currentChat = await ChatService.getChatById(
          fetchedMessageData.message.chatId ?? ''
        );

        if (!currentChat) return;

        handleSelectedChat(currentChat);

        queryClient.invalidateQueries(ChatService.uniqueName);
      },
    }
  );
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);

      return;
    }

    const fetchMessages = async () => {
      try {
        const messages = await MessageService.getAllMessageByChatId(
          selectedChat._id
        );
        if (!messages) return;

        setMessages(messages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  const handleSend = async (text: string) => {
    if (!user) return;
    if (!interlocutorData) return;

    const message: AddNewMessageRequest = {
      senderId: user._id,
      receiverId: interlocutorData._id,
      chatId: selectedChat?._id ?? null,
      authorName: `${user.name} ${user.surname}`,
      text,
    };
    const receiverId =
      selectedChat?.members?.find((id: any) => id !== user._id) ??
      interlocutorData._id;

    const fetchedMessageData = await mutation.mutateAsync(message);

    if (!fetchedMessageData) return;

    setMessages([...messages, fetchedMessageData.message]);

    socket.emit(SOCKET_EMIT_KEYS['NEW:MESSAGE:ADD'], {
      ...message,
      receiverId,
    });
  };

  useEffect(() => {
    socket.on(SOCKET_ON_KEYS['RECEIVE:MESSAGE'], async (receivedMessage) => {
      console.log('receivedMessage', receivedMessage);
      if (!selectedChat) {
        queryClient.invalidateQueries(ChatService.uniqueName);
      }

      if (receivedMessage.chatId !== selectedChat?._id) return;

      setMessages([...messages, receivedMessage]);
    });
  }, [selectedChat, messages]);

  return (
    <ContainerChat>
      {interlocutorData ? (
        <>
          <Messages messages={messages} currentUserId={user?._id ?? ''} />
          <TextInput handleSend={handleSend} />
        </>
      ) : (
        <span className="chatbox-empty-message">
          Tap on a chat to start conversation...
        </span>
      )}
    </ContainerChat>
  );
});

export default ChatBox;
