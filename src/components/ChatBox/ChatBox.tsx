import { TextInput } from '@/common/TextInput/TextInput';
import { socket } from '@/config/socket';
import { useAuth } from '@/context/AuthContext';
import { useInterlocutorData } from '@/context/InterlocutorContext';
import ChatService from '@/services/ChatService';
import MessageService from '@/services/MessageService';
import { styled } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState, memo } from 'react';
import { Messages } from '../Messages/Messages';

const ContainerChat = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: '900px',
  height: '100%',
  display: 'flex',
  margin: '0 auto',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
}));

interface ChatBoxProps {
  fetchChats: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = memo(({ fetchChats }) => {
  const route = useRouter();
  const { user } = useAuth();
  const { interlocutorData, selectedChat, handleSelectedChat } =
    useInterlocutorData();
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

  console.log('user', user);
  const handleSend = async (text: string) => {
    if (!user) return;
    if (!interlocutorData) return;
    const message: any = {
      senderId: user._id,
      receiverId: interlocutorData._id,
      chatId: selectedChat?._id ?? null,
      authorName: `${user.name} ${user.surname}`,
      text,
    };
    const receiverId =
      selectedChat?.members?.find((id: any) => id !== user._id) ??
      interlocutorData._id;

    const fetchedMessageData = await MessageService.addNewMessage(message);
    if (!fetchedMessageData) return;

    if (fetchedMessageData.isNewChatCreated) {
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
      fetchChats();
    }
    setMessages([...messages, fetchedMessageData.message]);
    socket.emit('send-message', { ...message, receiverId });
  };

  useEffect(() => {
    console.log('selectedChat?._id', selectedChat);

    socket.on('recieve-message', async (receivedMessage: any) => {
      console.log('receivedMessage', receivedMessage);
      if (!selectedChat) {
        fetchChats();
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
