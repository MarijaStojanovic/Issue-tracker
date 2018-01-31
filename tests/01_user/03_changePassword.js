const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const faker = require('faker');
const { createRandomUser } = require('../helpers/user');
const { User } = require('../../models');

describe('Change password', () => {
  it('POST /change-password Should return missing parameters', (done) => {
    createRandomUser()
      .then(({ token }) => {
        const body = {
          password: faker.name.findName(),
        };
        return request(app)
          .post('/api/v1/change-password')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(body)
          .expect(400)
          .then(({ body: { message } }) => {
            message.should.equal('Missing parameters');
            done();
          })
          .catch(done);
      });
  });
  it('POST /change-password Should successfully change password', (done) => {
    createRandomUser(faker.internet.email().toLowerCase(), 'pass')
      .then(({ user, token }) => {
        return request(app)
          .post('/api/v1/change-password')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({ oldPassword: 'pass', newPassword: 'new password' })
          .expect(200)
          .then(({ body: { message } }) => {
            return User.findOne({ _id: user._id }, { password: 1 }).then((results) => {
              results.password.should.not.equal(user.password);
              message.should.equal('Password successfully updated');
              done();
            });
          })
          .catch((error) => {
            done(error);
          });
      });
  });
});
