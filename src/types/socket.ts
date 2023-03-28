import { Chat } from './conversations';
import { UNIVERSE_ID } from './id';
import { Nullable } from './Nullable';
import { User } from './user';

export type NewUserAdd = User['_id'];

export interface ReceiveOrSendMessageInterface {
  senderId: User['_id'];
  receiverId: User['_id'];
  chatId: Nullable<Chat['_id']>;
  authorName: string;
  text: string;
}

export interface ActiveUsersInterface {
  userId: User['_id'];
  socketId: UNIVERSE_ID;
}

export enum SOCKET_EMIT_KEYS {
  'NEW:USER:ADD' = 'NEW:USER:ADD',
  'NEW:MESSAGE:ADD' = 'NEW:MESSAGE:ADD',
  'RECEIVE:MESSAGE' = 'RECEIVE:MESSAGE',
  'GET:USERS' = 'GET:USERS',
}

export enum SOCKET_ON_KEYS {
  'NEW:USER:ADD' = 'NEW:USER:ADD',
  'NEW:MESSAGE:ADD' = 'NEW:MESSAGE:ADD',
  'RECEIVE:MESSAGE' = 'RECEIVE:MESSAGE',
  'GET:USERS' = 'GET:USERS',
}

export interface ServerToClientEvents {
  'NEW:USER:ADD': (userId: NewUserAdd) => void;
  'NEW:MESSAGE:ADD': (message: ReceiveOrSendMessageInterface) => void;
  'RECEIVE:MESSAGE': (receiveMessage: ReceiveOrSendMessageInterface) => void;
  'GET:USERS': (allMessagesByRoomId: ActiveUsersInterface[]) => void;
}

export interface ClientToServerEvents {
  'NEW:USER:ADD': (userId: NewUserAdd) => void;
  'NEW:MESSAGE:ADD': (message: ReceiveOrSendMessageInterface) => void;
  'RECEIVE:MESSAGE': (receiveMessage: ReceiveOrSendMessageInterface) => void;
  'GET:USERS': (allMessagesByRoomId: ActiveUsersInterface[]) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
