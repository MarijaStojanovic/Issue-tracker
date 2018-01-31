const { Issue } = require('../../models');
const faker = require('faker');
const objectId = require('mongoose').Types.ObjectId();

async function createRandomIssue(createdBy = objectId, status = 'Pending', name = faker.name.findName(), description = faker.lorem.words()) {
  const data = {
    name,
    status,
    description,
    createdBy,
  };
  return new Issue(data).save();
}

const addRandomIssues = ((numberOfIssues = faker.random.number({ min: 3, max: 15 }), createdBy = objectId, name = faker.name.findName(), description = faker.lorem.words()) => {
  const query = [];
  for (let i = 0; i < numberOfIssues; i += 1) {
    query.push({
      name,
      description,
      createdBy,
    });
  }
  return Issue.insertMany(query);
});

module.exports = {
  createRandomIssue,
  addRandomIssues,
};
