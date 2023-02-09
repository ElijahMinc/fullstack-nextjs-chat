import { GetServerSideProps } from 'next';
import React from 'react';

interface PersonalChatProps {}

const PersonalChat: React.FC<PersonalChatProps> = () => {
  return (
    <div>
      <h1>PersonalChat</h1>
    </div>
  );
};

export default PersonalChat;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const personId = ctx.params?.personId;

  if (!personId) {
    return {
      props: {},
      notFound: true,
    };
  }
  console.log(personId);
  
  //? FETCH YOUR PERSON CHAT

  return {
    props: {},
  };
};
