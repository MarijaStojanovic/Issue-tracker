const express = require('express');
const IssueController = require('./issueController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');
const { authCheck } = require('../../middlewares/authCheck');
const { fileUpload } = require('../../lib/fileHandler');

const router = express.Router();

router
  .post('/add-issue', authCheck, catchAsyncError(IssueController.addIssue))
  .get('/issues', catchAsyncError(IssueController.getAllIssues))
  .patch('/issue/:id', authCheck, catchAsyncError(IssueController.editIssue))
  .delete('/issue/:id', authCheck, catchAsyncError(IssueController.destroyIssue))
  .get('/issue/:id', catchAsyncError(IssueController.getIssue))
  .post('/file', authCheck, fileUpload.single('file'), catchAsyncError(IssueController.uploadFile));

module.exports = router;
