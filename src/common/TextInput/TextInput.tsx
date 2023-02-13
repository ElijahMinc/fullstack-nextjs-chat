import React, { useState } from 'react';
import { Button, styled, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const WrapForm = styled('form')(({ theme }) => ({
  marginTop: 'auto',

  display: 'flex',
  justifyContent: 'center',
  width: '95%',
  margin: `${theme.spacing(0)} auto`,
}));

const TextFieldChat = styled(TextField)(({ theme }) => ({
  width: '100%',
}));

export const TextInput = ({ handleSend }: any) => {
  const [value, setValue] = useState('');

  const onSubmit = () => {
    setValue('');
    handleSend(value);
  };

  return (
    <>
      <WrapForm noValidate autoComplete="off">
        <TextFieldChat
          id="standard-text"
          label="Enter text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={onSubmit}>
          <SendIcon />
        </Button>
      </WrapForm>
    </>
  );
};
