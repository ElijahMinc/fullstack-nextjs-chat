import { socket } from '@/config/socket';
import { useAuth } from '@/context/AuthContext';
import { useInterlocutorData } from '@/context/InterlocutorContext';
import { Chat } from '@/types/conversations';
import { SOCKET_ON_KEYS } from '@/types/socket';
import { User } from '@/types/user';
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
  const { handleSelectedChat, interlocutorData } = useInterlocutorData();
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  useEffect(() => {
    socket.on(SOCKET_ON_KEYS['GET:USERS'], (users: User[]) => {
      setOnlineUsers(users);
    });
  }, []);

  const checkOnlineStatus = (chat: Chat): boolean => {
    if (!user) return false;
    const chatMember = chat.members.find((member: any) => member !== user._id);
    const online: any = onlineUsers.find(
      (user: any) => user.userId === chatMember
    );
    return online ? true : false;
  };

  return (
    <List>
      {chats.map((chat) => {
        const interlocutorId = chat.members.find(
          (id: string) => id !== (user as User)._id
        );
        const isSelecteChat = interlocutorData
          ? interlocutorId === interlocutorData._id
          : false;
        return (
          <ListItem key={chat._id} disablePadding>
            <ListItemButton
              onClick={() => handleSelectedChat(chat)}
              sx={{
                backgroundColor: isSelecteChat
                  ? 'rgba(255, 255, 255, 0.08);'
                  : undefined,
              }}
            >
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
