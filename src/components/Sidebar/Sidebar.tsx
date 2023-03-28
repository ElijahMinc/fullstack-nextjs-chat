import { Box, Button, Divider, Drawer, IconButton } from '@mui/material';
import { GetServerSideProps } from 'next';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { DrawerHeader } from '@/common/DrawerHeader/DrawerHeader';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Conversations } from '../Conversations/Conversations';
import { useAuth } from '@/context/AuthContext';
import { useInterlocutorData } from '@/context/InterlocutorContext';

interface SidebarProps {
  chats: any[];
  isDrawerOpen: boolean;
  handleDrawerClose: () => void;
  handleOpenModal: () => void;
}
export const drawerWidth = 340;

export const Sidebar = ({
  chats,
  isDrawerOpen,
  handleDrawerClose,
  handleOpenModal,
}: SidebarProps) => {
  const { logoutAuth } = useAuth();
  const { interlocutorData } = useInterlocutorData();

  return (
    <>
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
        open={isDrawerOpen}
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
          <Button fullWidth variant="contained" onClick={handleOpenModal}>
            Search Users
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
