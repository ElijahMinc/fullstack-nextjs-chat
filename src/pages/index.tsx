import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { metaElementsForHomePage } from '@/config/meta/metaHomePage';
import Box from '@mui/material/Box';
import { ChatContainer } from '@/common/ChatContainer/ChatContainer';
import { DrawerHeader } from '@/common/DrawerHeader/DrawerHeader';
import { HeadContent } from '@/components/Head';
import { useAuth } from '@/context/AuthContext';
import ChatBox from '@/components/ChatBox/ChatBox';
import { socket } from '@/config/socket';
import { getUser } from '@/api/UserRequests';
import { InterlocutorProvider } from '@/context/InterlocutorContext';

const Chat = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(true);
  console.log('user', user);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    socket.emit('new-user-add', user.id);
  }, [user]);

  return (
    <>
      <HeadContent title="Title" metaElements={metaElementsForHomePage} />
      <Box sx={{ display: 'flex', height: '95%' }}>
        <InterlocutorProvider>
          <Sidebar
            currentUserId={user.id}
            open={open}
            handleDrawerOpen={handleDrawerOpen}
            handleDrawerClose={handleDrawerClose}
          />
          <ChatContainer open={open}>
            <DrawerHeader />
            <ChatBox currentUser={user.id} />
          </ChatContainer>
        </InterlocutorProvider>
      </Box>
    </>
  );
};

export default Chat;
