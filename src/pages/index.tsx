import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { metaElementsForHomePage } from '@/config/meta/metaHomePage';
import Box from '@mui/material/Box';
import { ChatContainer } from '@/common/ChatContainer/ChatContainer';
import { DrawerHeader } from '@/common/DrawerHeader/DrawerHeader';
import { HeadContent } from '@/components/Head';
import { useAuth } from '@/context/AuthContext';
import ChatBox from '@/components/ChatBox/ChatBox';
import { socket } from '@/config/socket';
import { InterlocutorProvider } from '@/context/InterlocutorContext';
import { Chat } from '@/types/conversations';
import { User } from '@/types/user';
import { getUserIdsFromMembers } from '@/utils/getUserIdsFromMembers';
import ChatService from '@/services/ChatService';

const Chat = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(true);

  const [chats, setChats] = useState<Chat[]>([]);
  const [addedUserIds, setAddedUserIds] = useState<User['_id'][]>([]);

  const getChats = useCallback(async () => {
    if (!user) return;

    const chatsByUserId = await ChatService.getChatsByUserId(user._id);

    if (!chatsByUserId) return;

    setChats(chatsByUserId);
    setAddedUserIds(getUserIdsFromMembers(chatsByUserId, user._id));
  }, [!!user]);

  useEffect(() => {
    getChats();
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!user) return;

    socket.emit('new-user-add', user._id);
  }, [user]);

  return (
    <>
      <HeadContent title="Title" metaElements={metaElementsForHomePage} />
      <Box sx={{ display: 'flex', height: '95%' }}>
        <InterlocutorProvider>
          <Sidebar
            chats={chats}
            addedUserIds={addedUserIds}
            fetchChats={getChats}
            open={open}
            handleDrawerOpen={handleDrawerOpen}
            handleDrawerClose={handleDrawerClose}
          />
          <ChatContainer open={open}>
            <DrawerHeader />
            <ChatBox fetchChats={getChats} />
          </ChatContainer>
        </InterlocutorProvider>
      </Box>
    </>
  );
};

export default Chat;
