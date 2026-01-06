import { Router } from 'express';
import TaskController from '../controllers/task.controller';
import verifyAccessToken from '../middleware/verifyAccessToken';
import verifyTaskOwner from '../middleware/verifyTaskOwner';

const taskRouter = Router();

taskRouter
  .route('/')
  .get(TaskController.getAllTasks)
  .post(verifyAccessToken, TaskController.createTask);

taskRouter.get('/user/:userId', TaskController.getTasksByUserId);

taskRouter
  .route('/:taskId')
  .get(TaskController.getTaskById)
  .put(verifyAccessToken, verifyTaskOwner, TaskController.updateTask)
  .delete(verifyAccessToken, verifyTaskOwner, TaskController.deleteTask);

export default taskRouter;
