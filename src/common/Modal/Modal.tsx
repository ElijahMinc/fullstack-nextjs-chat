import React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper, { PaperProps } from '@mui/material/Paper';

interface ModalProps {
  open: boolean;
  title: string | React.ReactNode;
  children: React.ReactNode;
  handleCancel: () => void;
  handleOk?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  title,
  open,
  handleCancel,
  handleOk,
  ...other
}) => {
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: 700 } }}
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
