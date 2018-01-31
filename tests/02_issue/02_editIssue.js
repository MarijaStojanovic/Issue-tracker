const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const faker = require('faker');
const { findAdmin } = require('../helpers/admin');
const { createRandomUser } = require('../helpers/user');
const { createRandomIssue } = require('../helpers/issue');
const objectId = require('mongoose').Types.ObjectId();

describe('Edit issue', () => {
  it('PATCH /issue/:id Should return missing params', (done) => {
    findAdmin()
      .then(({ token }) => {
        const body = {};
        return request(app)
          .patch(`/api/v1/issue/${objectId}`)
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
  it('PATCH /issue/:id Should return not acceptable', (done) => {
    findAdmin()
      .then(({ token, user }) => {
        return createRandomIssue(user._id)
          .then((issue) => {
            const body = {
              status: 'Decline',
            };
            return request(app)
              .patch(`/api/v1/issue/${issue._id}`)
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${token}`)
              .send(body)
              .expect(406)
              .then(({ body: { message } }) => {
                message.should.equal('Not acceptable');
                done();
              });
          });
      })
      .catch(done);
  });
  it('PATCH /issue/:id Should return forbidden if issue completed', (done) => {
    findAdmin()
      .then(({ token, user }) => {
        return createRandomIssue(user._id, 'Completed')
          .then((issue) => {
            const body = {
              name: faker.name.findName(),
            };
            return request(app)
              .patch(`/api/v1/issue/${issue._id}`)
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${token}`)
              .send(body)
              .expect(403)
              .then(({ body: { message } }) => {
                message.should.equal('Insufficient privileges');
                done();
              });
          });
      })
      .catch(done);
  });
  it('PATCH /issue/:id Admin should successfully edit issue', (done) => {
    findAdmin()
      .then(({ token, user }) => {
        return createRandomIssue(user._id)
          .then((issue) => {
            const body = {
              name: faker.name.findName(),
              description: faker.lorem.words(),
            };
            return request(app)
              .patch(`/api/v1/issue/${issue._id}`)
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${token}`)
              .send(body)
              .expect(200)
              .then(({ body: { message, results } }) => {
                message.should.equal('Issue successfully updated');
                results.name.should.equal(body.name);
                results.description.should.equal(body.description);
                results.createdBy.should.equal(user._id.toString());
                done();
              });
          });
      })
      .catch(done);
  });
  it('PATCH /issue/:id User should successfully edit issue', (done) => {
    createRandomUser()
      .then(({ token, user }) => {
        return createRandomIssue(user._id)
          .then((issue) => {
            const body = {
              name: faker.name.findName(),
              description: faker.lorem.words(),
            };
            return request(app)
              .patch(`/api/v1/issue/${issue._id}`)
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${token}`)
              .send(body)
              .expect(200)
              .then(({ body: { message, results } }) => {
                message.should.equal('Issue successfully updated');
                results.name.should.equal(body.name);
                results.description.should.equal(body.description);
                results.createdBy.should.equal(user._id.toString());
                done();
              });
          });
      })
      .catch(done);
  });
});
