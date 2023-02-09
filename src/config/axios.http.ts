import axios from 'axios';

const $AuthApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

export { $AuthApi };
