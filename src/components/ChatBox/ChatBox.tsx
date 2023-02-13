import { addMessage, getMessages } from '@/api/MessageRequests';
import { getUser } from '@/api/UserRequests';
import { MessageLeft, MessageRight } from '@/common/Message/Message';
import { TextInput } from '@/common/TextInput/TextInput';
import { socket } from '@/config/socket';
import { useAuth } from '@/context/AuthContext';
import { useInterlocutorData } from '@/context/InterlocutorContext';
import { styled } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
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

interface ChatBoxProps {}

const ChatBox: React.FC<any> = ({ currentUser }) => {
  const { user } = useAuth();
  const { selectedChat } = useInterlocutorData();
  const [messages, setMessages] = useState<any[]>([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState<any>(null);

  // fetching data for header

  // fetch messages
  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(selectedChat._id);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  // Always scroll to last Message

  // Send Message
  const handleSend = async (text: string) => {
    const message: any = {
      senderId: currentUser,
      chatId: selectedChat._id,
      authorName: user.email,
      text,
    };
    const receiverId = selectedChat.members.find(
      (id: any) => id !== currentUser
    );
    // send message to socket server
    setSendMessage({ ...message, receiverId });
    // send message to database
    try {
      const { data: fetchedMessage } = await addMessage(message);
      setMessages([...messages, fetchedMessage]);
    } catch {
      console.log('error');
    }
  };

  // Receive Message from parent component
  useEffect(() => {
    if (!!receivedMessage && receivedMessage.chatId === selectedChat._id) {
      setMessages([...messages, receivedMessage]);
    }
  }, [receivedMessage]);

  // Send Message to socket server
  useEffect(() => {
    if (!!sendMessage) {
      socket.emit('send-message', sendMessage);
    }
  }, [sendMessage]);

  // Get the message from socket server
  useEffect(() => {
    socket.on('recieve-message', (receivedMessage: any) => {
      setReceivedMessage(receivedMessage);
    });
  }, []);
  return (
    <ContainerChat>
      {selectedChat ? (
        <>
          <Messages messages={messages} currentUserId={user.id} />
          <TextInput handleSend={handleSend} />
        </>
      ) : (
        <span className="chatbox-empty-message">
          Tap on a chat to start conversation...
        </span>
      )}
    </ContainerChat>
  );
};

export default ChatBox;
