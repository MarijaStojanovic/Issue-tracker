const { User } = require('../../models');
const { issueNewToken } = require('../../lib/jwtHandler');
const bcrypt = require('bcrypt');

/**
 * @api {post} /user-add Add new  User
 * @apiVersion 1.0.0
 * @apiName addUser
 * @apiDescription Add new user
 * @apiGroup User
 *
 * @apiParam (body) {String} email Email
 * @apiParam (body) {String} password Password
 * @apiParam (body) {String} firstName First name
 * @apiParam (body) {String} lastName Last name
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
  {
    "message": "Successfully added new user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTcwZjk5MWVhOWFlMTQ5MDk5YjVlYjMiLCJpYXQiOjE1MTczNTMzNjEsImV4cCI6MTUxNzM5NjU2MX0.2agH90zTjzD70i4WA-SXIgiJcfh9pQh6Vy_dgXXU6ic",
    "results": {
      "__v": 0,
      "updatedAt": "2018-01-30T23:02:41.446Z",
      "createdAt": "2018-01-30T23:02:41.446Z",
      "email": "test@mailinator.com",
      "lastName": "Test",
      "firstName": "Test",
      "_id": "5a70f991ea9ae149099b5eb3",
      "isAdmin": false,
      "isActive": true
    }
  }
 * @apiError MissingParamsError Error Code <code>2</code> Missing parameters
 * @apiError Forbidden Error Code <code>5</code> Insufficient privileges
 */
module.exports.addUser = async (req, res) => {
  const { email, password, lastName, firstName } = req.body;
  const { isAdmin } = req.user;

  if (!email || !password || !firstName || !lastName) {
    throw new Error('MissingParamsError');
  }
  if (!isAdmin) {
    throw new Error('Forbidden');
  }

  const results = await new User({ email, password, lastName, firstName }).save();

  results.password = undefined;
  res.status(200).send({
    message: 'Successfully added new user',
    token: issueNewToken({
      _id: results._id,
    }),
    results,
  });
};

/**
 * @api {post} /signin Sign in User
 * @apiVersion 1.0.0
 * @apiName Sign in
 * @apiDescription Sign in User
 * @apiGroup User
 *
 * @apiParam (body) {String} email Email
 * @apiParam (body) {String} password Password
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
  {
    "message": "Successfully signed in",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTcwOWY3NTU1ZjEwNDNmNThhZDAzMTYiLCJpYXQiOjE1MTczNTI1NTQsImV4cCI6MTUxNzM5NTc1NH0.WHOCB0N5WJQOAN0gbgEuGWslogDQm4wChMX-sXAIYLo",
    "results": {
      "_id": "5a709f7555f1043f58ad0316",
      "updatedAt": "2018-01-30T16:38:13.681Z",
      "createdAt": "2018-01-30T16:38:13.681Z",
      "email": "admin@mailinator.com",
      "firstName": "admin",
      "lastName": "admin",
      "isAdmin": true,
      "isActive": true,
      "__v": 0
    }
  }
 * @apiError MissingParamsError Error Code <code>2</code> Missing parameters
 * @apiError NotFound Error Code <code>4</code> Not Found
 * @apiError CredentialsError Error Code <code>7</code> Wrong credentials
 */
module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error('MissingParamsError');
  }
  const user = await User.findOne({ email: email.toLowerCase() }, '+password').lean();
  if (!user) {
    throw new Error('NotFound');
  }

  if (!bcrypt.compareSync(password, user.password)) {
    throw new Error('CredentialsError');
  }
  delete user.password;
  res.status(200).send({
    message: 'Successfully signed in',
    token: issueNewToken({
      _id: user._id,
    }),
    results: user,
  });
};

/**
 * @api {post} /change-password Change password
 * @apiVersion 1.0.0
 * @apiName changePassword
 * @apiDescription Change password for users
 * @apiGroup User
 *
 * @apiParam (body) {String} oldPassword User's old password
 * @apiParam (body) {String} newPassword User's new password
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
  {
    "message": "Password successfully updated",
  }
 * @apiError MissingParamsError Error Code <code>2</code> Missing parameters
 * @apiError CredentialsError Error Code <code>7</code> Wrong credentials
 */
module.exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { _id } = req.user;

  if (!oldPassword || !newPassword) {
    throw new Error('MissingParamsError');
  }
  const user = await User.findOne({ _id }, { password: 1 }).lean();
  if (!bcrypt.compareSync(oldPassword, user.password)) {
    throw new Error('CredentialsError');
  }
  const password = bcrypt.hashSync(newPassword, 10);
  await User.update({ _id }, { $set: { password } });

  res.status(200).send({
    message: 'Password successfully updated',
  });
};

/**
 * @api {get} /me Get user profile
 * @apiVersion 1.0.0
 * @apiName getUser
 * @apiDescription Get user
 * @apiGroup User
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
  {
    "results": {
      "_id": "5a6f73a66c82c71f5bef83b1",
      "updatedAt": "2018-01-29T19:19:02.405Z",
      "createdAt": "2018-01-29T19:19:02.405Z",
      "email": "test@mailinator.com",
      "lastName": "Last name",
      "firstName": "First name",
      "isAdmin": false,
      "isActive": true,
      "__v": 0
    }
  }
 * @apiError NotFound Error Code <code>4</code> Not Found
 */
module.exports.getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user._id }).lean();
  if (!user) {
    throw new Error('NotFound');
  }
  res.status(200).send({
    results: user,
  });
};
