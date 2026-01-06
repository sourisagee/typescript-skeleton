import { DataTypes, Sequelize, Model } from 'sequelize';
import bcrypt from 'bcrypt';
import {
  UserAttributes,
  UserCreationAttributes,
  DbModels,
  SignInData,
  SignUpData,
  ValidationResult,
} from '../../types';

const BCRYPT_ROUNDS = 10;
const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare username: string;
  declare email: string;
  declare password: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static associate(models: DbModels): void {
    this.hasMany(models.Task, {
      foreignKey: 'user_id',
    });
  }

  static validateEmail(email: string): boolean {
    return EMAIL_PATTERN.test(email);
  }

  static validatePassword(password: string): boolean {
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasNumbers = /\d/;
    const hasSpecialCharacters = /[!@#$%^&*()\-,.?":{}|<>]/;
    const isValidLength = password.length >= 8;

    return (
      hasUpperCase.test(password) &&
      hasLowerCase.test(password) &&
      hasNumbers.test(password) &&
      hasSpecialCharacters.test(password) &&
      isValidLength
    );
  }

  static validateSignInData({ email, password }: SignInData): ValidationResult {
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return {
        isValid: false,
        error: 'Email не может быть пустым',
      };
    }

    if (!password || typeof password !== 'string' || password.trim().length === 0) {
      return {
        isValid: false,
        error: 'Password не может быть пустым',
      };
    }

    return {
      isValid: true,
      error: null,
    };
  }

  static validateSignUpData({ username, email, password }: SignUpData): ValidationResult {
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return {
        isValid: false,
        error: 'Username не может быть пустым',
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
          'Пароль не может быть пустым и должен иметь по одной букве в верхнем и нижнем регистре, один специальный символ и иметь длину хотя бы 8 символов',
      };
    }

    return {
      isValid: true,
      error: null,
    };
  }
}

export default (sequelize: Sequelize): typeof User => {
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      username: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      hooks: {
        beforeCreate: async (newUser: User): Promise<void> => {
          const hashedPassword = await bcrypt.hash(newUser.password, BCRYPT_ROUNDS);
          newUser.password = hashedPassword;
          newUser.email = newUser.email.trim().toLowerCase();
          newUser.username = newUser.username.trim();
        },
        afterCreate: (newUser: User): void => {
          newUser.password = '';
        },
      },
    },
  );

  return User;
};

// 'use strict';
// const { Model } = require('sequelize');
// const bcrypt = require('bcrypt');

// module.exports = (sequelize, DataTypes) => {
//   class User extends Model {
//     static associate(models) {
//       User.hasMany(models.Task, {
//         foreignKey: 'user_id',
//       });
//     }

//     static validateEmail(email) {
//       const emailPattern = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}$/;
//       return emailPattern.test(email);
//     }

//     static validatePassword(password) {
//       const hasUpperCase = /[A-Z]/;
//       const hasLowerCase = /[a-z]/;
//       const hasNumbers = /\d/;
//       const hasSpecialCharacters = /[!@#$%^&*()-,.?":{}|<>]/;
//       const isValidLength = password.length >= 8;

//       if (
//         !hasUpperCase.test(password) ||
//         !hasLowerCase.test(password) ||
//         !hasNumbers.test(password) ||
//         !hasSpecialCharacters.test(password) ||
//         !isValidLength
//       ) {
//         return false;
//       }

//       return true;
//     }

//     static validateSignUpData({ username, email, password }) {
//       if (!username || typeof username !== 'string' || username.trim().length === 0) {
//         return {
//           isValid: false,
//           error: 'Введите имя пользователя',
//         };
//       }

//       if (
//         !email ||
//         typeof email !== 'string' ||
//         email.trim().length === 0 ||
//         !this.validateEmail(email)
//       ) {
//         return {
//           isValid: false,
//           error: 'Email должен быть валиден',
//         };
//       }

//       if (
//         !password ||
//         typeof password !== 'string' ||
//         password.trim().length === 0 ||
//         !this.validatePassword(password)
//       ) {
//         return {
//           isValid: false,
//           error:
//             'Пароль не должен быть пустным и должен содержать одну прописную букву, одну строчную букву, один специальный символ и хотя бы 8 символов.',
//         };
//       }

//       return {
//         isValid: true,
//         error: null,
//       };
//     }

//     static validateSignInData({ email, password }) {
//       if (!email || typeof email !== 'string' || email.trim().length === 0) {
//         return {
//           isValid: false,
//           error: 'Email не должен быть пустым',
//         };
//       }

//       if (!password || typeof password !== 'string' || password.trim().length === 0) {
//         return {
//           isValid: false,
//           error: 'Пароль не должен быть пустым',
//         };
//       }

//       return {
//         isValid: true,
//         error: null,
//       };
//     }
//   }

//   User.init(
//     {
//       username: DataTypes.STRING,
//       email: DataTypes.STRING,
//       password: DataTypes.STRING,
//       role: DataTypes.ENUM('admin', 'user'),
//     },
//     {
//       sequelize,
//       hooks: {
//         beforeCreate: async (newUser) => {
//           const hashedPassword = await bcrypt.hash(newUser.password, 10);
//           newUser.password = hashedPassword;

//           newUser.email = newUser.email.trim().toLowerCase();
//           newUser.username = newUser.username.trim();
//         },
//         afterCreate: async (newUser) => {
//           const rawUser = newUser.get();

//           delete rawUser.password;
//           return rawUser;
//         },
//       },
//       modelName: 'User',
//     },
//   );
//   return User;
// };
