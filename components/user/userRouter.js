const express = require('express');
const UserController = require('./userController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');
const { authCheck } = require('../../middlewares/authCheck');

const router = express.Router();

router
  .post('/user-add', authCheck, catchAsyncError(UserController.addUser))
  .post('/signin', catchAsyncError(UserController.signIn))
  .post('/change-password', authCheck, catchAsyncError(UserController.changePassword))
  .get('/me', authCheck, catchAsyncError(UserController.getUser));

module.exports = router;
