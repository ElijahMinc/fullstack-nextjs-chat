import {
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Toolbar,
  Typography,
} from '@mui/material';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { DrawerHeader } from '@/common/DrawerHeader/DrawerHeader';
import { useRouter } from 'next/router';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { getAllUsers } from '@/api/UserRequests';
import { createChat, userChats } from '@/api/ChatRequests';
import { logout } from '@/api/AuthRequests';
import { AppBar } from '@/common/AppBar/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import { Conversations } from '../Conversations/Conversations';
import { socket } from '@/config/socket';
import { useAuth } from '@/context/AuthContext';
import { useInterlocutorData } from '@/context/InterlocutorContext';

interface SidebarProps {
  chats?: any[];
  currentUserId: string;
  open: boolean;
  handleDrawerClose: () => void;
  handleDrawerOpen: () => void;
}
export const drawerWidth = 340;

export const Sidebar = ({
  currentUserId,
  open,
  handleDrawerClose,
  handleDrawerOpen,
}: SidebarProps) => {
  const { logoutAuth } = useAuth();
  const { interlocutorData } = useInterlocutorData();
  const [chats, setChats] = useState<any[]>([]);

  const [fetchAllUsers, setAllUsers] = useState([]);
  const router = useRouter();

  const fetchUsers = async () => {
    const users = await getAllUsers();
    const usersWithoutMe = users.data.filter(
      (user: any) => user._id !== currentUserId
    );
    setAllUsers(usersWithoutMe);
  };

  const createPersonalChat = async (receiverId: string) => {
    const data: any = {
      senderId: currentUserId,
      receiverId,
    };
    const chat = await createChat(data);
  };

  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(currentUserId);
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, []);

  return (
    <>
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
            {interlocutorData ? interlocutorData.email : ''}
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
          <Button fullWidth variant="contained" onClick={fetchUsers}>
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
