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

describe('TU 142 - edit user avatar action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('EDIT_USER_AVATAR_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 143 - edit user personal data action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('EDIT_USER_PERSONAL_DATA_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 144 - edit user password action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('EDIT_USER_PASSWORD_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 145 - get users action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('GET_USERS_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 146 - get user action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('GET_USER_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 147 - delete user action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('DELETE_USER_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 148 - search user action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('SEARCH_USER_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 149 - forgot password action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('FORGOT_PASSWORD_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 150 - change role action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('CHANGE_ROLE_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 151 - send invite action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('SEND_INVITE_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 152 - get collections action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('GET_COLLECTIONS_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 153 - create collection action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('CREATE_COLLECTION_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 154 - edit collection action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('EDIT_COLLECTION_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 155 - delete collection action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('DELETE_COLLECTION_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 156 - retrieve collection dslis action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('RETRIEVE_COLLECTION_DSLIS_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 157 - search collection action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('SEARCH_COLLECTION_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 158 - execute collection action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('EXECUTE_COLLECTION_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 159 - send email action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('SEND_EMAIL_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 160 - export action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('EXPORT_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 161 - export dslis action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('EXPORT_DSLIS_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 162 - import dslis action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('IMPORT_DSLIS_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 163 - get document action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('GET_DOCUMENT_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 164 - create document action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('CREATE_DOCUMENT_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 165 - edit document action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('EDIT_DOCUMENT_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 166 - delete document action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('DELETE_DOCUMENT_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 167 - search document action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('SEARCH_DOCUMENT_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 168 - execute document action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('EXECUTE_DOCUMENT_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 169 - send email action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('SEND_EMAIL_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 170 - export dslis action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('EXPORT_DSLIS_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 171 - retrieve document dslis action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('RETRIEVE_DOCUMENT_DSLIS_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 172 - export action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('EXPORT_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 173 - import dslis action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('IMPORT_DSLIS_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 174 - get dashboards action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('GET_DASHBOARDS_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 175 - create dashboard action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('CREATE_DASHBOARD_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 176 - edit dashboard action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('EDIT_DASHBOARD_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 177 - delete dashboard action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('DELETE_DASHBOARD_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 178 - search dashboard action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('SEARCH_DASHBOARD_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 179 - execute dashboard action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('EXECUTE_DASHBOARD_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 180 - export dslis action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('EXPORT_DSLIS_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 181 - retrieve dashboard dslis action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('RETRIEVE_DASHBOARD_DSLIS_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 182 - import dslis action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('IMPORT_DSLIS_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 183 - get cell action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('GET_CELL_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 184 - create cell action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('CREATE_CELL_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 185 - edit cell action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('EDIT_CELL_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 186 - delete cell action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('DELETE_CELL_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 187 - search cell action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('SEARCH_CELL_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 188 - execute cell action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('EXECUTE_CELL_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 189 - export dslis action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('EXPORT_DSLIS_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 190 - retrieve cell dslis action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('RETRIEVE_CELL_DSLIS_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 191 - import dslis action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('IMPORT_DSLIS_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 192 - create external database action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('CREATE_EXTERNAL_DATABASE_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 193 - delete external database action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('DELETE_EXTERNAL_DATABASE_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 194 - get external databases action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('GET_EXTERNAL_DATABASES_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 195 - search external database action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('SEARCH_EXTERNAL_DATABASE_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 196 - allow external database access action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('ALLOW_EXTERNAL_DATABASE_ACCESS_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 197 - deny external database access action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('DENY_EXTERNAL_DATABASE_ACCESS_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 198 - get companies action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('GET_COMPANIES_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 199 - create company action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('CREATE_COMPANY_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 200 - get company action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('GET_COMPANY_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 201 - edit company action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('EDIT_COMPANY_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 202 - delete company action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('DELETE_COMPANY_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 203 - search company action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('SEARCH_COMPANY_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 204 - create user action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('CREATE_USER_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 205 - login user action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('LOGIN_USER_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 206 - login super administrator action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('LOGIN_SUPER_ADMINISTRATOR_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 207 - logout user action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('LOGOUT_USER_RESPONSE')
			.expect(200, done);
	});
});

describe('TU 208 - logout super administrator action', function(){
	it('send the action response', function(done){
		request(server)
			.post('/')
			.send('LOGOUT_SUPER_ADMINISTRATOR_RESPONSE')
			.expect(200, done);
	});
});
