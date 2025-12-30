const TaskService = require('../services/task.service');
const formatResponse = require('../utils/formatResponse');

class TaskController {
  static async getAllTasks(req, res) {
    try {
      const allTasks = await TaskService.getAllTasks();

      return res.json(formatResponse(200, 'All tasks', allTasks));
    } catch (error) {
      res
        .status(500)
        .json(formatResponse(500, 'Failed to get all tasks', null, error.message));
    }
  }

  static async getTasksByUserId(req, res) {
    try {
      const { userId } = req.params;
      const userTasks = await TaskService.getTasksByUserId(userId);

      return res.json(formatResponse(200, 'User tasks', userTasks));
    } catch (error) {
      res
        .status(500)
        .json(formatResponse(500, 'Failed to get user tasks', null, error.message));
    }
  }

  static async getTaskById(req, res) {
    try {
      const { taskId } = req.params;
      const task = await TaskService.getTaskById(taskId);

      if (!task) return res.status(404).json(formatResponse(404, 'Task not found'));

      return res.json(formatResponse(200, 'Task', task));
    } catch (error) {
      res
        .status(500)
        .json(formatResponse(500, 'Failed to get task', null, error.message));
    }
  }

  static async createTask(req, res) {
    try {
      const { title, status } = req.body;
      const user_id = res.locals.user.id;

      if (!user_id) {
        return res.status(400).json(formatResponse(400, 'User ID is required'));
      }

      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json(formatResponse(400, 'Title is invalid'));
      }

      const newTask = await TaskService.createTask({ title, status, user_id });

      return res
        .status(201)
        .json(formatResponse(201, 'Task successfully created', newTask));
    } catch (error) {
      res
        .status(500)
        .json(formatResponse(500, 'Failed to create task', null, error.message));
    }
  }

  static async updateTask(req, res) {
    try {
      const task = res.locals.task;
      const { title, status } = req.body;

      if (title !== undefined) task.title = title;
      if (status !== undefined) task.status = status;

      await task.save();

      return res.json(formatResponse(200, 'Task successfully updated', task.get()));
    } catch (error) {
      res
        .status(500)
        .json(formatResponse(500, 'Failed to update task', null, error.message));
    }
  }

  static async deleteTask(req, res) {
    try {
      const task = res.locals.task;

      await task.destroy();

      return res.json(formatResponse(200, 'Task successfully deleted'));
    } catch (error) {
      res
        .status(500)
        .json(formatResponse(500, 'Failed to delete task', null, error.message));
    }
  }
}

module.exports = TaskController;
