import { useCustomTheme } from '@/context/ColorModeContext';
import { Box, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import styled from '@emotion/styled';

const ColorModeContainerButton = styled('div')(({ theme }) => ({
  position: 'fixed',
  right: '25px',
  top: '15px',
  zIndex: 2000,
}));

export const ToggleColorMode = () => {
  const { handleToggleTheme, toggleTheme } = useCustomTheme();

  return (
    <ColorModeContainerButton>
      <IconButton onClick={handleToggleTheme} color="inherit">
        {toggleTheme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </ColorModeContainerButton>
  );
};
