import React, { useRef, useEffect } from 'react';
import { styled } from '@mui/material';
import { MessageLeft, MessageRight } from '@/common/Message/Message';

const MessageBody = styled('div')(({ theme }) => ({
  width: 'calc( 100% - 20px )',
  marginBottom: 10,
  overflowY: 'scroll',
  height: 'calc( 100% - 80px )',
  '&::-webkit-scrollbar': {
    width: '5px',
  },
  '&::-webkit-scrollbar-track': {
    // backgroundColor: theme.palette.primary,
    borderRadius: '20px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.primary.light
        : theme.palette.primary.dark,
    borderRadius: '20px',
  },
}));
interface MessagesProps {
  messages: any[];
  currentUserId: string;
}

export const Messages: React.FC<MessagesProps> = ({
  messages,
  currentUserId,
}) => {
  const scroll = useRef<any>();

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  return (
    <MessageBody>
      {messages.map((message) => (
        <React.Fragment key={message._id}>
          {message.senderId === currentUserId ? (
            <MessageRight
              message={message.text}
              timestamp="MM/DD 00:00"
              // photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
              // displayName="まさりぶ"
              // avatarDisp={true}
            />
          ) : (
            <MessageLeft
              message={message.text}
              timestamp="MM/DD 00:00"
              photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
              displayName={message.email}
            />
          )}
          <div ref={scroll} id="scrollIntoView"></div>
        </React.Fragment>
      ))}
    </MessageBody>
  );
};
