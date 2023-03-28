import { AppBar } from '@/common/AppBar/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { useInterlocutorData } from '@/context/InterlocutorContext';

interface HeaderProps {
  isOpen: boolean;
  handleHeaderOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isOpen, handleHeaderOpen }) => {
  const { interlocutorData } = useInterlocutorData();

  return (
    <AppBar position="fixed" open={isOpen}>
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={handleHeaderOpen}
          edge="start"
          sx={{ mr: 2, ...(isOpen && { display: 'none' }) }}
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
};
