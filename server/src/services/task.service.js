const { Task, User } = require('../db/models');

class TaskService {
  static async getAllTasks() {
    try {
      const tasks = await Task.findAll({
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'email'],
          },
        ],
      });

      if (!tasks) return null;

      return tasks.map((task) => task.get());
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getTasksByUserId(userId) {
    try {
      const userTasks = await Task.findAll({
        where: {
          user_id: userId,
        },
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'email'],
          },
        ],
      });

      if (!userTasks) return null;

      return userTasks.map((task) => task.get());
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getTaskById(taskId) {
    try {
      const task = await Task.findByPk(taskId, {
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'email'],
          },
        ],
      });

      return task ? task.get() : null;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async createTask({ title, status, user_id }) {
    try {
      const newTask = await Task.create({ title, status: status || false, user_id });

      return newTask.get();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async updateTask(taskId, { title, status }) {
    try {
      const taskToUpdate = await Task.findByPk(taskId);

      if (!taskToUpdate) return null;

      if (title !== undefined) taskToUpdate.title = title;
      if (status !== undefined) taskToUpdate.status = status;

      await taskToUpdate.save();

      return taskToUpdate.get();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async deleteTask(taskId) {
    try {
      return await Task.destroy({ where: { id: taskId } });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = TaskService;
