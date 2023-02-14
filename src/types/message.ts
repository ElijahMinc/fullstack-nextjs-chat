import { Chat } from './conversations';
import { User } from './user';
import { Id } from './id';

export interface Message extends Id {
  chatId: Chat['_id'];
  senderId: User['_id'];
  text: string;
  authorName: string;
}
