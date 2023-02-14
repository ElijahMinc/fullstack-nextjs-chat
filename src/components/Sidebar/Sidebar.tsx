import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { DrawerHeader } from '@/common/DrawerHeader/DrawerHeader';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { AppBar } from '@/common/AppBar/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import { Conversations } from '../Conversations/Conversations';
import { useAuth } from '@/context/AuthContext';
import { useInterlocutorData } from '@/context/InterlocutorContext';
import { SearchUserModal } from '../SearchUserModal/SearchUserModal';

interface SidebarProps {
  chats: any[];
  fetchChats: () => void;
  open: boolean;
  handleDrawerClose: () => void;
  handleDrawerOpen: () => void;
  addedUserIds: string[];
}
export const drawerWidth = 340;

export const Sidebar = ({
  chats,
  open,
  addedUserIds,
  fetchChats,
  handleDrawerClose,
  handleDrawerOpen,
}: SidebarProps) => {
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => setOpenModal(false);

  const { logoutAuth } = useAuth();
  const { interlocutorData } = useInterlocutorData();

  return (
    <>
      <SearchUserModal
        isOpen={openModal}
        addedUserIds={addedUserIds}
        refetchChats={fetchChats}
        handleCancel={handleCloseModal}
      />

      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {interlocutorData
              ? `${interlocutorData?.name} ${interlocutorData?.surname}`
              : ''}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <IconButton onClick={logoutAuth}>
            <PowerSettingsNewIcon color="error" />
          </IconButton>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setOpenModal(true)}
          >
            User Search
          </Button>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
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
      </Drawer>
    </>
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
