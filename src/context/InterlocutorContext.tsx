import UserService from '@/services/UserService';
import { Chat } from '@/types/conversations';
import { Nullable } from '@/types/Nullable';
import { User } from '@/types/user';
import { useRouter } from 'next/router';
import { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { useAuth } from './AuthContext';

export interface AuthProviderProps {
  interlocutorData: Nullable<User>;
  selectedChat: Nullable<Chat>;
  handleInterlocutorData: (data: Nullable<User>) => void;
  handleSelectedChat: (data: Nullable<Chat>) => void;
}

const InterlocutorProviderContext = createContext<AuthProviderProps>(
  {} as AuthProviderProps
);

interface InterlocutorProviderContextComponentProps {
  children: React.ReactNode;
}

export const InterlocutorProvider = ({
  children,
}: InterlocutorProviderContextComponentProps) => {
  const route = useRouter();
  const { user } = useAuth();
  const [interlocutorData, setInterlocutorData] =
    useState<Nullable<User>>(null);
  const [selectedChat, setSelectedChat] = useState<Nullable<Chat>>(null);

  useEffect(() => {
    const selectedChatFromLocalStorage = localStorage.getItem('selectedChat')
      ? JSON.parse(localStorage.getItem('selectedChat') as string)
      : null;
    if (!!selectedChatFromLocalStorage) {
      setSelectedChat(selectedChatFromLocalStorage);
    }
  }, []);


  useEffect(() => {
    if (!user) return;
    if (!selectedChat) return;

    const userId = selectedChat.members.find((id: string) => id !== user._id);

    if (!userId) return;

    const getUserData = async () => {
      try {
        const interlocutorData = await UserService.getUserById(userId);
        setInterlocutorData(interlocutorData);
        route.push({
          query: {
            chatId: selectedChat._id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
  }, [selectedChat]);

  const handleInterlocutorData = (data: Nullable<User>) =>
    setInterlocutorData(data);

  const handleSelectedChat = (chat: Nullable<Chat>) => {
    if (!chat) {
      localStorage.removeItem('selectedChat');
    } else {
      localStorage.setItem('selectedChat', JSON.stringify(chat));
    }

    setSelectedChat(chat);
  };

  const value = useMemo(
    () => ({
      interlocutorData,
      selectedChat,
      handleInterlocutorData,
      handleSelectedChat,
    }),
    [interlocutorData, selectedChat]
  );

  return (
    <InterlocutorProviderContext.Provider value={value}>
      {children}
    </InterlocutorProviderContext.Provider>
  );
};

export const useInterlocutorData = () =>
  useContext(InterlocutorProviderContext);
