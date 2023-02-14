import { Id } from './id';

export interface User extends Id {
  email: string;
  password: string;
}
