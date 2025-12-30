const apiRouter = require('express').Router();
const authRouter = require('./auth.routes');
const userRouter = require('./user.routes');
const taskRouter = require('./task.routes');

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/tasks', taskRouter);

module.exports = apiRouter;
