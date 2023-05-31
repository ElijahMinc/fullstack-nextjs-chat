import CrudService from './CrudService';
import { User } from '@/types/user';
import { Chat } from '@/types/conversations';
import { Message } from '@/types/message';
import { Nullable } from '@/types/Nullable';

interface ChatBySenderIdAndReceiverIdRequest {
  senderId: User['_id'];
  receiverId: User['_id'];
}

export interface AddNewMessageRequest {
  senderId: User['_id'];
  receiverId: User['_id'];
  chatId: Nullable<Chat['_id']>;
  authorName: string;
  text: string;
  files: { id: string; base64Url: string }[];
}

interface AddNewMessageResponse {
  message: AddNewMessageRequest;
  isNewChatCreated: boolean;
}

class MessageService extends CrudService {
  public uniqueName: string;

  constructor() {
    super('message');
    this.uniqueName = 'message';
  }

  public async getAllMessageByChatId(
    chatId: string,
    routeParams?: { [key: string]: string },
    params?: string
  ) {
    const response = await this.getById<Chat['_id'], Message[]>(
      chatId,
      routeParams,
      params
    );

    if ('error' in response) {
      const message = response.message;

      return null;
    }

    return response;
  }

  public async addNewMessage(
    data: AddNewMessageRequest,
    routeParams?: { [key: string]: string },
    params?: string
  ) {
    const formData = new FormData();

    Object.keys(data).forEach((key: keyof AddNewMessageRequest) => {
      formData.append(key, data[key]);
    });

    const response = await this.create<FormData, AddNewMessageResponse>(
      data,
      routeParams,
      params
    );

    if ('error' in response) {
      const message = response.message;

      return null;
    }

    return response;
  }
}

export default new MessageService();
