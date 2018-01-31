const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const { createRandomUser } = require('../helpers/user');

describe('Get user', () => {
  it('GET /me Should return user', (done) => {
    createRandomUser()
      .then(({ token, user }) => {
        return request(app)
          .get('/api/v1/me')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .then(({ body: { results } }) => {
            results.firstName.should.equal(user.firstName);
            results.lastName.should.equal(user.lastName);
            results.email.should.equal(user.email);
            done();
          })
          .catch(done);
      });
  });
});
