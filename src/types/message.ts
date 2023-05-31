import { Chat } from './conversations';
import { User } from './user';
import { Id } from './id';

export interface Message extends Id {
  chatId: Chat['_id'];
  senderId: User['_id'];
  files: { id: string; base64Url: string }[];
  text: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}
