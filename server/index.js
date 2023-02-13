require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const PORT = process.env.NEXT_PORT || 5000;
const app = express();
console.log('PORT', PORT);
const errorMiddleware = require('./middleware/error-middleware');
const router = require('./router');
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true, //
    origin: process.env.NEXT_PUBLIC_CLIENT_URL,
  })
);
app.use('/api', router);

app.use(errorMiddleware);

const start = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.NEXT_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    server.listen(PORT, () => console.log(`Server started on ${PORT} port`));
  } catch (e) {
    console.log(e);
  }
};

let activeUsers = [];

io.on('connection', (socket) => {
  // add new User
  socket.on('new-user-add', (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log('New User Connected', activeUsers);
    }
    // send all active users to new user
    io.emit('get-users', activeUsers);
  });

  socket.on('disconnect', () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log('User Disconnected', activeUsers);
    // send all active users to all users
    io.emit('get-users', activeUsers);
  });

  // send message to a specific user
  socket.on('send-message', (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log('Sending from socket to :', receiverId);
    console.log('Data: ', data);
    if (user) {
      io.to(user.socketId).emit('recieve-message', data);
    }
  });
});

start();
