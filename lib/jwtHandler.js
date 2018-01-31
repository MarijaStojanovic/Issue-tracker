const jwt = require('jsonwebtoken');

module.exports.getTokenSecret = () => process.env.JWT_SECRET;
module.exports.issueNewToken = user => jwt.sign(user, this.getTokenSecret(), { expiresIn: '12h' });
