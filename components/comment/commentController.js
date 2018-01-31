const { Issue, Comment } = require('../../models');

/**
 * @api {post} /issue/:id/comment Add new comment
 * @apiVersion 1.0.0
 * @apiName addComment
 * @apiDescription Add new comment to issue
 * @apiGroup Comment
 *
 * @apiParam (body) {String} data Comment data
 * @apiParam (params) {String} :id Issue Mongo _id
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
 {
    "message": "Successfully added new comment to issue",
    "results": {
      "__v": 0,
      "updatedAt": "2018-01-30T23:28:25.158Z",
      "createdAt": "2018-01-30T23:28:25.158Z",
      "data": "Lorem Ipsum has been the industry's standard dummy text ever",
      "createdBy": "5a709f7555f1043f58ad0316",
      "_id": "5a70ff9929f7344a02e51d89",
      "issue": "5a70ff9929f7352a92e51a72"
    }
  }

 * @apiError MissingParamsError Error Code <code>2</code> Missing parameters
 * @apiError NotAcceptable Error Code <code>3</code> 'Not acceptable
 */
module.exports.addComment = async (req, res) => {
  const { data } = req.body;
  const { id: _id } = req.params;
  const { _id: createdBy } = req.user;

  if (!data) {
    throw new Error('MissingParamsError');
  }
  const issue = await Issue.findOne({ _id, status: 'Pending' }).lean();
  if (!issue) {
    throw new Error('NotAcceptable');
  }
  const savedComment = await new Comment({
    data,
    createdBy,
    issue: _id,
  }).save();

  res.status(200).send({
    message: 'Successfully added new comment to issue',
    results: savedComment,
  });
};
