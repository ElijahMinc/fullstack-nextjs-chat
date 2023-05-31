import { AppBar } from '@/common/AppBar/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { useInterlocutorData } from '@/context/InterlocutorContext';
import { memo } from 'react';

interface HeaderProps {
  isHeaderOpen: boolean;
  handleHeaderOpen: () => void;
}

export const Header: React.FC<HeaderProps> = memo(
  ({ isHeaderOpen, handleHeaderOpen }) => {
    const { interlocutorData } = useInterlocutorData();
    return (
      <AppBar position="fixed" open={isHeaderOpen}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleHeaderOpen}
            edge="start"
            sx={{ mr: 2, ...(isHeaderOpen && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {interlocutorData ? (
              <div>
                {`${interlocutorData?.name} ${interlocutorData?.surname}`}
              </div>
            ) : (
              ''
            )}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
);
