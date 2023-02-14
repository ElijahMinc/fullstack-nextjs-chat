import { Id } from './id';

export interface User extends Id {
  name: string;
  surname: string;
  email: string;
  password: string;
}
