const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const faker = require('faker');
const { findAdmin } = require('../helpers/admin');
const { createRandomUser } = require('../helpers/user');
const { addFile } = require('../helpers/file');

describe('Add new issue', () => {
  it('POST /add-issue Should return missing parameters', (done) => {
    findAdmin()
      .then(({ token }) => {
        const body = {};
        return request(app)
          .post('/api/v1/add-issue')
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
  it('POST /add-issue Admin should successfully add new issue', (done) => {
    findAdmin()
      .then(({ token, user }) => {
        const body = {
          name: faker.name.findName(),
          description: faker.lorem.words(),
        };
        return request(app)
          .post('/api/v1/add-issue')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(body)
          .expect(200)
          .then(({ body: { message, results } }) => {
            message.should.equal('Successfully added new issue');
            results.name.should.equal(body.name);
            results.description.should.equal(body.description);
            results.createdBy.should.equal(user._id.toString());
            done();
          });
      })
      .catch(done);
  });
  it('POST /add-issue User should successfully add new issue', (done) => {
    createRandomUser()
      .then(({ token, user }) => {
        const body = {
          name: faker.name.findName(),
          description: faker.lorem.words(),
        };
        return request(app)
          .post('/api/v1/add-issue')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(body)
          .expect(200)
          .then(({ body: { message, results } }) => {
            message.should.equal('Successfully added new issue');
            results.name.should.equal(body.name);
            results.description.should.equal(body.description);
            results.createdBy.should.equal(user._id.toString());
            done();
          });
      })
      .catch(done);
  });
  it('POST /add-issue User should successfully add new issue with file', (done) => {
    createRandomUser()
      .then(({ token, user }) => {
        return addFile(token)
          .then((file) => {
            const body = {
              name: faker.name.findName(),
              description: faker.lorem.words(),
              files: [file],
            };
            return request(app)
              .post('/api/v1/add-issue')
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${token}`)
              .send(body)
              .expect(200)
              .then(({ body: { message, results } }) => {
                message.should.equal('Successfully added new issue');
                results.name.should.equal(body.name);
                results.description.should.equal(body.description);
                results.createdBy.should.equal(user._id.toString());
                results.files[0].should.equal(file);
                results.files.length.should.equal(1);
                done();
              });
          });
      })
      .catch(done);
  });
});
