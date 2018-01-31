const { User } = require('../models');

/**
 * Authentication check middleware
 * @param req
 * @param res
 * @param next
 */
async function authCheck(req, res, next) {
  try {
    const user = await User.findOne({ _id: req.user._id }).lean();
    if (!user) {
      throw new Error('UnauthorizedError');
    }
    req.user.isAdmin = user.isAdmin;
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  authCheck,
};
