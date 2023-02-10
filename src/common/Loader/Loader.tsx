import { Box } from '@mui/material';
import React from 'react';

interface LoaderProps {}

export const Loader: React.FC<LoaderProps> = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        bgcolor: 'background.default',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        overflow: 'hidden',
        zIndex: 99999,
      }}
    >
      <div className="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Box>
  );
};
