import db from '../db/models';
import { TaskAttributes, CreateTaskData, UpdateTaskData } from '../types';
import { Model } from 'sequelize';

const Task = db.Task as typeof Model & {
  findAll: (options?: object) => Promise<Model[]>;
  findByPk: (id: number, options?: object) => Promise<Model | null>;
  create: (data: object) => Promise<Model>;
  destroy: (options: { where: object }) => Promise<number>;
};

const User = db.User as typeof Model;

class TaskService {
  static async getAllTasks(): Promise<TaskAttributes[]> {
    try {
      const tasks = await Task.findAll({
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'email'],
          },
        ],
      });

      return tasks.map((task) => task.get() as TaskAttributes);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  static async getTasksByUserId(userId: number): Promise<TaskAttributes[]> {
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

      return userTasks.map((task) => task.get() as TaskAttributes);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  static async getTaskById(taskId: number): Promise<TaskAttributes | null> {
    try {
      const task = await Task.findByPk(taskId, {
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'email'],
          },
        ],
      });

      return task ? (task.get() as TaskAttributes) : null;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  static async createTask(data: CreateTaskData): Promise<TaskAttributes> {
    try {
      const newTask = await Task.create({
        title: data.title,
        status: data.status || false,
        user_id: data.user_id,
      });

      return newTask.get() as TaskAttributes;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  static async updateTask(
    taskId: number,
    data: UpdateTaskData,
  ): Promise<TaskAttributes | null> {
    try {
      const taskToUpdate = await Task.findByPk(taskId);

      if (!taskToUpdate) return null;

      const taskInstance = taskToUpdate as Model & { title: string; status: boolean };

      if (data.title !== undefined) taskInstance.title = data.title;
      if (data.status !== undefined) taskInstance.status = data.status;

      await taskInstance.save();

      return taskInstance.get() as TaskAttributes;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  static async deleteTask(taskId: number): Promise<number> {
    try {
      const result = await Task.destroy({ where: { id: taskId } });
      return result;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}

export default TaskService;
