const { User } = require('../db/models');

class UserService {
  static async getAllUsers() {
    try {
      const users = await User.findAll();
      return users.map((user) => user.get());
    } catch (error) {
      console.log(error);
    }
  }

  static async getUserByEmail(email) {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) return null;

      return user.get();
    } catch (error) {
      console.log(error);
    }
  }

  static async getUserById(userId) {
    try {
      const user = await User.findByPk(userId);
      return user.get();
    } catch (error) {
      console.log(error);
    }
  }

  static async createUser({ username, email, password }) {
    try {
      const user = await User.create({ username, email, password, role: 'user' });
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  static async updateUserById(userId, { username, email }) {
    try {
      const userToUpdate = await User.findByPk(userId);

      if (!userToUpdate) return null;

      if (username) userToUpdate.username = username.trim();
      if (email) userToUpdate.email = email.trim().toLowerCase();

      await userToUpdate.save();

      const updatedUser = userToUpdate.get();
      delete updatedUser.password;
      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  }

  static async deleteUserById(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) return null;

      const userData = user.get();

      await user.destroy();

      delete userData.password;
      return userData;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = UserService;
