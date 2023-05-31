import React from 'react';

import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper, { PaperProps } from '@mui/material/Paper';
import { ThemedProviderProps } from '@/context/ColorModeContext';

interface ModalProps {
  open: boolean;
  title: string | React.ReactNode;
  children: React.ReactNode;
  handleCancel: () => void;

  sx?: DialogProps['sx'];
  handleOk?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  title,
  open,
  handleCancel,
  handleOk,
  sx,
  ...other
}) => {
  return (
    <Dialog
      sx={{
        '& .MuiDialog-paper': { width: '100%', maxHeight: 700 },
        ...(sx ?? {}),
      }}
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        {handleOk && <Button onClick={handleOk}>Ok</Button>}
      </DialogActions>
    </Dialog>
  );
};
