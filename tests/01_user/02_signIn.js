const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const faker = require('faker');
const { findAdmin } = require('../helpers/admin');
const { createRandomUser } = require('../helpers/user');

describe('Signin', () => {
  it('POST /signin Should return missing parameters', (done) => {
    const body = {
      email: faker.internet.email(),
    };
    request(app)
      .post('/api/v1/signin')
      .set('Accept', 'application/json')
      .send(body)
      .expect(400)
      .then(({ body: { message } }) => {
        message.should.equal('Missing parameters');
        done();
      })
      .catch(done);
  });
  it('POST /signin Should log in admin user', (done) => {
    findAdmin()
      .then(({ user }) => {
        const body = {
          email: user.email,
          password: 'pass',
        };
        return request(app)
          .post('/api/v1/signin')
          .set('Accept', 'application/json')
          .send(body)
          .expect(200)
          .then(({ body: { message } }) => {
            message.should.equal('Successfully signed in');
            done();
          });
      })
      .catch(done);
  });
  it('POST /signin Should log in user', (done) => {
    createRandomUser(faker.internet.email().toLowerCase(), 'pass')
      .then(({ user }) => {
        const body = {
          email: user.email,
          password: 'pass',
        };
        request(app)
          .post('/api/v1/signin')
          .set('Accept', 'application/json')
          .send(body)
          .expect(200)
          .then(({ body: { message } }) => {
            message.should.equal('Successfully signed in');
            done();
          });
      })
      .catch(done);
  });
});
