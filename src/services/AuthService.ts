import { $AuthApi } from '@/config/axios.http';
import CrudService from './CrudService';
import cookieNext from 'cookies-next';
class AuthService extends CrudService {
  public uniqueName: string;

  constructor() {
    super('auth');
    this.uniqueName = 'auth';
  }

  public async checkAuth(params: any): Promise<any> {
    try {
      const response = await this.getAll(params, '/refresh');

      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      return response.user;
    } catch (error) {
      return null;
    }
  }

  async login(email: string, password: string) {
    try {
      const response: any = await $AuthApi.post('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response;
    } catch (e: any) {
      return null;
    }
  }

  async registration(email: string, password: string) {
    try {
      const response: any = await $AuthApi.post('/auth/registration', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response;
    } catch (e: any) {
      return null;
    }
  }
}

export default new AuthService();
