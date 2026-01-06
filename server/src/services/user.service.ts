import db from '../db/models';
import { UserAttributes, CreateUserData, UpdateUserData } from '../types';
import { Model } from 'sequelize';

const User = db.User as typeof Model & {
  findAll: () => Promise<Model[]>;
  findOne: (options: { where: object }) => Promise<Model | null>;
  findByPk: (id: number) => Promise<Model | null>;
  create: (data: object) => Promise<Model>;
  destroy: (options: { where: object }) => Promise<number>;
};

class UserService {
  static async getAllUsers(): Promise<UserAttributes[]> {
    try {
      const users = await User.findAll();
      return users.map((user) => user.get() as UserAttributes);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  static async getUserByEmail(email: string): Promise<UserAttributes | null> {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) return null;

      return user.get() as UserAttributes;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  static async getUserById(userId: number): Promise<Model | null> {
    try {
      const user = await User.findByPk(userId);
      return user;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  static async createUser(data: CreateUserData): Promise<UserAttributes> {
    try {
      const user = await User.create(data);
      const userData = user.get() as UserAttributes;

      const { password: _password, ...userWithoutPassword } = userData;
      return userWithoutPassword as UserAttributes;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  static async updateUserById(
    userId: number,
    data: UpdateUserData,
  ): Promise<UserAttributes | null> {
    try {
      const userToUpdate = await User.findByPk(userId);

      if (!userToUpdate) return null;

      const userInstance = userToUpdate as Model & { username: string; email: string };

      if (data.username) userInstance.username = data.username.trim();
      if (data.email) userInstance.email = data.email.trim().toLowerCase();

      await userInstance.save();

      const updatedUser = userInstance.get() as UserAttributes;

      const { password: _password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword as UserAttributes;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  static async deleteUserById(userId: number): Promise<number> {
    try {
      const result = await User.destroy({ where: { id: userId } });
      return result;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Unknown error');
    }
  }
}

export default UserService;
