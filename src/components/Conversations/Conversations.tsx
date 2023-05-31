import { socket } from '@/config/socket';
import { useAuth } from '@/context/AuthContext';
import { useInterlocutorData } from '@/context/InterlocutorContext';
import { useUserByIdQuery } from '@/hooks/useUserByIdQuery';
import UserService from '@/services/UserService';
import { Chat } from '@/types/conversations';
import { SOCKET_ON_KEYS } from '@/types/socket';
import { User } from '@/types/user';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import React, { useState, useEffect, memo } from 'react';
import { ConversationItem } from './ConversationItem';

interface ConversationsProps {
  chats: any[];
}

export const Conversations: React.FC<ConversationsProps> = memo(({ chats }) => {
  const { user } = useAuth();
  const { handleSelectedChat, interlocutorData } = useInterlocutorData();
  const [onlineUsers, setOnlineUsers] = useState<
    { socketId: string; userId: User['_id'] }[]
  >([]);

  useEffect(() => {
    socket.on(
      SOCKET_ON_KEYS['GET:USERS'],
      (users: { socketId: string; userId: User['_id'] }[]) => {
        setOnlineUsers(users);
      }
    );
  }, []);

  const checkOnlineStatus = (chat: Chat): boolean => {
    if (!user) return false;
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
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
});
