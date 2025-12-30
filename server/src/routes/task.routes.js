const taskRouter = require('express').Router();
const TaskController = require('../controllers/task.controller');
const verifyAccessToken = require('../middleware/verifyAccessToken');
const verifyTaskOwner = require('../middleware/verifyTaskOwner');

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

module.exports = taskRouter;
