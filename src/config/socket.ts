import { io } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@/types/socket';
import { Socket } from 'socket.io-client';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.NEXT_PUBLIC_API_URL!,
  {
    transports: ['websocket'],
    auth: {
      token: '',
    },
  }
);
