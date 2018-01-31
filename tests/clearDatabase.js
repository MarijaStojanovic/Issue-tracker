const mongoose = require('mongoose');
const faker = require('faker');
const { User } = require('../models');

before((done) => {
  mongoose.connection.on('open', () => {
    mongoose.connection.db.dropDatabase(() => {
      const admin = new User();
      admin.password = 'pass';
      admin.email = 'admin@mailinator.com';
      admin.isAdmin = true;
      admin.isActive = true;
      admin.firstName = faker.name.findName();
      admin.lastName = faker.name.lastName();
      admin.save().then((user) => {
        done();
      });
    });
  });
});

after((done) => {
  mongoose.connection.db.dropDatabase(() => {
    console.log('db collections dropped');
    mongoose.disconnect();
    done();
  });
});
