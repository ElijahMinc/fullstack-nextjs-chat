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

export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

const $AuthApi = axios.create({
  withCredentials: true, // чтобы к каждому полю автомат. были куки
  baseURL: API_URL,
});

// interceprot - перехватчик

$AuthApi.interceptors.request.use((config) => {
  console.log('local', localStorage);
  if (!!config.headers) {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }

  return config;
});

$AuthApi.interceptors.response.use(
  (config) => config,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;

      try {
        const response = await axios.get<AuthResponse>(
          `${API_URL}/auth/refresh`,
          {
            withCredentials: true,
          }
        );
        localStorage.setItem('token', response.data.accessToken);

        return $AuthApi.request(originalRequest);
      } catch (e) {
        console.log('Пользователь не авторизован');
        localStorage.removeItem('token');
      }
      throw err; // ошибка у которой не 401 статус-код
    }
  }
);

export { $AuthApi };
