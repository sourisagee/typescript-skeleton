import { Request, Response } from 'express';
import TaskService from '../services/task.service';
import formatResponse from '../utils/formatResponse';
import { TypedResponse } from '../types';

class TaskController {
  static async getAllTasks(req: Request, res: Response): Promise<void> {
    try {
      const allTasks = await TaskService.getAllTasks();

      res.json(formatResponse(200, 'All tasks', allTasks));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res
        .status(500)
        .json(formatResponse(500, 'Failed to get tasks', null, errorMessage));
    }
  }

  static async getTasksByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const userTasks = await TaskService.getTasksByUserId(Number(userId));

      res.json(formatResponse(200, 'User tasks', userTasks));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res
        .status(500)
        .json(formatResponse(500, 'Failed to get user tasks', null, errorMessage));
    }
  }

  static async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;
      const task = await TaskService.getTaskById(Number(taskId));

      if (!task) {
        res.status(404).json(formatResponse(404, 'Task not found', null));
        return;
      }

      res.json(formatResponse(200, 'Task', task));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json(formatResponse(500, 'Failed to get task', null, errorMessage));
    }
  }

  static async createTask(req: Request, res: TypedResponse): Promise<void> {
    try {
      const { title, status } = req.body as {
        title?: string;
        status?: boolean;
        user_id?: number;
      };
      const user_id = res.locals.user?.id;

      if (!user_id) {
        res.status(400).json(formatResponse(400, 'User ID is required'));
        return;
      }

      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        res.status(400).json(formatResponse(400, 'Title is invalid'));
        return;
      }

      const newTask = await TaskService.createTask({ title, status, user_id });

      res.status(201).json(formatResponse(201, 'Task successfully created', newTask));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res
        .status(500)
        .json(formatResponse(500, 'Failed to create task', null, errorMessage));
    }
  }

  static async updateTask(req: Request, res: TypedResponse): Promise<void> {
    try {
      const task = res.locals.task;

      if (!task) {
        res.status(404).json(formatResponse(404, 'Task not found'));
        return;
      }

      const { title, status } = req.body as { title?: string; status?: boolean };

      if (title !== undefined) (task as unknown as { title: string }).title = title;
      if (status !== undefined) (task as unknown as { status: boolean }).status = status;

      await (task as unknown as { save: () => Promise<void> }).save();

      res.json(
        formatResponse(
          200,
          'Task successfully updated',
          (task as unknown as { get: () => object }).get(),
        ),
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res
        .status(500)
        .json(formatResponse(500, 'Failed to update task', null, errorMessage));
    }
  }

  static async deleteTask(_req: Request, res: Response): Promise<void> {
    try {
      const task = res.locals.task;

      if (!task) {
        res.status(404).json(formatResponse(404, 'Task not found'));
        return;
      }

      await (task as unknown as { destroy: () => Promise<void> }).destroy();

      res.json(formatResponse(200, 'Task successfully deleted'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res
        .status(500)
        .json(formatResponse(500, 'Failed to delete task', null, errorMessage));
    }
  }
}

export default TaskController;
