const app = require('../../app');
const request = require('supertest');
const { createRandomUser } = require('../helpers/user');

const addFile = () => new Promise((resolve, reject) => {
  createRandomUser()
    .then(({ token }) => {
      return request(app)
        .post('/api/v1/file')
        .field('Content-Type', 'multipart/form-data')
        .attach('file', 'tests/picture.jpg')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          return resolve(res.body.results);
        });
    })
    .catch(reject);
});

module.exports = {
  addFile,
};
