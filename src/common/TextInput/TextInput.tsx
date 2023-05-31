import React, { useState, useRef } from 'react';
import { Button, styled, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import { Nullable } from '@/types/Nullable';
import { FileService } from '@/services/FileService';
import { v4 as uuidV4 } from 'uuid';

const WrapForm = styled('form')(({ theme }) => ({
  marginTop: 'auto',

  display: 'flex',
  justifyContent: 'center',
  width: '95%',
  margin: `${theme.spacing(0)} auto`,
}));

const TextFieldChat = styled(TextField)(({ theme }) => ({
  marginRight: '10px',
  width: '100%',
  '.MuiInputBase-root': {
    borderRadius: '4px',
    '&:after': {
      display: 'none',
    },
    '&:before': {
      display: 'none',
    },
  },
  '.MuiInputBase-input': {},
}));

export const SendButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isShow',
})<{ isShow: boolean }>(({ theme, isShow }) => ({
  opacity: '0',
  width: 0,
  height: 0,
  minWidth: 0,
  visibility: 'hidden',
  transition: theme.transitions.create(
    ['minWidth', 'width', 'height', 'opacity'],
    {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }
  ),
  ...(isShow && {
    opacity: '1',
    visibility: 'visible',
    width: 'auto',
    height: 'auto',
    minWidth: '64px',
  }),
}));

export const TextInput = ({ handleSend }: any) => {
  const [files, setFiles] = useState<
    {
      base64Url: string;
      id: string;
    }[]
  >([]);
  const inputFileRef = useRef<Nullable<HTMLInputElement>>(null);
  const [value, setValue] = useState('');

  const onAttachment = () => {
    if (!inputFileRef.current) return;

    inputFileRef.current.click();
  };

  const onSubmit = () => {
    setValue('');
    handleSend({
      text: value,
      files,
    });
  };

  const onKeyUpHandle = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.code.toLowerCase() !== 'enter') return;
    if (!value.length) return;

    setValue('');
    handleSend({
      text: value,
      files,
    });
  };

  const uploadImageFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { target } = event;

    const files = target.files;
    console.log('files', files);
    if (!files) return;

    const filesList = Array.from(files);

    if (filesList.length > 5) {
      alert('Invalid format');
      return;
    }

    let base64DataUrls: {
      base64Url: string;
      id: string;
    }[] = [];

    for (const file of filesList) {
      if (FileService.isInvalidFormat(file)) {
        alert('Invalid format');
        return;
      }

      if (FileService.isInvalidSize(file)) {
        alert('Invalid size');
        return;
      }

      const base64DataUrl = await FileService.readBlob(file);
      console.log('base64DataUrl', base64DataUrl);
      if (base64DataUrl) {
        base64DataUrls.push({
          base64Url: base64DataUrl as string,
          id: uuidV4(),
        });
      }
    }

    setFiles(base64DataUrls);
    target.value = '';
  };

  const handleDeleteFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  return (
    <>
      <div
        style={{
          alignSelf: 'flex-start',
        }}
      >
        {!!files.length &&
          files.map((file) => (
            <img
              key={file.id}
              onClick={() => handleDeleteFile(file.id)}
              width={100}
              height={100}
              style={{
                borderRadius: '10px',
                marginLeft: '20px',
                cursor: 'pointer',
              }}
              src={file.base64Url}
            />
          ))}
      </div>
      <WrapForm
        noValidate
        autoComplete="off"
        onSubmit={(e) => e.preventDefault()}
      >
        <TextFieldChat
          id="standard-text"
          label="Enter text"
          variant="filled"
          disabled={!!files.length}
          value={value}
          onKeyUp={onKeyUpHandle}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          sx={{
            marginRight: '10px',
          }}
          variant="contained"
          color="primary"
          onClick={onAttachment}
        >
          <AttachFileIcon />
          <input
            ref={inputFileRef}
            onChange={uploadImageFile}
            multiple
            type="file"
            style={{ display: 'none' }}
          />
        </Button>
        <Button
          sx={{
            marginRight: '10px',
          }}
          variant="contained"
          color="primary"
          onClick={onAttachment}
        >
          <KeyboardVoiceIcon />
        </Button>
        <SendButton
          isShow={!!value.length || !!files.length}
          variant="contained"
          color="primary"
          onClick={onSubmit}
        >
          <SendIcon />
        </SendButton>
      </WrapForm>
    </>
  );
};
