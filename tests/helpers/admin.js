const { User } = require('../../models');
const { issueNewToken } = require('../../lib/jwtHandler');

async function findAdmin() {
  const user = await User.findOne({ email: 'admin@mailinator.com', isAdmin: true });
  const token = issueNewToken({ _id: user._id });

  return {
    token,
    user,
  };
}

module.exports = {
  findAdmin,
};
