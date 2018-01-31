const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const { findAdmin } = require('../helpers/admin');
const { createRandomUser } = require('../helpers/user');
const { createRandomIssue } = require('../helpers/issue');
const objectId = require('mongoose').Types.ObjectId();

describe('Get an issue', () => {
  it('GET /issue/:id Should return NotFound', (done) => {
    findAdmin()
      .then(() => {
        return request(app)
          .get(`/api/v1/issue/${objectId}`)
          .set('Accept', 'application/json')
          .expect(404)
          .then(({ body: { message } }) => {
            message.should.equal('Not Found');
            done();
          });
      })
      .catch(done);
  });

  it('GET /issue/:id Should return an issue', (done) => {
    createRandomUser()
      .then(({ user }) => {
        return createRandomIssue(user._id)
          .then((issue) => {
            return request(app)
              .get(`/api/v1/issue/${issue._id}`)
              .set('Accept', 'application/json')
              .expect(200)
              .then(({ body: { message, results } }) => {
                message.should.equal('Successfully issue return');
                results.createdBy.should.equal(user._id.toString());
                should.exist(results.comments);
                done();
              });
          });
      })
      .catch(done);
  });
});
