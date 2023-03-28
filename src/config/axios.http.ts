import AuthService from '@/services/AuthService';
import axios from 'axios';
export interface IUser {
  email: string;
  isActivated: boolean;
  id: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

const $AuthApi = axios.create({
  withCredentials: true, // чтобы к каждому полю автомат. были куки
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
});

const $BaseApi = axios.create({
  withCredentials: true, // чтобы к каждому полю автомат. были куки
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
});

// interceprot - перехватчик

$AuthApi.interceptors.request.use((config) => {
  if (!!config.headers) {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }

  return config;
});

let _isRetry = true;

$AuthApi.interceptors.response.use(
  (config) => config,
  async (err) => {
    const originalRequest = err.config;
    originalRequest.headers._isRetry = true;

    if (err.response.status !== 401) {
      throw err; // ошибка у которой не 401 статус-код
    }

    if (_isRetry) {
      // originalRequest.headers._isRetry = null;
      _isRetry = false;

      try {
        const response = await AuthService.checkAuth();
        if (!response) {
          throw err;
        }
        return $AuthApi.request(originalRequest);
      } catch (e) {
        console.log('Пользователь не авторизован');
        localStorage.removeItem('token');
        throw e;
      }
    }
  }
);

export { $AuthApi };
