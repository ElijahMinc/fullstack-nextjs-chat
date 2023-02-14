import CrudService from './CrudService';
import { User } from '@/types/user';
import { socket } from '@/config/socket';

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface AuthRequest {
  email: string;
  password: string;
}

class AuthService extends CrudService {
  public uniqueName: string;

  constructor() {
    super('auth');
    this.uniqueName = 'auth';
  }

  public async checkAuth(routeParams: { [key: string]: string }) {
    const response = await this.getAll<AuthResponse>(routeParams, '/refresh');

    console.log('response', response);
    if ('error' in response) {
      const message = response.message;

      return null;
    }

    localStorage.setItem('token', response.accessToken);
    localStorage.setItem('user', JSON.stringify(response.user));

    return response.user;
  }

  async login(email: string, password: string) {
    const routeParams = {};

    const response = await this.create<AuthRequest, AuthResponse>(
      {
        email,
        password,
      },
      routeParams,
      '/login'
    );
    console.log('res', response);
    if ('error' in response) {
      const message = response.message;

      return null;
    }

    localStorage.setItem('token', response.accessToken);
    localStorage.setItem('user', JSON.stringify(response.user));

    return response;
  }

  async registration(email: string, password: string) {
    const routeParams = {};

    const response = await this.create<AuthRequest, AuthResponse>(
      {
        email,
        password,
      },
      routeParams,
      '/registration'
    );

    if ('error' in response) {
      const message = response.message;

      return null;
    }

    localStorage.setItem('token', response.accessToken);
    localStorage.setItem('user', JSON.stringify(response.user));

    return response;
  }

  async logout() {
    const routeParams = {};

    const response = await this.delete<void>(
      routeParams,
      '/logout'
    );

    if (typeof response === 'object' && 'error' in response) {
      const message = response.message;

      return null;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedChat');
    socket.disconnect();

    return response;
  }
}

export default new AuthService();
