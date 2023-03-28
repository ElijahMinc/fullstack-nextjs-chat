import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { metaElementsForHomePage } from '@/config/meta/metaHomePage';
import Box from '@mui/material/Box';
import { ChatContainer } from '@/common/ChatContainer/ChatContainer';
import { DrawerHeader } from '@/common/DrawerHeader/DrawerHeader';
import { HeadContent } from '@/components/Head';
import ChatBox from '@/components/ChatBox/ChatBox';
import { socket } from '@/config/socket';
import { InterlocutorProvider } from '@/context/InterlocutorContext';
import type { Chat } from '@/types/conversations';
import { User } from '@/types/user';
import { SOCKET_EMIT_KEYS } from '@/types/socket';
import withCheckUser from '@/HOC/withCheckUser';
import { useChatsQuery } from '@/hooks/useChatsQuery';
import {
  Button,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { AppBar } from '@/common/AppBar/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import { Header } from '@/components/Header';
import { SearchUserModal } from '@/components/SearchUserModal/SearchUserModal';

const Chat = ({ authUser }: { authUser: User }) => {
  const { chats, addedUserIds, refetchChats } = useChatsQuery(authUser._id);

  const [headerOpen, setHeaderOpen] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleHeaderOpen = () => {
    setHeaderOpen(true);
  };

  const handleHeaderClose = () => {
    setHeaderOpen(false);
  };

  useEffect(() => {
    socket.emit(SOCKET_EMIT_KEYS['NEW:USER:ADD'], authUser._id);
  }, [authUser]);

  return (
    <>
      <HeadContent title="Title" metaElements={metaElementsForHomePage} />
      <Box padding="0px" sx={{ display: 'flex', padding: 0, height: '100%' }}>
        <InterlocutorProvider>
          <SearchUserModal
            isOpen={openModal}
            addedUserIds={addedUserIds}
            handleCloseModal={handleCloseModal}
          />
          <Header isOpen={headerOpen} handleHeaderOpen={handleHeaderOpen} />
          <Sidebar
            chats={chats}
            isDrawerOpen={headerOpen}
            handleOpenModal={() => setOpenModal(true)}
            handleDrawerClose={handleHeaderClose}
          />
          <ChatContainer open={headerOpen}>
            <DrawerHeader />
            <ChatBox />
          </ChatContainer>
        </InterlocutorProvider>
      </Box>
    </>
  );
};

export default withCheckUser(Chat);
