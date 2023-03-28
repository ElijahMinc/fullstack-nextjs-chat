import { Modal } from '@/common/Modal/Modal';
import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { useAuth } from '@/context/AuthContext';
import { useInterlocutorData } from '@/context/InterlocutorContext';
import UserService from '@/services/UserService';
import ChatService from '@/services/ChatService';
import { User } from '@/types/user';
import { Nullable } from '@/types/Nullable';
import Image from 'next/image';
import { AvatarUser } from '@/common/AvatarUser/AvatarUser';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { AddNewMessageRequest } from '@/services/MessageService';

interface SearchUserModalProps {
  isOpen: boolean;
  addedUserIds: string[];
  handleCloseModal: () => void;
}

export const SearchUserModal: React.FC<SearchUserModalProps> = ({
  isOpen,
  addedUserIds,
  handleCloseModal,
}) => {
  const queryClient = useQueryClient();
  const { handleSelectedChat, handleInterlocutorData } = useInterlocutorData();
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [interlocutorId, setInterlocutorId] =
    useState<Nullable<User['_id']>>(null);

  useQuery('', () => UserService.getAllUsers(), {
    onSuccess: async (users) => {
      if (!authUser) return;
      if (!users) return;

      const usersWithoutMe = users.filter((user) => user._id !== authUser._id);
      setUsers(usersWithoutMe);
    },
    enabled: isOpen,
  });

  const selectUser = async (receiverId: string) => {
    if (!authUser) return;

    const alreadyAddedUserId = addedUserIds.find(
      (userId) => userId === receiverId
    );

    if (!!alreadyAddedUserId) {
      const receiverUserData = await UserService.getUserById(
        alreadyAddedUserId
      );
      const currentChat = await ChatService.getChatBySenderIdAndReceiverId({
        receiverId: alreadyAddedUserId,
        senderId: authUser._id,
      });

      if (!receiverUserData) return;
      if (!currentChat) return;

      handleInterlocutorData(receiverUserData);
      handleSelectedChat(currentChat);
      setInterlocutorId(null);
      queryClient.invalidateQueries(ChatService.uniqueName);

      handleCloseModal();
      return;
    }

    const receiverUserData = await UserService.getUserById(receiverId);

    if (!receiverUserData) return;

    handleInterlocutorData(receiverUserData);
    handleSelectedChat(null);
    setInterlocutorId(null);
    queryClient.invalidateQueries(ChatService.uniqueName);

    handleCloseModal();
  };

  useEffect(() => {
    if (!interlocutorId) return;

    selectUser(interlocutorId);
  }, [interlocutorId]);

  return (
    <Modal open={isOpen} title="title" handleCancel={handleCloseModal}>
      <List>
        {!!users.length &&
          users.map((user) => {
            return (
              <ListItem key={user._id} disablePadding>
                <ListItemButton
                  onClick={() => setInterlocutorId(user._id)}
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <AvatarUser url={user.avatarUrl} />
                  <p>{`${user.name} ${user.surname}`}</p>
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>
    </Modal>
  );
};
