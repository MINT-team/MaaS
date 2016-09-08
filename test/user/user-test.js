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

describe('loading loopback', function () {
  it('responds to /', function testSlash(done) {
  request(server)
    .get('/')
    .expect(200, done);
  });
  it('404 everything else', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});

describe('TU 1 (137) - signing up user', function(){//prova enrico
  it('receives new user', function(done){
    request(server)
      .post('/users/signUp')
      // .post('/api/users/signUp') per chiamare la signUp del vero server
      .send(testUser)
      .expect(200, {'error':'null', 'email':testUser.email, 'company':testUser.company}, done);
  });
  it('has registered the company', function(done){
    request(server)
    .get('/companies')
    .expect(200, '1', done);
  });
});

describe('TU 2 (138) - login user', function(){
  it('test user login', function(done){
    request(server)
      .post('/users/login')
      .send({'email' : 'test@test.com',
             'password' : 'testPassword'})
      .expect(200,"user login correct", done);
  });
});

describe('TU 3 (74, 75) - edit user', function(){
  it('send new data', function(done){
    request(server)
      .post('/users/editUser')
      .send({'name' : 'testName',
             'gender' : 'male'})
      .expect(200,{
  'company' : 'testCompany',
  'email' : 'test@test.com',
  'password' : 'testPassword',
  'confirmation' : 'testPassword',
  'name' : 'testName',
  'gender' : 'male'}, done);
  });
});

//Verifica che un utente riesca a disconnettersi senza che avvengano errori.
describe('TU 4 (140) - logout user', function(){
  it('test user logout', function(done){
    request(server)
      .get('/users/logout')
      .expect(200, done);
  });
});

//Verifica che si riescano ad ottenere i dati degli utenti di un’azienda.
describe('TU 5 (77) - get users', function(){
  it('get users data', function(done){
    request(server)
      .get('/companies' + testCompany + '/getUsers')
      .expect(200, done);
  });
});

//Verifica che si riescano ad ottenere i dati di un utente dell'azienda.
describe('TU 6 (78) - get user', function(){
  it('get user data', function(done){
    //this.timeout(5000);
    request(server)
      .get('/companies' + testCompany + '/getUser') 
      .expect(200, done);
  });
});

describe('TU 7 (79) - delete user', function(){
  it('delete user', function(done){
    request(server)
      .get('/users/deleteUser') 
      .expect(200, done);
  });
});

describe('TU 8 (80) - get a user having specific data', function(){
  it('send new data', function(done){
    request(server)
      .post('/users/getUser')
      .send({'email' : 'test@test.com'})
      .expect(200, done);
  });
});

describe('TU 9 (76, 81) - change a the password of a user', function(){
  it('send new password', function(done){
    request(server)
      .post('/users' + testUserId + '/changePassword')
      .send({'password' : 'testPassword2'})
      .expect(200, done);
  });
});

//Verifica che si riesca a cambiare il ruolo di un utente.
describe('TU 10 (82) - charge user role', function(){
  it('change user role', function(done){
    request(server)
      .post('/users' + testUserId + '/changeRole')
      .send({'email' : 'test@test.com',
             'role' : 'Member'})
      .expect(200, done);
  });
});

//Verifica che si riesca a generare (tramite l’Action sendEmail) una mail di invito per un nuovo utente e ad inviarla.
describe('TU 11 (83) - send invitation email', function(){
  it('send email', function(done){
    request(server)
      .get('/users/sendInvite') 
      .expect(200, done);
  });
});
