import { $AuthApi } from '@/config/axios.http';

export const getMessages = (id: string) => $AuthApi.get(`/message/${id}`);

export const addMessage = (data: string) => $AuthApi.post('/message/', data);
