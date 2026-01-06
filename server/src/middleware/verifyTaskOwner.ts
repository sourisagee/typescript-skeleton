import { Request, NextFunction } from 'express';
import db from '../db/models';
import formatResponse from '../utils/formatResponse';
import { TypedResponse } from '../types';
import { Model } from 'sequelize';

const Task = db.Task as typeof Model & {
  findByPk: (id: number) => Promise<(Model & { user_id: number }) | null>;
};

export default async function verifyTaskOwner(
  req: Request,
  res: TypedResponse,
  next: NextFunction,
): Promise<void> {
  try {
    const { taskId } = req.params;
    const userId = res.locals.user?.id;

    if (!userId) {
      res
        .status(401)
        .json(
          formatResponse(
            401,
            'Пользователь не авторизован',
            null,
            'Нет данных пользователя',
          ),
        );
      return;
    }

    const task = await Task.findByPk(Number(taskId));

    if (!task) {
      res.status(404).json(formatResponse(404, 'Задача не найдена'));
      return;
    }

    if (task.user_id !== userId) {
      res
        .status(403)
        .json(
          formatResponse(
            403,
            'Доступ запрещен',
            null,
            'Вы можете модифицировать только свои заадчи',
          ),
        );
      return;
    }

    res.locals.task = task as unknown as TypedResponse['locals']['task'];

    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    res
      .status(500)
      .json(formatResponse(500, 'Внутренняя ошибка сервера', null, errorMessage));
  }
}
