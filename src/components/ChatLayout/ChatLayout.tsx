import { HeadContent } from '@/components/Head';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { metaElementsForHomePage } from '@/config/meta/metaHomePage';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { DrawerHeader } from '@/common/DrawerHeader/DrawerHeader';
import { AppBar } from '@/common/AppBar/AppBar';
import { ChatContainer } from '@/common/ChatContainer/ChatContainer';

export interface ChatLayoutProps {
  children: React.ReactNode;
}
const ChatLayout = ({ children }: ChatLayoutProps) => {
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  return <></>;
};

export default ChatLayout;
