require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const PORT = process.env.NEXT_PORT || 5000;
const app = express();
console.log('PORT', PORT);
const errorMiddleware = require('./middleware/error-middleware');
const router = require('./router/index');

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
    app.listen(PORT, () => console.log(`Server started on ${PORT} port`));
  } catch (e) {
    console.log(e);
  }
};

start();
