import { getUser } from '@/api/UserRequests';
import { useRouter } from 'next/router';
import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from 'react';
import { useAuth } from './AuthContext';

export interface AuthProviderProps {
  interlocutorData: any;
  selectedChat: any;
  handleInterlocutorData: (data: any) => void;
  handleSelectedChat: (data: any) => void;
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
  const [interlocutorData, setInterlocutorData] = useState(null);
  const [selectedChat, setSelectedChat] = useState<any>(null);

  useEffect(() => {
    const selectedChatFromLocalStorage = localStorage.getItem('selectedChat')
      ? JSON.parse(localStorage.getItem('selectedChat') as string)
      : null;

    if (!!selectedChatFromLocalStorage) {
      setSelectedChat(selectedChatFromLocalStorage);
    }
  }, []);

  useEffect(() => {
    if (!selectedChat) return;

    const userId = selectedChat.members.find((id: string) => id !== user.id);

    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setInterlocutorData(data);
        route.push({
          query: selectedChat._id,
        });
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
  }, [selectedChat]);

  const handleInterlocutorData = useCallback(
    (data: any) => setInterlocutorData(data),
    []
  );
  const handleSelectedChat = useCallback((chat: any) => {
    localStorage.setItem('selectedChat', JSON.stringify(chat));
    setSelectedChat(chat);
  }, []);

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
