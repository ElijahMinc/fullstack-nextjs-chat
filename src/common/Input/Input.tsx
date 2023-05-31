import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material';

export const InputField = styled(TextField)(({ theme }) => ({}));

export const Input = ({ ...props }: TextFieldProps) => (
  <InputField
    multiline
    rows={0.1}
    //  variant="standard"
    {...props}
  />
);
