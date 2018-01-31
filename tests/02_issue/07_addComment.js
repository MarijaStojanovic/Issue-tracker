const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const faker = require('faker');
const { createRandomUser } = require('../helpers/user');
const { createRandomIssue } = require('../helpers/issue');
const objectId = require('mongoose').Types.ObjectId();

describe('Add comment to issue', () => {
  it('POST /issue/:id/comment Should return MissingParamsError', (done) => {
    createRandomUser()
      .then(({ token }) => {
        const body = {};
        return request(app)
          .post(`/api/v1/issue/${objectId}/comment`)
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
  it('POST /issue/:id/comment Should return NotAcceptable', (done) => {
    createRandomUser()
      .then(({ token }) => {
        const body = {
          data: faker.lorem.words(),
        };
        return request(app)
          .post(`/api/v1/issue/${objectId}/comment`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(body)
          .expect(406)
          .then(({ body: { message } }) => {
            message.should.equal('Not acceptable');
            done();
          });
      })
      .catch(done);
  });
  it('POST /issue/:id/comment User should successfully add new comment on issue', (done) => {
    createRandomUser()
      .then(({ token, user }) => {
        return createRandomIssue(user._id)
          .then((issue) => {
            const body = {
              data: faker.lorem.words(),
            };
            return request(app)
              .post(`/api/v1/issue/${issue._id}/comment`)
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${token}`)
              .send(body)
              .expect(200)
              .then(({ body: { message, results } }) => {
                message.should.equal('Successfully added new comment to issue');
                results.data.should.equal(body.data);
                results.issue.should.equal(issue._id.toString());
                done();
              });
          });
      })
      .catch(done);
  });
});
