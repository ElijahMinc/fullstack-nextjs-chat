import CrudService from './CrudService';
import { User } from '@/types/user';
import { Chat } from '@/types/conversations';

interface ChatBySenderIdAndReceiverIdRequest {
  senderId: User['_id'];
  receiverId: User['_id'];
}

class ChatService extends CrudService {
  public uniqueName: string;

  constructor() {
    super('chat');
    this.uniqueName = 'chat';
  }

  public async getChatsByUserId(
    userId: User['_id'],
    routeParams?: { [key: string]: string }
  ) {
    const response = await this.getById<User['_id'], Chat[]>(
      userId,
      routeParams
    );

    if ('error' in response) {
      const message = response.message;

      return null;
    }

    return response;
  }

  async getChatBySenderIdAndReceiverId({
    receiverId,
    senderId,
  }: ChatBySenderIdAndReceiverIdRequest) {
    const response = await this.httpRequest.get<Chat>(
      '',
      `/find/${receiverId}/${senderId}`
    );

    if ('error' in response) {
      const message = response.message;

      return null;
    }

    return response;
  }

  async getChatById(chatId: string) {
    const routeParams = {};

    const response = await this.getById<Chat['_id'], Chat>(
      chatId,
      routeParams,
      '/find'
    );

    if ('error' in response) {
      const message = response.message;

      return null;
    }

    return response;
  }

  async deleteChat(chatId: string) {
    const routeParams = {};

    const response = await this.delete<Chat>(routeParams, `/${chatId}`);

    if ('error' in response) {
      const message = response.message;

      return null;
    }

    return response;
  }
}

export default new ChatService();
