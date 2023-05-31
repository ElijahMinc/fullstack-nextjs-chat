const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const cloudinary = require('../utils/cloudinary');

class UserService {
  async registration({ email, password, name, surname, image }) {
    console.log('email', email);
    const candidate = await UserModel.findOne({ email });

    if (!!candidate) {
      throw ApiError.BadRequest('Пользователь с таким email уже существует');
    }

    const hashPassword = await bcrypt.hash(password, 3);

    const userData = {
      name,
      surname,
      email,
      password: hashPassword,
    };

    const user = await UserModel.create(userData);

    if (!!image) {
      // const generateUniqueName =
      const result = await cloudinary.uploader.upload(image.path, {
        folder: `smoothchat/${user._id}`,
      });

      user.cloudinaryId = result.public_id;
      user.avatarUrl = result.secure_url;

      await user.save();
    }

    const userDto = new UserDto(user); // id, email, isActivated

    const tokens = tokenService.generateTokens({ ...userDto }); //just obj, not instance userDto

    console.log('userDto', userDto);

    await tokenService.saveToken(userDto._id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest('Некорректная ссылка активации');
    }
    user.isActivated = true;

    await user.save();
  }

  async login({ email, password, name, surname }) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw ApiError.BadRequest('Пользователь с таким email не был найден');
    }

    const isPassEquals = await bcrypt.compare(password, user.password);

    if (!isPassEquals) {
      throw ApiError.BadRequest('Неверный пароль!');
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto._id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);

    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await UserModel.findById(userData._id);

    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto._id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }

  async updateUser(userId, data) {
    const users = await UserModel.findOneAndUpdate({ _id: userId }, data);
    return users;
  }

  async getUserById(id) {
    const user = await UserModel.findById(id);
    return user;
  }
}

module.exports = new UserService();
