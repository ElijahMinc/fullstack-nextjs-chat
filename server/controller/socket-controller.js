import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from '@/types/socket';
import * as core from 'express-serve-static-core';
import http from 'http';
import { Server, Socket } from 'socket.io';

// import roomService from '../../services/RoomService';
import { v4 as uuidV4 } from 'uuid';

let activeUsers = [];

export class SocketController {
  constructor(expressApp) {
    this.server = http.createServer(expressApp);
    this.io = new Server(this.server);

    this.init();
  }

  addNewUser(newUserId) {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log('New User Connected', activeUsers);
    }
    // send all active users to new user
    this.io.emit('GET:USERS', activeUsers);
  }

  newMessage(data) {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log('Sending from socket to :', receiverId);
    console.log('Data: ', data);
    if (user) {
      this.io.to(user.socketId).emit('RECEIVE:MESSAGE', data);
    }
  }

  messageWriting() {}

  disconnect() {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log('User Disconnected', activeUsers);
    // send all active users to all users
    this.io.emit('GET:USERS', activeUsers);
  }

  init() {
    this.io.on('connection', (socket) => {
      socket.on('NEW:USER:ADD', (newUserId) => this.addNewUser(newUserId));

      // send message to a specific user
      socket.on('NEW:MESSAGE:ADD', (data) => this.newMessage(data));

      socket.on('disconnect', this.disconnect);
    });
  }
}

export default SocketController;
