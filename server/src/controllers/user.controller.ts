import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

import db from '../db/models';
import UserService from '../services/user.service';
import formatResponse from '../utils/formatResponse';
import generateJwtTokens from '../utils/generateJwtTokens';
import cookieConfig from '../config/cookieConfig';
import {
  TypedResponse,
  JwtPayload,
  UserAttributes,
  RequestWithFile,
  ValidationResult,
} from '../types';

const User = db.User as {
  validateSignUpData: (data: {
    username: string;
    email: string;
    password: string;
  }) => ValidationResult;
  validateSignInData: (data: { email: string; password: string }) => ValidationResult;
  validateEmail: (email: string) => boolean;
};

class UserController {
  static async getAllUsers(_req: Request, res: Response): Promise<void> {
    try {
      const allUsers = await UserService.getAllUsers();
      res.json(formatResponse(200, 'Все пользователи', allUsers));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json(formatResponse(400, errorMessage, null, error));
    }
  }

  static async getUserById(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    try {
      const user = await UserService.getUserById(Number(userId));

      if (!user) {
        res.status(404).json(formatResponse(404, 'Пользователь не найден', null));
        return;
      }

      res.json(formatResponse(200, 'Пользователь', user));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json(formatResponse(400, errorMessage, null, error));
    }
  }

  static async refreshTokens(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.cookies as { refreshToken?: string };

      if (!refreshToken) {
        res
          .status(401)
          .json(formatResponse(401, 'Refresh token is missing', null, 'No token'));
        return;
      }

      const decoded = jwt.verify(
        refreshToken,
        process.env.SECRET_REFRESH_TOKEN as string,
      ) as JwtPayload;

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        generateJwtTokens({
          user: decoded.user,
        });

      res
        .status(200)
        .cookie('refreshToken', newRefreshToken, cookieConfig)
        .json(
          formatResponse(200, 'Сессия пользователя успешно продлена', {
            user: decoded.user,
            accessToken: newAccessToken,
          }),
        );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res
        .status(401)
        .clearCookie('refreshToken')
        .json(formatResponse(401, 'Invalid refresh token', null, errorMessage));
    }
  }

  static async signUp(req: Request, res: Response): Promise<void> {
    // прописать валидацию в моделях
    // мяу
    // мяу с:

    const { username, email, password } = req.body as {
      username: string;
      email: string;
      password: string;
    };
    const { isValid, error } = User.validateSignUpData({ username, email, password });

    if (!isValid) {
      res.status(400).json(formatResponse(400, 'Ошибка валидации', null, error));
      return;
    }

    try {
      const foundUser = await UserService.getUserByEmail(email.toLowerCase());

      if (foundUser) {
        res
          .status(400)
          .json(
            formatResponse(
              400,
              'Пользователь с такой почтой уже существует',
              null,
              'Пользователь с такой почтой уже существует',
            ),
          );
        return;
      }

      const newUser = await UserService.createUser({
        username,
        email: email.toLowerCase(),
        password,
      });

      if (!newUser) {
        res
          .status(500)
          .json(
            formatResponse(
              500,
              'Ошибка при создании нового пользователя',
              null,
              'Ошибка при создании нового пользователя',
            ),
          );
        return;
      }

      const { accessToken, refreshToken } = generateJwtTokens({ user: newUser });

      res
        .status(201)
        .cookie('refreshToken', refreshToken, cookieConfig)
        .json(
          formatResponse(201, 'Пользователь успешно зарегистрирован', {
            user: newUser,
            accessToken,
          }),
        );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, errorMessage));
    }
  }

  static async signIn(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as { email: string; password: string };
    const { isValid, error } = User.validateSignInData({ email, password });

    if (!isValid) {
      res.status(400).json(formatResponse(400, 'Ошибка валидации', null, error));
      return;
    }

    try {
      const foundUser = await UserService.getUserByEmail(email.toLowerCase());

      if (!foundUser) {
        res
          .status(400)
          .json(
            formatResponse(
              400,
              'Пользователь с такой почтой не найден',
              null,
              'Пользователь с такой почтой не найден',
            ),
          );
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, foundUser.password);

      if (!isPasswordValid) {
        res
          .status(400)
          .json(formatResponse(400, 'Невалидный пароль', null, 'Невалидный пароль'));
        return;
      }

      const userForToken: Omit<UserAttributes, 'password'> = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
      };

      const { accessToken, refreshToken } = generateJwtTokens({ user: userForToken });

      res
        .status(200)
        .cookie('refreshToken', refreshToken, cookieConfig)
        .json(formatResponse(200, 'Успешный вход', { user: userForToken, accessToken }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, errorMessage));
    }
  }

  static async signOut(_req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie('refreshToken').json(formatResponse(200, 'Успешный выход'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, errorMessage));
    }
  }

  static async updateUserById(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { username, email } = req.body as { username?: string; email?: string };

      if (!username && !email) {
        res
          .status(400)
          .json(
            formatResponse(
              400,
              'Нужно хотя бы одно поле для обновления (имя или почта)',
              null,
              'Нет полей для обновления',
            ),
          );
        return;
      }

      if (email && !User.validateEmail(email)) {
        res
          .status(400)
          .json(
            formatResponse(400, 'Некорректный формат почты', null, 'Некорректная почта'),
          );
        return;
      }

      if (email) {
        const existingUser = await UserService.getUserByEmail(email.toLowerCase());

        if (existingUser && existingUser.id !== Number(userId)) {
          res
            .status(400)
            .json(
              formatResponse(
                400,
                'Эта почта уже используется',
                null,
                'Эта почта уже существует',
              ),
            );
          return;
        }
      }

      const updatedUser = await UserService.updateUserById(Number(userId), {
        username,
        email,
      });

      if (!updatedUser) {
        res.status(404).json(formatResponse(404, 'Пользователь не найден'));
        return;
      }

      const { accessToken, refreshToken } = generateJwtTokens({ user: updatedUser });

      res
        .status(200)
        .cookie('refreshToken', refreshToken, cookieConfig)
        .json(
          formatResponse(200, 'Пользователь успешно обновлен', {
            user: updatedUser,
            accessToken,
          }),
        );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, errorMessage));
    }
  }

  static async deleteUserById(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const result = await UserService.deleteUserById(Number(userId));

      if (!result) {
        res.status(404).json(formatResponse(404, 'Пользователь для удаления не найден'));
      } else {
        res.json(formatResponse(200, 'User', { deletedCount: result }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json(formatResponse(400, errorMessage, null, error));
    }
  }
}

export default UserController;
