import { Id } from './id';
import { User } from './user';

export interface Chat extends Id {
  members: User['_id'][];
}
