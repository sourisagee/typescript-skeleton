const userRouter = require('express').Router();
const UserController = require('../controllers/user.controller')

userRouter
  .get('/', UserController.getAllUsers)

userRouter
  .route('/:userId')
  .get(UserController.getUserById)
  .put(UserController.updateUserById) 
  .delete(UserController.deleteUserById) 

module.exports = userRouter;
