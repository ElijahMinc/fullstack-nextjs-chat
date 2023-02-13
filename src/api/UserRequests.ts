import { $AuthApi } from '@/config/axios.http';

export const getUser = (userId: any) => $AuthApi.get(`/users/${userId}`);
export const updateUser = (id: any, formData: any) =>
  $AuthApi.put(`/users/${id}`, formData);
export const getAllUsers = () => $AuthApi.get('/users');
// export const followUser = (id: any, data: any) => API.put(`/user/${id}/follow`, data);
// export const unfollowUser = (id, data) => API.put(`/user/${id}/unfollow`, data);
