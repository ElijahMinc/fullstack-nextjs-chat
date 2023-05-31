import { useState, useEffect, useCallback } from 'react';
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
import { Header } from '@/components/Header';
import { SearchUserModal } from '@/components/SearchUserModal/SearchUserModal';

const Chat = ({ authUser }: { authUser: User }) => {
  const { chats, addedUserIds } = useChatsQuery(authUser._id);

  const [headerOpen, setHeaderOpen] = useState(true);
  const [openUsersModal, setOpenUsersModal] = useState(false);

  const handleCloseUsersModal = useCallback(() => {
    setOpenUsersModal(false);
  }, []);

  const handleHeaderOpen = useCallback(() => {
    setHeaderOpen(true);
  }, []);

  const handleHeaderClose = useCallback(() => {
    setHeaderOpen(false);
  }, []);

  useEffect(() => {
    socket.emit(SOCKET_EMIT_KEYS['NEW:USER:ADD'], authUser._id);
  }, [authUser]);

  return (
    <InterlocutorProvider>
      <HeadContent title="Title" metaElements={metaElementsForHomePage} />
      <Box padding="0px" sx={{ display: 'flex', padding: 0, height: '100%' }}>
        <SearchUserModal
          isOpen={openUsersModal}
          addedUserIds={addedUserIds}
          handleCloseModal={handleCloseUsersModal}
        />
        <Header isHeaderOpen={headerOpen} handleHeaderOpen={handleHeaderOpen} />
        <Sidebar
          chats={chats}
          isDrawerOpen={headerOpen}
          handleOpenModal={() => setOpenUsersModal(true)}
          handleDrawerClose={handleHeaderClose}
        />
        <ChatContainer open={headerOpen}>
          <DrawerHeader />
          <ChatBox />
        </ChatContainer>
      </Box>
    </InterlocutorProvider>
  );
};

export default withCheckUser(Chat);
