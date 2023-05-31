import { useInterlocutorQuery } from '@/hooks/useInterlocutorQuery';
import { Chat } from '@/types/conversations';
import { Nullable } from '@/types/Nullable';
import { User } from '@/types/user';
import { createContext, useMemo, useContext } from 'react';

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
  const {
    handleInterlocutorData,
    handleSelectedChat,
    interlocutorData,
    selectedChat,
  } = useInterlocutorQuery();

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
