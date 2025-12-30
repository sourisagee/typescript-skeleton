const { User } = require('../db/models');
const UserService = require('../services/user.service');
const formatResponse = require('../utils/formatResponse');
const generateJwtTokens = require('../utils/generateJwtTokens');
const cookieConfig = require('../config/cookieConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserController {
  static async getAllUsers(req, res) {
    try {
      const allUsers = await UserService.getAllUsers();
      return res.json(formatResponse(200, 'Все пользователи', allUsers));
    } catch (error) {
      res.status(400).json(formatResponse(400, error.message, null, error));
    }
  }

  static async getUserById(req, res) {
    const { userId } = req.params;

    try {
      const user = await UserService.getUserById(userId);

      return res.status(200).json(formatResponse(200, 'Пользователь', user));
    } catch (error) {
      res.status(400).json(formatResponse(400, error.message, null, error));
    }
  }

  static async refreshTokens(req, res) {
    try {
      const { refreshToken } = req.cookies;
      const { user } = jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN);
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        generateJwtTokens({ user });

      return res
        .status(200)
        .cookie('refreshToken', newRefreshToken, cookieConfig)
        .json(
          formatResponse(200, 'Сессия пользователя успешно продлена', {
            user,
            accessToken: newAccessToken,
          }),
        );
    } catch ({ message }) {
      return res
        .status(401)
        .clearCookie('refreshToken')
        .json(formatResponse(401, 'Невалидный refresh token', null, message));
    }
  }

  static async signUp(req, res) {
    // прописать валидацию в моделях
    // мяу
    // мяу с:

    const { username, email, password } = req.body;
    const { isValid, error } = User.validateSignUpData({ username, email, password });

    if (!isValid) {
      return res.status(400).json(formatResponse(400, 'Ошибка валидации', null, error));
    }

    try {
      const foundUser = await UserService.getUserByEmail(email.toLowerCase());

      if (foundUser) {
        return res
          .status(400)
          .json(
            formatResponse(
              500,
              'Пользователь с такой почтой уже существует',
              null,
              'Пользователь с такой почтой уже существует',
            ),
          );
      }

      const newUser = await UserService.createUser({ username, email, password });

      if (!newUser) {
        return res
          .status(500)
          .json(
            formatResponse(
              500,
              'Ошибка при создании нового пользователя',
              null,
              'Ошибка при создании нового пользователя',
            ),
          );
      }

      const { accessToken, refreshToken } = generateJwtTokens({ user: newUser });

      return res
        .status(201)
        .cookie('refreshToken', refreshToken, cookieConfig)
        .json(
          formatResponse(201, 'Пользователь успешно зарегистрирован', {
            user: newUser,
            accessToken,
          }),
        );
    } catch ({ message }) {
      return res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }

  static async signIn(req, res) {
    const { email, password } = req.body;
    const { isValid, error } = await User.validateSignInData({ email, password });

    if (!isValid) {
      return res.status(400).json(formatResponse(400, 'Ошибка валидации', null, error));
    }

    try {
      const foundUser = await UserService.getUserByEmail(email.toLowerCase());

      if (!foundUser) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              'Пользователь с такой почтой не найден',
              null,
              'Пользователь с такой почтой не найден',
            ),
          );
      }

      const isPasswordValid = await bcrypt.compare(password, foundUser.password);

      if (!isPasswordValid) {
        return res
          .status(400)
          .json(formatResponse(400, 'Невалидный пароль', null, 'Невалидный пароль'));
      }

      const { accessToken, refreshToken } = generateJwtTokens({ user: foundUser });

      return res
        .status(200)
        .cookie('refreshToken', refreshToken, cookieConfig)
        .json(formatResponse(200, 'Успешный вход', { user: foundUser, accessToken }));
    } catch ({ message }) {
      return res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }

  static async signOut(req, res) {
    try {
      return res.clearCookie('refreshToken').json(formatResponse(200, 'Успешный выход'));
    } catch ({ message }) {
      return res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }

  static async updateUserById(req, res) {
    try {
      const { userId } = req.params;
      const { username, email } = req.body;

      if (!username && !email) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              'Нужно хотя бы одно поле для обновления (имя или почта)',
              null,
              'Нет полей для обновления',
            ),
          );
      }

      if (email && !User.validateEmail(email)) {
        return res
          .status(400)
          .json(
            formatResponse(400, 'Некорректный формат почты', null, 'Некорректная почта'),
          );
      }

      if (email) {
        const existingUser = await UserService.getUserByEmail(email.toLowerCase());

        if (existingUser && typeof existingUser === 'object' && existingUser.id !== userId)
          return res
            .status(400)
            .json(
              formatResponse(
                400,
                'Эта почта уже используется',
                null,
                'Эта почта уже существует',
              ),
            );
      }

      const updatedUser = await UserService.updateUserById(userId, { username, email });

      if (!updatedUser) {
        return res.status(404).json(formatResponse(404, 'Пользователь не найден'));
      }

      const { accessToken, refreshToken } = generateJwtTokens({ user: updatedUser });

      return res
        .status(200)
        .cookie('refreshToken', refreshToken, cookieConfig)
        .json(
          formatResponse(200, 'Пользователь успешно обновлен', {
            user: updatedUser,
            accessToken,
          }),
        );
    } catch (error) {
      return res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, error.message));
    }
  }

  static async deleteUserById(req, res) {
    try {
      const { userId } = req.params;
      const userToDelete = await UserService.deleteUserById(userId);

      if (!userToDelete) {
        return res
          .status(404)
          .json(formatResponse(404, 'Пользователь для удаления не найден'));
      } else {
        return res.json(formatResponse(200, 'User', userToDelete));
      }
    } catch (error) {
      return res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, error.message));
    }
  }
}

module.exports = UserController;
