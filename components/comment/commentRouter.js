const express = require('express');
const CommentController = require('./commentController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');
const { authCheck } = require('../../middlewares/authCheck');

const router = express.Router();

router
  .post('/issue/:id/comment', authCheck, catchAsyncError(CommentController.addComment));

module.exports = router;
