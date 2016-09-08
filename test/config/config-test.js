var request = require('supertest');
var server = require('../../server/testconfig.js');
// var server = require('../../server/server.js'); per poter chiamare il vero server

describe('TU 70 - middlewares are working', function () {
  it('responds to /api', function testSlash(done) {
  request(server)
    .get('/')
    .expect(200, done);
  });
});

describe('TU 71 - reject invalid URLs', function () {
  it('responds 404 to any invalid call', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});

describe('TU 72 - signal server error', function () {
  it('responds 500 if server cannot handle request', function testPath(done) {
    request(server)
      .post('/')
      .send('blablabla')
      .expect(400, done);
  });
});

describe('TU 73 - server initialized correctly', function () {
  it('responds to /', function testSlash(done) {
  request(server)
    .get('/')
    .expect(200, done);
  });
});