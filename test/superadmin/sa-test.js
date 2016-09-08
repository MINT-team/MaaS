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

//TU - 12 & Controllo della possibilità di effettuare il login da parte del Super Amministratore. & Non eseguito.
describe('TU12 (139) - check SuperAdmin login', function() {
    it('SuperAdmin login', function(done){
      request(server)
        .post('/SuperAdmins/login')
        .send({'email' : 'SA@maas.com',
             'password' : 'password'})
        .expect(200, done);
    });
});

//TU - 13 & Controllo che il Super Amministratore riesca a disconnettersi dal sistema, senza che avvengano errori. & Non eseguito.Accounts
describe('TU13 (141) - check SuperAdmin logout', function() {
    it('SuperAdmin logout', function(done){
      request(server)
        .get('/SuperAdmins/logout')
        .expect(200, done);
    });
});

describe('TU14 (136) - impersonate user', function() {
    it('SuperAdmin user impersonification', function(done){
      request(server)
        .post('/SuperAdmins/impersonate')
        .send(testUser)
        .expect(200, done);
    });
});

describe('TU15 (130) - check registered companies', function() {
    it('Get registered Companies', function(done){
      request(server)
        .get('/companies')
        .expect(200, done);
    });
});

describe('TU16 (131) - create company', function() {
    it('Create a company', function(done){
      request(server)
        .post('/companies/createCompany')
        .send({'company' : 'testCompany2', 'email' : testUser.email})
        .expect(200, done);
    });
});

describe('TU17 (132) - get company', function(){
  it('get company data', function(done){
    request(server)
      .get('/companies' + testCompany)
      .expect(200, done);
  });
});

describe('TU18 (133) - edit company', function() {
    it('Edit the data of a company', function(done){
      request(server)
        .post('/companies/editCompany')
        .send({'company' : 'testCompany2', 'email' : testUser.email})
        .expect(200, done);
    });
});

describe('TU19 (134) - delete company', function(){
  it('delete company', function(done){
    request(server)
      .get('/companies/deleteCompany') 
      .expect(200, done);
  });
});

describe('TU20 (135) - get company', function(){
  it('get company data', function(done){
    request(server)
      .get('/companies' + testCompany)
      .expect(200, done);
  });
});