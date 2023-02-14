import CrudService from './CrudService';
import { User } from '@/types/user';

type UserReponse = User;

interface AuthRequest {
  email: string;
  password: string;
}

class UsersService extends CrudService {
  public uniqueName: string;

  constructor() {
    super('users');
    this.uniqueName = 'users';
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
}

export default new UsersService();
