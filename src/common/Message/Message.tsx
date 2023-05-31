import React from 'react';
import { styled } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const MessageRow = styled('div')(({ theme }) => ({
  display: 'flex',
}));

const MessageRowRight = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
}));

const DisplayName = styled('div')(({ theme }) => ({
  marginLeft: '20px',
}));

const MessageBlue = styled('div')(({ theme }) => ({
  minWidth: '160px',
  minHeight: '60px',
  position: 'relative',
  marginLeft: '20px',
  marginBottom: '10px',
  padding: '10px',
  // backgroundColor: '#A8DDFD',
  maxWidth: '60%',
  //height: "50px",
  textAlign: 'left',
  font: "400 .9em 'Open Sans', sans-serif",
  border: '1px solid #97C6E3',
  borderRadius: '10px',
  borderTopLeftRadius: '0px',
  // '&:before': {
  //   content: "''",
  //   position: 'absolute',
  //   width: '0',
  //   height: '0',
  //   borderTop: '17px solid #A8DDFD',
  //   borderLeft: '16px solid transparent',
  //   borderRight: '16px solid transparent',
  //   top: '-0.8px',
  //   left: '-12px',
  // },
}));

const MessageContent = styled('div')(({ theme }) => ({
  padding: 0,
  margin: 0,
  wordBreak: 'break-all',
}));

const MessageTimeStampRight = styled('div')(({ theme }) => ({
  position: 'absolute',
  fontSize: '.85em',
  fontWeight: '300',
  bottom: '2px',
  right: '5px',
}));

const MessageOrange = styled('div')(({ theme }) => ({
  position: 'relative',
  marginRight: '20px',
  marginBottom: '10px',
  padding: '10px',
  paddingBottom: '20px',
  // backgroundColor: theme.palette.common.black,
  minWidth: '160px',
  maxWidth: '60%',
  //height: "50px",
  textAlign: 'left',
  font: "400 .9em 'Open Sans', sans-serif",
  border: '1px solid #dfd087',
  borderRadius: '10px',
  borderTopRightRadius: '0px',
}));

const ImageOrange = styled('img')(({ theme }) => ({
  // color: theme.palette.getContrastText('#fff'),
  // backgroundColor: '#000',
  objectFit: 'cover',
  borderRadius: '50%',
  width: theme.spacing(4),
  height: theme.spacing(4),
}));

export interface MessageProps {
  message: string | undefined;
  timestamp: string | undefined;
}

export interface MessageLeft extends MessageProps {
  photoURL: string | undefined;
  displayName: string | undefined;
  files: { id: string; base64Url: string }[];
}

export const MessageLeft = ({
  displayName,
  message,
  photoURL,
  timestamp,
  files,
}: MessageLeft) => {
  return (
    <>
      <MessageRow>
        <ImageOrange
          src={
            photoURL ||
            'https://w7.pngwing.com/pngs/754/2/png-transparent-samsung-galaxy-a8-a8-user-login-telephone-avatar-pawn-blue-angle-sphere-thumbnail.png'
          }
        ></ImageOrange>
        <div>
          <DisplayName>{displayName || ''}</DisplayName>
          <MessageBlue>
            <div>
              <>
                {!!files.length &&
                  files.map((file) => {
                    <img
                      key={file.id}
                      width={25}
                      height={25}
                      src={file.base64Url}
                    />;
                  })}
              </>
              <MessageContent>{message}</MessageContent>
            </div>
            <MessageTimeStampRight>{timestamp}</MessageTimeStampRight>
          </MessageBlue>
        </div>
      </MessageRow>
    </>
  );
};

export interface MessageRight {
  message: string | undefined;
  timestamp: string | undefined;
  files: { id: string; base64Url: string }[];
}
export const MessageRight = ({ message, files, timestamp }: MessageRight) => {
  return (
    <MessageRowRight>
      <MessageOrange>
        <>
          {!!files.length &&
            files.map((file) => {
              <img key={file.id} width={25} height={25} src={file.base64Url} />;
            })}
        </>
        <MessageContent>{message ?? 'no message :C'}</MessageContent>

        <MessageTimeStampRight>
          {timestamp ?? 'no timestamp :C'}
        </MessageTimeStampRight>
      </MessageOrange>
    </MessageRowRight>
  );
};
