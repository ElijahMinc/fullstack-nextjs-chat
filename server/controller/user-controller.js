const userService = require('../service/user-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');

const thirtyDays = 30 * 24 * 60 * 10 * 1000; // 30d
class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации', errors.array())
        );
      }

      const { email, password, name, surname } = req.body;
      const image = req?.file ?? '';
      console.log('image.size', image.size);
      if (image && image.size >= 775481) {
        // 0.7 мб
        return next(ApiError.BadRequest('File is very big', errors.array()));
      }

      const userData = await userService.registration({
        email,
        password,
        name,
        surname,
        image,
      });

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: thirtyDays, // 30d
        httpOnly: true, // Эти куки нельзя получать из браузера с помощью js
      });

      return res.json(userData);
    } catch (e) {
      console.log(e);

      next(e);
    }
  }
  async login(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации', errors.array())
        );
      }

      const { email, password, name, surname } = req.body;
      const userData = await userService.login({
        email,
        password,
        name,
        surname,
      });

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: thirtyDays, // 30d,
        httpOnly: true, // Эти куки нельзя получать из браузера с помощью js
      });

      return res.json(userData);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);

      return res.redirect(process.env.CLIENT_URL); //редирект на основной URL
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: thirtyDays, 
        httpOnly: true,
      });

      return res.json(userData);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();

      res.json(users);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async updateUser(req, res, next) {
    try {
      const userId = req.params.id;
      const data = req.body;
      const user = await userService.updateUser(userId, data);

      res.json(user);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);

      res.json(user);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}

module.exports = new UserController();
