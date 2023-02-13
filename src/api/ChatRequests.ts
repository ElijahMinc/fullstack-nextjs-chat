import { $AuthApi } from '@/config/axios.http';

export const createChat = (data: any) => $AuthApi.post('/chat', data);

export const userChats = (id: string) => $AuthApi.get(`/chat/${id}`);

export const findChat = (firstId: any, secondId: any) =>
  $AuthApi.get(`/chat/find/${firstId}/${secondId}`);
