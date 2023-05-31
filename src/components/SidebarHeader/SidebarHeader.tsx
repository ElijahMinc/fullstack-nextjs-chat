import { DrawerHeader } from '@/common/DrawerHeader/DrawerHeader';
import { useAuth } from '@/context/AuthContext';
import { styled } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, Button, Divider, Drawer, IconButton } from '@mui/material';
import { useCallback, useState } from 'react';
import { User } from '@/types/user';
import { ProfileModal } from '../ProfileModal/ProfileModal';

interface SidebarHeader {
  handleDrawerClose: () => void;
  handleOpenModal: () => void;
}

export const SidebarDrawerHeader = styled(DrawerHeader)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '10px',
}));

export const SidebarHeader: React.FC<SidebarHeader> = ({
  handleOpenModal,
  handleDrawerClose,
}) => {
  const { logoutAuth, user } = useAuth();
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const handleToggleProfileModal = () =>
    setOpenProfileModal((prevStatus) => !prevStatus);

  return (
    <SidebarDrawerHeader>
      <ProfileModal
        userId={user!._id}
        isOpen={openProfileModal}
        handleCloseModal={handleToggleProfileModal}
      />

      <IconButton onClick={logoutAuth}>
        <PowerSettingsNewIcon color="error" />
      </IconButton>
      <Button fullWidth variant="contained" onClick={handleOpenModal}>
        Search Users
      </Button>
      <IconButton onClick={handleToggleProfileModal}>
        <AccountCircleIcon />
      </IconButton>
      <IconButton onClick={handleDrawerClose}>
        <ChevronLeftIcon />
      </IconButton>
    </SidebarDrawerHeader>
  );
};
