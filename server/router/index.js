const Router = require('express').Router;
const userController = require('../controller/user-controller');
const router = new Router();
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth-middleware');
const MessageController = require('../controller/message-controller');
const ChatController = require('../controller/chat-contoller');

//Message
router.post('/message/', MessageController.addMessage);

router.get('/message/:chatId', MessageController.getMessages);

//Chats
router.post('/chat', ChatController.createChat);
router.get('/chat/:userId', ChatController.userChats);
router.get('/chat/find/:firstId/:secondId', ChatController.findChat);

router.post(
  '/auth/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 32 }),
  userController.registration
);

router.post(
  '/auth/login',
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 32 }),
  userController.login
);
router.get('/auth/refresh', userController.refresh); // для перезаписи access tokena (удаления токена из БД)

router.post('/logout', userController.logout); // для рефреш токена
router.get('/activate/:link', userController.activate); // для активации аккаунта по ссылке
router.get('/users', authMiddleware, userController.getUsers); // тестовый енд для получения списка юзера
router.get('/users/:id', authMiddleware, userController.getUserById); // тестовый енд для получения списка юзера

module.exports = router;
