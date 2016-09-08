var testUser= {
  'company' : 'testCompany',
  'email' : 'test@test.com',
  'password' : 'testPassword',
  'confirmation' : 'testPassword'
};

var request = require('supertest');
var server = require('../../server/testconfig.js');
// var server = require('../../server/server.js'); per poter chiamare il vero server
var testCompany = '/testCompany'; 
var testUserId = '/testUserId';
var testExternalDB = '/testExternalDB';
var testDSLid = '/testDSLid';
var value = "/";

//TU - 27 & Si verifica che un utente possa visualizzare una lista contenente tutte le Collection a cui ha accesso.
describe('TU 27 (84) - show list of Collections', function () {
  it('show list of Collections', function(done) {
    request(server)
    .get('/users/dsl/Collections')
    .expect(200, done);
  });
});

//TU - 28 & Si verifica che un utente possa creare una nuova Collection, senza che si presentino errori.
describe('TU 28 (85) - create new Collection', function () {
  it('create new Collection', function(done) {
  request(server)
    .post('/users' + testDSLid + '/dsl')
    .send({'type' : 'Collection', 'email' : 'test@test.com', 'name' : 'testCollection', 'source' : ''})
    .expect(200, done);
  });
});

describe('TU 29 (86) - edit Collection', function () {
  it('edit Collection', function(done) {
  request(server)
    .post('/users' + testDSLid + '/editDsl')
    .send({'type' : 'Collection', 'email' : 'test@test.com', 'name' : 'testCollection', 'source' : 'testSource'})
    .expect(200, done);
  });
});

describe('TU 30 (87) - delete Collection', function () {
  it('delete Collection', function(done) {
  request(server)
    .post('/users' + testDSLid + '/deleteDsl')
    .send({'type' : 'Collection', 'email' : 'test@test.com', 'name' : 'testCollection', 'source' : 'testSource'})
    .expect(200, done);
  });
});

describe('TU 31 (88) - retrieve Collection definition', function () {
  it('get Collection dsl file', function(done) {
  request(server)
    .post('/users' + testDSLid + '/dslDef')
    .send({'type' : 'Collection', 'email' : 'test@test.com', 'name' : 'testCollection', 'source' : 'testSource'})
    .expect(200, done);
  });
});

describe('TU 32 (89) - show filtered list of Collections', function () {
  it('show filtered list of Collections', function(done) {
    request(server)
    .get('/users/dsl/Collections' + value)
    .expect(200, done);
  });
});

describe('TU 33 (90) - execute Collection', function () {
  it('execute a Collection of the user', function(done) {
    request(server)
    .get('/users' + testDSLid + '/execDsl')
    .expect(200, done);
  });
});

describe('TU 34 (91) - send Collection', function () {
  it('send a Collection through email', function(done) {
    request(server)
    .get('/users' + testDSLid + '/sendEmail')
    .expect(200, done);
  });
});

describe('TU 35 (92) - export Collection view', function () {
  it('export the view of a Collection', function(done) {
    request(server)
    .get('/users' + testDSLid + '/exportView')
    .expect(200, done);
  });
});

describe('TU 36 (93) - export Collection definition', function () {
  it('export the definition of a Collection', function(done) {
    request(server)
    .get('/users' + testDSLid + '/exportDef')
    .expect(200, done);
  });
});

describe('TU 37 (94) - import a Collection', function () {
  it('import a Collection dsl file', function(done) {
  request(server)
    .post('/users/dsl/import')
    .send({'type' : 'Collection', 'email' : 'test@test.com', 'name' : 'testCollection2', 'source' : 'testSource'})
    .expect(200, done);
  });
});



describe('TU 38 (95) - show list of Documents', function () {
  it('show list of Documents', function(done) {
    request(server)
    .get('/users/dsl/Documents')
    .expect(200, done);
  });
});

describe('TU 39 (96) - create new Document', function () {
  it('create new Document', function(done) {
  request(server)
    .post('/users' + testDSLid + '/dsl')
    .send({'type' : 'Document', 'email' : 'test@test.com', 'name' : 'testDocument', 'source' : ''})
    .expect(200, done);
  });
});

describe('TU 40 (97) - edit Document', function () {
  it('edit Document', function(done) {
  request(server)
    .post('/users' + testDSLid + '/editDsl')
    .send({'type' : 'Document', 'email' : 'test@test.com', 'name' : 'testDocument', 'source' : 'testSource'})
    .expect(200, done);
  });
});

describe('TU 41 (98) - delete Document', function () {
  it('delete Document', function(done) {
  request(server)
    .post('/users' + testDSLid + '/deleteDsl')
    .send({'type' : 'Document', 'email' : 'test@test.com', 'name' : 'testDocument', 'source' : 'testSource'})
    .expect(200, done);
  });
});

describe('TU 42 (100) - show filtered list of Documents', function () {
  it('show filtered list of Documents', function(done) {
    request(server)
    .get('/users/dsl/Documents' + value)
    .expect(200, done);
  });
});

describe('TU (101) 43 - execute Document', function () {
  it('execute a Document of the user', function(done) {
    request(server)
    .get('/users' + testDSLid + '/execDsl')
    .expect(200, done);
  });
});

describe('TU 44 - execute Document from Collection', function () {
  it('execute a Document from a Collection', function(done) {
    request(server)
    .get('/users' + testDSLid + '/execDsl' + value)
    .expect(200, done);
  });
});

describe('TU 45 (102) - send Document', function () {
  it('send a Document through email', function(done) {
    request(server)
    .get('/users' + testDSLid + '/sendEmail')
    .expect(200, done);
  });
});

describe('TU 46 (103) - export Document view', function () {
  it('export the view of a Document', function(done) {
    request(server)
    .get('/users' + testDSLid + '/exportView')
    .expect(200, done);
  });
});

describe('TU 47 (99) - retrieve Document definition', function () {
  it('get Document dsl file', function(done) {
  request(server)
    .post('/users' + testDSLid + '/dslDef')
    .send({'type' : 'Document', 'email' : 'test@test.com', 'name' : 'testDocument', 'source' : 'testSource'})
    .expect(200, done);
  });
});

describe('TU 48 (104) - export Document definition', function () {
  it('export the definition of a Document', function(done) {
    request(server)
    .get('/users' + testDSLid + '/exportDef')
    .expect(200, done);
  });
});

describe('TU 49 (105) - import a Document', function () {
  it('import a Document dsl file', function(done) {
  request(server)
    .post('/users/dsl/import')
    .send({'type' : 'Document', 'email' : 'test@test.com', 'name' : 'testDocument2', 'source' : 'testSource'})
    .expect(200, done);
  });
});



describe('TU 50 (106) - show list of Dashboards', function () {
  it('show list of Dashboards', function(done) {
    request(server)
    .get('/users/dsl/Dashboards')
    .expect(200, done);
  });
});

describe('TU 51 (107) - create new Dashboard', function () {
  it('create new Dashboard', function(done) {
  request(server)
    .post('/users' + testDSLid + '/dsl')
    .send({'type' : 'Dashboard', 'email' : 'test@test.com', 'name' : 'testDashboard', 'source' : ''})
    .expect(200, done);
  });
});

describe('TU 52 (108) - edit Dashboard', function () {
  it('edit Dashboard', function(done) {
  request(server)
    .post('/users' + testDSLid + '/editDsl')
    .send({'type' : 'Dashboard', 'email' : 'test@test.com', 'name' : 'testDashboard', 'source' : 'testSource'})
    .expect(200, done);
  });
});

describe('TU 53 (109) - delete Dashboard', function () {
  it('delete Dashboard', function(done) {
  request(server)
    .post('/users' + testDSLid + '/deleteDsl')
    .send({'type' : 'Dashboard', 'email' : 'test@test.com', 'name' : 'testDashboard', 'source' : 'testSource'})
    .expect(200, done);
  });
});

describe('TU 54 (113) - retrieve Dashboard definition', function () {
  it('get Dashboard dsl file', function(done) {
  request(server)
    .post('/users' + testDSLid + '/dslDef')
    .send({'type' : 'Dashboard', 'email' : 'test@test.com', 'name' : 'testDashboard', 'source' : 'testSource'})
    .expect(200, done);
  });
});

describe('TU 55 (110) - show filtered list of Dashboards', function () {
  it('show filtered list of Dashboards', function(done) {
    request(server)
    .get('/users/dsl/Dashboards' + value)
    .expect(200, done);
  });
});

describe('TU (111) 56 - execute Dashboard', function () {
  it('execute a Dashboard of the user', function(done) {
    request(server)
    .get('/users' + testDSLid + '/execDsl')
    .expect(200, done);
  });
});

describe('TU 57 (112) - export Dashboard definition', function () {
  it('export the definition of a Dashboard', function(done) {
    request(server)
    .get('/users' + testDSLid + '/exportDef')
    .expect(200, done);
  });
});

describe('TU 58 (114) - import a Dashboard', function () {
  it('import a Dashboard dsl file', function(done) {
  request(server)
    .post('/users/dsl/import')
    .send({'type' : 'Dashboard', 'email' : 'test@test.com', 'name' : 'testDashboard2', 'source' : 'testSource'})
    .expect(200, done);
  });
});



describe('TU 59 (115) - show list of Cells', function () {
  it('show list of Cells', function(done) {
    request(server)
    .get('/users/dsl/Cells')
    .expect(200, done);
  });
});

describe('TU 60 (116) - create new Cell', function () {
  it('create new Cell', function(done) {
  request(server)
    .post('/users' + testDSLid + '/dsl')
    .send({'type' : 'Cell', 'email' : 'test@test.com', 'name' : 'testCell', 'source' : ''})
    .expect(200, done);
  });
});

describe('TU 61 (117) - edit Cell', function () {
  it('edit Cell', function(done) {
  request(server)
    .post('/users' + testDSLid + '/editDsl')
    .send({'type' : 'Cell', 'email' : 'test@test.com', 'name' : 'testCell', 'source' : 'testSource'})
    .expect(200, done);
  });
});

describe('TU 62 (118) - delete Cell', function () {
  it('delete Cell', function(done) {
  request(server)
    .post('/users' + testDSLid + '/deleteDsl')
    .send({'type' : 'Cell', 'email' : 'test@test.com', 'name' : 'testCell', 'source' : 'testSource'})
    .expect(200, done);
  });
});

describe('TU 63 (122) - retrieve Cell definition', function () {
  it('get Cell dsl file', function(done) {
  request(server)
    .post('/users' + testDSLid + '/dslDef')
    .send({'type' : 'Cell', 'email' : 'test@test.com', 'name' : 'testCell', 'source' : 'testSource'})
    .expect(200, done);
  });
});

describe('TU 64 (119) - show filtered list of Cells', function () {
  it('show filtered list of Cells', function(done) {
    request(server)
    .get('/users/dsl/Cells' + value)
    .expect(200, done);
  });
});

describe('TU 65 (120) - execute Cell', function () {
  it('execute a Cell of the user', function(done) {
    request(server)
    .get('/users' + testDSLid + '/execDsl')
    .expect(200, done);
  });
});

describe('TU 66 (121) - export Cell definition', function () {
  it('export the definition of a Cell', function(done) {
    request(server)
    .get('/users' + testDSLid + '/exportDef')
    .expect(200, done);
  });
});

describe('TU 67 (123) - import a Cell', function () {
  it('import a Cell dsl file', function(done) {
  request(server)
    .post('/users/dsl/import')
    .send({'type' : 'Cell', 'email' : 'test@test.com', 'name' : 'testCell2', 'source' : 'testSource'})
    .expect(200, done);
  });
});

describe('TU 68 - export DSL definition', function () {
  it('export a DSL and get JSON result', function(done) {
    request(server)
    .get('/users' + testDSLid + '/exportDef')
    .expect(200, {'type' : 'Collection', 'email' : 'test@test.com', 'name' : 'testCollection', 'source' : 'testSource'}, done);
  });
});

describe('TU 69 - export DSL definition', function () {
  it('export a DSL and get CSV result', function(done) {
    request(server)
    .get('/users' + testDSLid + '/exportDefCsv')
    .expect(200, "{'type', 'Collection', 'email', 'test@test.com', 'name', 'testCollection', 'source', 'testSource'}", done);
  });
});