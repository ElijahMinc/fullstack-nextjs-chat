import { Modal } from '@/common/Modal/Modal';
import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { useAuth } from '@/context/AuthContext';
import { useInterlocutorData } from '@/context/InterlocutorContext';
import UserService from '@/services/UserService';
import ChatService from '@/services/ChatService';

interface SearchUserModalProps {
  isOpen: boolean;
  addedUserIds: string[];
  refetchChats: () => void;
  handleCancel: () => void;
}

export const SearchUserModal: React.FC<SearchUserModalProps> = ({
  isOpen,
  addedUserIds,
  refetchChats,
  handleCancel,
}) => {
  const { handleSelectedChat, handleInterlocutorData, interlocutorData } =
    useInterlocutorData();
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [interlocutorId, setInterlocutorId] = useState(null);

  const fetchUsers = async () => {
    if (!authUser) return;

    const users = await UserService.getAllUsers();

    if (!users) return;

    const usersWithoutMe = users.filter((user) => user._id !== authUser._id);
    setUsers(usersWithoutMe);
  };

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
      handleCancel();
      refetchChats();
      setInterlocutorId(null);

      return;
    }

    const receiverUserData = await UserService.getUserById(receiverId);

    if (!receiverUserData) return;

    handleInterlocutorData(receiverUserData);
    handleSelectedChat(null);
    handleCancel();
    refetchChats();
    setInterlocutorId(null);
  };

  useEffect(() => {
    isOpen && fetchUsers();
  }, [isOpen]);

  useEffect(() => {
    if (!interlocutorId) return;

    selectUser(interlocutorId);
  }, [interlocutorId]);

  return (
    <Modal open={isOpen} title="title" handleCancel={handleCancel}>
      <List>
        {!!users.length &&
          users.map((user) => {
            return (
              <ListItem key={user._id} disablePadding>
                <ListItemButton onClick={() => setInterlocutorId(user._id)}>
                  {user.email}
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>
    </Modal>
  );
};
