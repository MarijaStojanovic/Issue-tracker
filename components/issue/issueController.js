const { Issue, statuses, Comment } = require('../../models');

/**
 * @api {post} /add-issue Create new issue
 * @apiVersion 1.0.0
 * @apiName addIssue
 * @apiDescription Create new issue
 * @apiGroup Issue
 *
 * @apiParam (body) {String} name Issue name
 * @apiParam (body) {String} [description] Issue description
 * @apiParam (body) {Array} [files] Issue files
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
  {
    "message": "Successfully added new issue",
    "results": {
      "__v": 0,
      "updatedAt": "2018-01-30T23:16:23.814Z",
      "createdAt": "2018-01-30T23:16:23.814Z",
      "description": "Lorem Ipsum is simply dummy text of the printing and make a type specimen book.",
      "name": "Issue #1",
      "createdBy": "5a709f7555f1043f58ad0316",
      "_id": "5a70fcc748075749a6882501",
      "files": [
        "http://localhost:8010/slika1_1517354093226.jpg"
      ],
      "status": "Pending"
    }
  }

 * @apiError MissingParamsError Error Code <code>2</code> Missing parameters
 */
module.exports.addIssue = async (req, res) => {
  const { name, description, files } = req.body;
  const { _id } = req.user;

  if (!name) {
    throw new Error('MissingParamsError');
  }
  const issue = new Issue({ name, createdBy: _id });
  if (description) {
    issue.description = description;
  }
  if (files) {
    issue.files = files;
  }
  const savedIssue = await issue.save();

  res.status(200).send({
    message: 'Successfully added new issue',
    results: savedIssue,
  });
};

/**
 * @api {patch} /issue/:id Edit issue
 * @apiVersion 1.0.0
 * @apiName changeIssue
 * @apiDescription Edit issue
 * @apiGroup Issue
 *
 * @apiParam (body) {String} [name] Issue name
 * @apiParam (body) {String} [description] Issue description
 * @apiParam (body) {String} [status=Pending,Completed] Issue status
 * @apiParam (body) {Array} [files] Issue files
 * @apiParam (params) {String} :id Issue Mongo _id
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
  {
    "message": "Issue successfully updated",
    "results": {
      "_id": "5a70fcc748075749a6882501",
      "updatedAt": "2018-01-30T23:22:56.445Z",
      "createdAt": "2018-01-30T23:16:23.814Z",
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      "name": "New issue name",
      "createdBy": "5a709f7555f1043f58ad0316",
      "__v": 0,
      "files": [
        "http://localhost:8010/slika1_1517354093226.jpg"
      ],
      "status": "Completed"
    }
  }

 * @apiError MissingParamsError Error Code <code>2</code> Missing parameters
 * @apiError NotAcceptable Error Code <code>3</code> Not acceptable
 * @apiError Forbidden Error Code <code>5</code> Insufficient privileges
 */
module.exports.editIssue = async (req, res) => {
  const { name, description, status, files } = req.body;
  const { id: _id } = req.params;
  const { _id: userId, isAdmin } = req.user;

  if (!name && !description && !Array.isArray(files) && !status) {
    throw new Error('MissingParamsError');
  }

  const query = {
    _id,
    status: 'Pending',
  };
  if (!isAdmin) {
    query.createdBy = userId;
  }

  const data = {};
  if (name) {
    data.name = name;
  }
  if (description) {
    data.description = description;
  }
  if (files) {
    data.files = files;
  }
  if (status) {
    if (!statuses.includes(status)) {
      throw new Error('NotAcceptable');
    }
    data.status = status;
  }
  const issue = await Issue.findOneAndUpdate(
    query,
    { $set: data },
    { new: true });
  if (!issue) {
    throw new Error('Forbidden');
  }

  res.status(200).send({
    message: 'Issue successfully updated',
    results: issue,
  });
};

/**
 * @api {get} /issues Get all issues
 * @apiVersion 1.0.0
 * @apiName getAllIssues
 * @apiDescription Get all issues
 * @apiGroup Issue
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
  {
    "message": "All issues",
    "results": [
      {
        "_id": "5a719c2b7a1d41cb25340d0d",
        "updatedAt": "2018-01-31T10:19:41.018Z",
        "createdAt": "2018-01-31T10:19:41.018Z",
        "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        "name": "Issue #1",
        "createdBy": "5a709f7555f1043f58ad0316",
        "files": [
          "http://localhost:8010/slika1_1517354093226.jpg"
        ],
        "status": "Pending",
        "__v": 0,
        "comments": [
          {
            "_id": "5a7198aba99f8252f4b40587",
            "updatedAt": "2018-01-31T10:21:31.546Z",
            "createdAt": "2018-01-31T10:21:31.546Z",
            "data": "This is a comment #1",
            "createdBy": "5a70f79d6c82d747d0c4571c",
            "issue": "5a719c2b7a1d41cb25340d0d",
            "__v": 0
          },
          {
            "_id": "5a7198aea99f8252f4b40588",
            "updatedAt": "2018-01-31T10:21:34.747Z",
            "createdAt": "2018-01-31T10:21:34.747Z",
            "data": "This is a comment #2",
            "createdBy": "5a70f79d6c82d747d0c4571c",
            "issue": "5a719c2b7a1d41cb25340d0d",
            "__v": 0
          }
        ]
      }
    ]
  }
 */
module.exports.getAllIssues = async (req, res) => {
  let { skip = 0, limit = 20 } = req.query;

  if (Number(limit) > 50) {
    limit = 50;
  }

  const issues = await Issue.aggregate([
    {
      $sort: {
        'createdAt': -1,
      }
    },
    {
      $skip: Number(skip),
    },
    {
      $limit: Number(limit),
    },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'issue',
        as: 'comments',
      },
    },
  ]);
  res.status(200).send({
    message: 'All issues',
    results: issues,
  });
};

/**
 * @api {delete} /issue/:id Destroy issue
 * @apiVersion 1.0.0
 * @apiName destroyIssue
 * @apiDescription Remove issue
 * @apiGroup Issue
 *
 * @apiParam (params) {String} :id Issue Mongo _id
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
  {
    "message": "Issue removed"
  }

  * @apiError NotAcceptable Error Code <code>3</code> Not acceptable
 */
module.exports.destroyIssue = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: userId, isAdmin } = req.user;

  const query = {
    _id,
    status: 'Pending',
  };
  if (!isAdmin) {
    query.createdBy = userId;
  }
  const issue = await Issue.findOne(query).lean();
  if (!issue) {
    throw new Error('NotAcceptable');
  }

  await Promise.all([
    Comment.remove({ issue: _id }),
    Issue.remove(query),
  ]);

  res.status(200).send({
    message: 'Issue removed',
  });
};

/**
 * @api {get} /issue/:id Get issue
 * @apiVersion 1.0.0
 * @apiName getIssue
 * @apiDescription Get issue
 * @apiGroup Issue
 *
 * @apiParam (params) {String} :id Issue Mongo _id
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
  {
    "message": "Successfully issue return",
    "results": {
      "_id": "5a7198282573c752e9a8ddf7",
      "updatedAt": "2018-01-30T23:35:29.727Z",
      "createdAt": "2018-01-30T16:52:55.053Z",
      "description": "Lorem ipsum ...",
      "name": "Issue name",
      "createdBy": "5a709f7555f1043f58ad0316",
      "comments": [
        {
          "_id": "5a7198caa99f8252f4b40589",
          "updatedAt": "2018-01-31T10:22:02.845Z",
          "createdAt": "2018-01-31T10:22:02.845Z",
          "data": "This is a comment #1",
          "createdBy": "5a70f79d6c82d747d0c4571c",
          "issue": "5a7198282573c752e9a8ddf7",
          "__v": 0
        },
        {
          "_id": "5a7198cea99f8252f4b4058a",
          "updatedAt": "2018-01-31T10:22:06.352Z",
          "createdAt": "2018-01-31T10:22:06.352Z",
          "data": "This is a comment #2",
          "createdBy": "5a709f7555f1043f58ad0316",
          "issue": "5a7198282573c752e9a8ddf7",
          "__v": 0
        }
      ]
      "files": [
        "http://localhost:8010/slika1_1517354093226.jpg"
      ],
      "status": "Pending",
      "__v": 0
    }
  }
 * @apiError NotFound Error Code <code>4</code> Not Found
 */
module.exports.getIssue = async (req, res) => {
  const { id: _id } = req.params;

  const [issue, comments] = await Promise.all([
    Issue.findOne({ _id }).lean(),
    Comment.find({ issue: _id }).lean()
  ]);
  if (!issue) {
    throw new Error('NotFound');
  }
  issue.comments = comments;
  res.status(200).send({
    message: 'Successfully issue return',
    results: issue,
  });
};

/**
 * @api {post} /file Save file (upload)
 * @apiVersion 1.0.0
 * @apiName uploadFile
 * @apiDescription Save file
 * @apiGroup Issue
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
  {
    "message": "Successfully uploaded a file",
    "results": "http://localhost:8010/download_1517346750910.pdf"
  }
 * @apiError NotFound Error Code <code>4</code> Not Found
 * @apiError FileUploadError Error Code <code>10</code> Something went wrong during file upload.
 *
 */
module.exports.uploadFile = async (req, res) => {
  const fileLocation = req.file.path.split('/');
  const [fileName] = fileLocation.slice(-1);

  const fileUrl = `${process.env.SERVER_ADDRESS}/uploads/${fileName}`;
  res.status(200).send({
    message: 'Successfully uploaded a file',
    results: fileUrl,
  });
};

