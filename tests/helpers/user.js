const { User } = require('../../models');
const { issueNewToken } = require('../../lib/jwtHandler');
const faker = require('faker');

async function createRandomUser(email = faker.internet.email().toLowerCase(), password = faker.name.findName(), isActive = true) {
  const data = {
    firstName: faker.name.findName(),
    lastName: faker.name.lastName(),
    password,
    email,
    isActive,
  };
  const user = await new User(data).save();
  const token = issueNewToken({ _id: user._id });
  delete user.password;
  return {
    token,
    user,
  };
}

module.exports = {
  createRandomUser,
};
