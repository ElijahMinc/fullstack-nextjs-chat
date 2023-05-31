import { Box, Divider, Drawer } from '@mui/material';
import { GetServerSideProps } from 'next';
import { Conversations } from '../Conversations/Conversations';
import { styled } from '@mui/material';
import { SidebarHeader } from '../SidebarHeader/SidebarHeader';
import { Chat } from '@/types/conversations';

interface SidebarProps {
  chats: Chat[];
  isDrawerOpen: boolean;
  handleDrawerClose: () => void;
  handleOpenModal: () => void;
}

export const SidebarDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'drawerWidth',
})<{ drawerWidth: number }>(({ theme, drawerWidth }) => ({
  ...(drawerWidth && {
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
    },
  }),
}));

export const drawerWidth = 340;

export const Sidebar = ({
  chats,
  isDrawerOpen,
  handleDrawerClose,
  handleOpenModal,
}: SidebarProps) => {
  return (
    <SidebarDrawer
      drawerWidth={drawerWidth}
      variant="persistent"
      anchor="left"
      open={isDrawerOpen}
    >
      <SidebarHeader
        handleOpenModal={handleOpenModal}
        handleDrawerClose={handleDrawerClose}
      />
      <Divider />
      <Box
        component="div"
        position="relative"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        height="100%"
      >
        <Conversations chats={chats} />
      </Box>
    </SidebarDrawer>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const persons: any[] = [];
  return {
    props: {
      persons,
    },
  };
};
