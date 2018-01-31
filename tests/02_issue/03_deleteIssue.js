const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const { Issue } = require('../../models');
const { findAdmin } = require('../helpers/admin');
const { createRandomUser } = require('../helpers/user');
const { createRandomIssue } = require('../helpers/issue');

describe('Remove issue', () => {
  it('DELETE /issue/:id Should return not acceptable if issue completed', (done) => {
    findAdmin()
      .then(({ token, user }) => {
        return createRandomIssue(user._id, 'Completed')
          .then((issue) => {
            return request(app)
              .delete(`/api/v1/issue/${issue._id}`)
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${token}`)
              .expect(406)
              .then(({ body: { message } }) => {
                message.should.equal('Not acceptable');
                done();
              });
          });
      })
      .catch(done);
  });
  it('DELETE /issue/:id Admin should successfully remove issue', (done) => {
    findAdmin()
      .then(({ token, user }) => {
        return createRandomIssue(user._id)
          .then((issue) => {
            return request(app)
              .delete(`/api/v1/issue/${issue._id}`)
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${token}`)
              .expect(200)
              .then(({ body: { message } }) => {
                message.should.equal('Issue removed');
                return Issue.findOne({ _id: issue._id })
                  .then((results) => {
                    should.not.exist(results);
                    done();
                  });
              });
          });
      })
      .catch(done);
  });
  it('DELETE /issue/:id User should successfully remove issue', (done) => {
    createRandomUser()
      .then(({ token, user }) => {
        return createRandomIssue(user._id)
          .then((issue) => {
            return request(app)
              .delete(`/api/v1/issue/${issue._id}`)
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${token}`)
              .expect(200)
              .then(({ body: { message } }) => {
                message.should.equal('Issue removed');
                return Issue.findOne({ _id: issue._id })
                  .then((results) => {
                    should.not.exist(results);
                    done();
                  });
              });
          });
      })
      .catch(done);
  });
});
