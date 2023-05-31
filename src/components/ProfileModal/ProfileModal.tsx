import { Modal } from '@/common/Modal/Modal';
import { useFormik } from 'formik';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';
import { User } from '@/types/user';
import { useUserByIdQuery } from '@/hooks/useUserByIdQuery';
import UserService from '@/services/UserService';
import { useMutation, useQueryClient } from 'react-query';

interface ProfileModal {
  isOpen: boolean;
  userId: User['_id'];
  handleCloseModal: () => void;
}

export const ProfileModal: React.FC<ProfileModal> = ({
  isOpen,
  userId,
  handleCloseModal,
}) => {
  const queryClient = useQueryClient();
  const { userData, isFetching, isLoading } = useUserByIdQuery({
    interlocutorId: userId,
    uniqueHash: UserService.uniqueKeyPersonId,
  });

  const mutation = useMutation(
    (updateUserData: Pick<User, 'name' | 'surname'>) =>
      UserService.updateUser(updateUserData, {}, `/${userId}`),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(UserService.uniqueKeyPersonId);
      },
    }
  );

  const { handleChange, handleSubmit, resetForm, values } = useFormik<
    Pick<User, 'name' | 'surname'>
  >({
    initialValues: {
      name: userData?.name || '',
      surname: userData?.surname || '',
    },
    onSubmit: (data) => {
      mutation.mutate(data);
      handleCloseModal();
    },
  });

  useEffect(() => {
    resetForm({
      values: {
        name: userData?.name || '',
        surname: userData?.surname || '',
      },
    });
  }, [isLoading, isFetching]);

  return (
    <Modal
      open={isOpen}
      title="Your Profile"
      handleOk={handleSubmit}
      handleCancel={handleCloseModal}
      sx={{
        minHeight: 600,
        minWidth: 600,
      }}
    >
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        onChange={handleChange}
        label="Your Name"
        name="name"
        value={values.name}
        autoComplete="name"
        focused={!!values.name.length}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        onChange={handleChange}
        name="surname"
        value={values.surname}
        label="Your Surname"
        type="surname"
        id="surname"
        focused={!!values.surname.length}
        autoComplete="csurname"
      />
    </Modal>
  );
};
