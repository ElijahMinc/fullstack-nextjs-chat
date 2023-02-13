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

// interceprot - перехватчик

$AuthApi.interceptors.request.use((config) => {
  if (!!config.headers) {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }

  return config;
});

$AuthApi.interceptors.response.use(
  (config) => config,
  async (err) => {
    const originalRequest = err.config;

    if (err.response.status !== 401) {
      throw err; // ошибка у которой не 401 статус-код
    }

    if (originalRequest && !originalRequest._isRetry) {
      originalRequest._isRetry = true;

      try {
        const response = await axios.get<AuthResponse>(`/auth/refresh`, {
          withCredentials: true,
        });
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
