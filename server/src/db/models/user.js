'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Task, {
        foreignKey: 'user_id',
      });
    }

    static validateEmail(email) {
      const emailPattern = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}$/;
      return emailPattern.test(email);
    }

    static validatePassword(password) {
      const hasUpperCase = /[A-Z]/;
      const hasLowerCase = /[a-z]/;
      const hasNumbers = /\d/;
      const hasSpecialCharacters = /[!@#$%^&*()-,.?":{}|<>]/;
      const isValidLength = password.length >= 8;

      if (
        !hasUpperCase.test(password) ||
        !hasLowerCase.test(password) ||
        !hasNumbers.test(password) ||
        !hasSpecialCharacters.test(password) ||
        !isValidLength
      ) {
        return false;
      }

      return true;
    }

    static validateSignUpData({ username, email, password }) {
      if (!username || typeof username !== 'string' || username.trim().length === 0) {
        return {
          isValid: false,
          error: 'Введите имя пользователя',
        };
      }

      if (
        !email ||
        typeof email !== 'string' ||
        email.trim().length === 0 ||
        !this.validateEmail(email)
      ) {
        return {
          isValid: false,
          error: 'Email должен быть валиден',
        };
      }

      if (
        !password ||
        typeof password !== 'string' ||
        password.trim().length === 0 ||
        !this.validatePassword(password)
      ) {
        return {
          isValid: false,
          error:
            'Пароль не должен быть пустным и должен содержать одну прописную букву, одну строчную букву, один специальный символ и хотя бы 8 символов.',
        };
      }

      return {
        isValid: true,
        error: null,
      };
    }

    static validateSignInData({ email, password }) {
      if (!email || typeof email !== 'string' || email.trim().length === 0) {
        return {
          isValid: false,
          error: 'Email не должен быть пустым',
        };
      }

      if (!password || typeof password !== 'string' || password.trim().length === 0) {
        return {
          isValid: false,
          error: 'Пароль не должен быть пустым',
        };
      }

      return {
        isValid: true,
        error: null,
      };
    }
  }

  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.ENUM('admin', 'user'),
    },
    {
      sequelize,
      hooks: {
        beforeCreate: async (newUser) => {
          const hashedPassword = await bcrypt.hash(newUser.password, 10);
          newUser.password = hashedPassword;

          newUser.email = newUser.email.trim().toLowerCase();
          newUser.username = newUser.username.trim();
        },
        afterCreate: async (newUser) => {
          const rawUser = newUser.get();

          delete rawUser.password;
          return rawUser;
        },
      },
      modelName: 'User',
    },
  );
  return User;
};
