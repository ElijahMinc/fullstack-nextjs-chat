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

let num = 0;

$AuthApi.interceptors.response.use(
  (config) => config,
  async (err) => {
    const originalRequest = err.config;
    originalRequest.headers._isRetry = true;

    if (err.response.status !== 401) {
      throw err; // ошибка у которой не 401 статус-код
    }
    console.log(originalRequest);
    if (_isRetry) {
      // originalRequest.headers._isRetry = null;
      _isRetry = false;

      try {
        const response = await $AuthApi.get<AuthResponse>(`auth/refresh`);
        localStorage.setItem('token', response.data.accessToken);
        return $AuthApi.request(originalRequest);
      } catch (e) {
        console.log('Пользователь не авторизован');
        localStorage.removeItem('token');
      }
    }
  }
);

export { $AuthApi };
