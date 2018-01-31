const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const faker = require('faker');
const { findAdmin } = require('../helpers/admin');

describe('Add new user (POST /user-add)', () => {
  it('POST /user-add Should return missing parameters', (done) => {
    findAdmin()
      .then(({ token }) => {
        const body = {
          firstName: faker.name.findName(),
          email: faker.internet.email(),
        };
        return request(app)
          .post('/api/v1/user-add')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(body)
          .expect(400)
          .then(({ body: { message } }) => {
            message.should.equal('Missing parameters');
            done();
          });
      })
      .catch(done);
  });
  it('POST /user-add Should successfully add new user', (done) => {
    findAdmin()
      .then(({ token }) => {
        const body = {
          firstName: faker.name.findName(),
          lastName: faker.name.lastName(),
          email: 'maja@mailinator.com', // faker.internet.email().toLowerCase()
          password: 'pass',
        };
        return request(app)
          .post('/api/v1/user-add')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(body)
          .expect(200)
          .then(({ body: { message, results } }) => {
            message.should.equal('Successfully added new user');
            results.firstName.should.equal(body.firstName);
            results.lastName.should.equal(body.lastName);
            results.email.should.equal(body.email);
            should.not.exist(results.password);
            done();
          });
      })
      .catch(done);
  });
});
