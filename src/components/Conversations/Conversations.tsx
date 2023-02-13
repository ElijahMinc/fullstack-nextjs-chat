import { socket } from '@/config/socket';
import { useAuth } from '@/context/AuthContext';
import { useInterlocutorData } from '@/context/InterlocutorContext';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import React, { useState, useEffect } from 'react';
import { ConversationItem } from './ConversationItem';

interface ConversationsProps {
  chats: any[];
}

export const Conversations: React.FC<ConversationsProps> = ({ chats }) => {
  const { user } = useAuth();
  const { handleSelectedChat } = useInterlocutorData();
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.on('get-users', (users: any) => {
      setOnlineUsers(users);
    });
  }, []);

  const checkOnlineStatus = (chat: any) => {
    const chatMember = chat.members.find((member: any) => member !== user.id);
    const online: any = onlineUsers.find(
      (user: any) => user.userId === chatMember
    );
    return online ? true : false;
  };

  return (
    <List>
      {chats.map((chat) => {
        const interlocutorId = chat.members.find(
          (id: string) => id !== user.id
        );

        return (
          <ListItem key={chat._id} disablePadding>
            <ListItemButton onClick={() => handleSelectedChat(chat)}>
              <ConversationItem
                interlocutorId={interlocutorId}
                isOnline={checkOnlineStatus(chat)}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};
