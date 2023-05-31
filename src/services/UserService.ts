import CrudService from './CrudService';
import { User } from '@/types/user';

type UserReponse = User;

interface AuthRequest {
  email: string;
  password: string;
}

class UsersService extends CrudService {
  public uniqueKey: string;
  public uniqueKeyInterlocutor: string;
  public uniqueKeyUserById: string;
  public uniqueKeyPersonId: string;

  constructor() {
    super('users');
    this.uniqueKey = 'users';
    this.uniqueKeyInterlocutor = 'users:id';
    this.uniqueKeyUserById = 'user:id';
    this.uniqueKeyPersonId = 'person:id';
  }

  public async getUserById(
    id: string,
    routeParams?: { [key: string]: string },
    route?: string
  ) {
    const response = await this.getById<string, UserReponse>(
      id,
      routeParams,
      route
    );

    if ('error' in response) {
      const message = response.message;

      return null;
    }

    return response;
  }

  public async getAllUsers(
    routeParams?: { [key: string]: string },
    route?: string
  ) {
    const response = await this.getAll<UserReponse[]>(routeParams, route);

    if ('error' in response) {
      const message = response.message;

      return null;
    }

    return response;
  }

  public async updateUser(
    data: Pick<User, 'name' | 'surname'>,
    routeParams?: { [key: string]: string },
    route?: string
  ) {
    const response = await this.update<Pick<User, 'name' | 'surname'>, User>(
      data,
      routeParams,
      route
    );

    if ('error' in response) {
      const message = response.message;

      return null;
    }

    return response;
  }
}

export default new UsersService();
