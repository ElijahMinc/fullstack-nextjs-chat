import React, { useRef, useLayoutEffect, LegacyRef } from 'react';
import { styled } from '@mui/material';
import { MessageLeft, MessageRight } from '@/common/Message/Message';
import { Nullable } from '@/types/Nullable';
import { Message } from '@/types/message';
import { getDataFromCurrentMoment } from '@/utils/getDataFromCurrentMoment';
import { useInterlocutorData } from '@/context/InterlocutorContext';
import useStayScrolled from 'react-stay-scrolled';

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
  messages: Message[];
  currentUserId: string;
}

export const Messages = ({ messages, currentUserId }: MessagesProps) => {
  const { interlocutorData } = useInterlocutorData();

  const avatarMessageLeft = interlocutorData?.avatarUrl;
  const scrollRef = useRef<Nullable<HTMLDivElement>>(null);
  const { stayScrolled, scrollBottom } = useStayScrolled(scrollRef);

  useLayoutEffect(() => {
    scrollBottom();
  }, []);

  useLayoutEffect(() => {
    stayScrolled();
  }, [messages.length]);

  return (
    <MessageBody ref={scrollRef}>
      {messages.map((message) => (
        <React.Fragment key={message._id}>
          {message.senderId === currentUserId ? (
            <MessageRight
              files={message.files}
              message={message.text}
              timestamp={getDataFromCurrentMoment(message.createdAt)}
              // photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
              // displayName="まさりぶ"
              // avatarDisp={true}
            />
          ) : (
            <MessageLeft
              files={message.files}
              message={message.text}
              timestamp={getDataFromCurrentMoment(message.createdAt)}
              photoURL={avatarMessageLeft}
              displayName={`${interlocutorData?.name} ${interlocutorData?.surname}`}
            />
          )}
        </React.Fragment>
      ))}
    </MessageBody>
  );
};
