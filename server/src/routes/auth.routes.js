const authRouter = require('express').Router();
const UserController = require('../controllers/user.controller');

authRouter
  .get('/refreshTokens', UserController.refreshTokens)
  .post('/signUp', UserController.signUp)
  .post('/signIn', UserController.signIn)
  .delete('/signOut', UserController.signOut);

module.exports = authRouter;
