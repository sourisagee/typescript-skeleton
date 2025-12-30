const mainRouter = require('express').Router();
const apiRouter = require('./api.routes');

mainRouter.use('/api', apiRouter);

module.exports = mainRouter;
