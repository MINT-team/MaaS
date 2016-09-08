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

//TU - 21 & Si verifica che un Amministratore o Proprietario riesca a collegare un database esterno alla propria azienda, senza che si verifichino errori durante il processo.
describe('TU 21 (124) - connect external database', function() {
   it('connect external db', function(done){
    request(server)
      .post('/Companies/externalDatabases')
      .send({ "name": "testName",
              "connString": "testLink",
              "connected": "true",
              "companyId": "testCompany"})
      .expect(200, done);
   }); 
});

//TU - 22 & Si controlla che un Amministratore o Proprietario possa eliminare l'origine dei dati (database esterno) di un'azienda, senza che si verifichino errori durante il processo.
describe('TU 22 (125) - delete db', function(){
  it('delete external database', function(done){
    request(server)
      .get('/Companies' + testExternalDB + '/deleteExternalDatabase')
      .expect(200, done);
  });
});

//TU - 23 & Verifica che gli Amministratori di un'azienda iscritta al sistema MaaS siano in grado ottenere specifici dati, appartenenti alla propria azienda, conservati in un database esterno collegato.
describe('TU 23 (126) - company info', function(){
  it('get company info from external database', function(done){
    request(server)
      .get('/Companies' + testExternalDB)
      .expect(200, done);
  });
});

//TU - 24 & Si controlla che gli Amministratori di un'azienda possano cercare un database esterno collegato.
describe('TU24 (127) - search database', function(){
  it('get external database', function(done){
    request(server)
      .get('/externalDatabases' + testExternalDB)
      .expect(200, done);
  });
});

//TU - 25 & Si controlla che un Amministratore di un'azienda possa concedere i permessi di accesso al database esterno ad un utente iscritto alla stessa azienda. & Non eseguito
describe('TU 25 (128) - allow user', function() {
   it('allow user to access external database', function(done){
    request(server)
      .post('/externalDatabases/allowUser')
      .send(testUser)
      .expect(200, done);
   }); 
});

//TU - 26 & Si controlla che gli Amministratori di un'azienda possa negare i permessi di accesso al database esterno ad un utente iscritto alla stessa azienda.
describe('TU 26 (129) - deny user', function() {
   it('deny user to access external database', function(done){
    request(server)
      .post('/externalDatabases/denyUser')
      .send(testUser)
      .expect(200, done);
   }); 
});