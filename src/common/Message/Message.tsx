import React from 'react';
import { styled } from '@mui/material';

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
  // '&:after': {
  //   content: "''",
  //   position: 'absolute',
  //   width: '0',
  //   height: '0',
  //   borderTop: '15px solid #f8e896',
  //   borderLeft: '15px solid transparent',
  //   borderRight: '15px solid transparent',
  //   top: '0',
  //   right: '-15px',
  // },
  // '&:before': {
  //   content: "''",
  //   position: 'absolute',
  //   width: '0',
  //   height: '0',
  //   borderTop: '17px solid #dfd087',
  //   borderLeft: '16px solid transparent',
  //   borderRight: '16px solid transparent',
  //   top: '-1px',
  //   right: '-17px',
  // },
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
}

export const MessageLeft = ({
  displayName,
  message,
  photoURL,
  timestamp,
}: MessageLeft) => {
  return (
    <>
      <MessageRow>
        <ImageOrange src={photoURL ?? ''}></ImageOrange>
        <div>
          <DisplayName>{displayName ?? ''}</DisplayName>
          <MessageBlue>
            <div>
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
}
export const MessageRight = ({ message, timestamp }: MessageRight) => {
  return (
    <MessageRowRight>
      <MessageOrange>
        <MessageContent>{message ?? 'no message :C'}</MessageContent>
        <MessageTimeStampRight>
          {timestamp ?? 'no timestamp :C'}
        </MessageTimeStampRight>
      </MessageOrange>
    </MessageRowRight>
  );
};
