const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const { addRandomIssues } = require('../helpers/issue');
const mongoose = require('mongoose');

describe('Get all issues', () => {
  beforeEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });
  it('GET /issue Should return empty array', (done) => {
    request(app)
      .get('/api/v1/issues')
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body: { message, results } }) => {
        message.should.equal('All issues');
        results.length.should.equal(0);
        done();
      })
      .catch(done);
  });
  it('GET /issue Should successfully return all issues', (done) => {
    addRandomIssues(5)
      .then(() => {
        return request(app)
          .get('/api/v1/issues')
          .set('Accept', 'application/json')
          .expect(200)
          .then(({ body: { message, results } }) => {
            message.should.equal('All issues');
            results.length.should.equal(5);
            done();
          });
      })
      .catch(done);
  });
  it('GET /issue Should successfully return 6 issues', (done) => {
    addRandomIssues(20)
      .then(() => {
        return request(app)
          .get('/api/v1/issues?limit=6')
          .set('Accept', 'application/json')
          .expect(200)
          .then(({ body: { message, results } }) => {
            message.should.equal('All issues');
            results.length.should.equal(6);
            done();
          });
      })
      .catch(done);
  });
});
