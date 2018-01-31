/**
 * Return mongodb connection
 * @returns {*}
 */
module.exports.db = () => {
  if (process.env.NODE_ENV === 'test') {
    return 'mongodb://localhost:27017/issue_tracker_test';
  }
  return 'mongodb://localhost:27017/issue_tracker_dev';
};
