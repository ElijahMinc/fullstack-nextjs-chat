import { socket } from '@/config/socket';
import { $AuthApi } from '@/config/axios.http';

export const logout = async () => {
  await $AuthApi.post('/logout');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  socket.disconnect();
};
// export const logIn= (formData)=> $AuthApi.post('/auth/login',formData);

// export const signUp = (formData) => $AuthApi.post('/auth/register', formData);
