import { Chat } from '@/types/conversations';
import { User } from '@/types/user';

export const getUserIdsFromMembers = (data: Chat[], authUserId: User['_id']) =>
  data.map((chat: Chat) => {
    const members = chat.members;
    const findedUser = members.find(
      (userId: User['_id']) => userId !== authUserId
    );
    if (!findedUser) {
      return '';
    }
    return findedUser;
  });
