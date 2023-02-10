import { $AuthApi } from '@/config/axios.http';
import CrudService from './CrudService';

class AuthService extends CrudService {
  public uniqueName: string;

  constructor() {
    super('auth');
    this.uniqueName = 'auth';
  }

  public async checkAuth(params: any): Promise<any> {
    try {
      return await this.getAll(params, '/refresh');
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
      console.log('response', response);

      localStorage.setItem('token', response.data.accessToken);
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
      console.log('response', response);
      localStorage.setItem('token', response.data.accessToken);

      return response;
    } catch (e: any) {
      return null;
    }
  }
}

export default new AuthService();
