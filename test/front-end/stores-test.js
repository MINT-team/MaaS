var testUser= {
  'company' : 'testCompany',
  'email' : 'test@test.com',
  'password' : 'testPassword',
  'confirmation' : 'testPassword'
};

var request = require('supertest');
var server = require('../../server/testconfig.js');
var assert = require('assert');
// var testInterface = require('../testServer.js').storeInterface;
// var server = require('../../server/server.js'); per poter chiamare il vero server
var testCompany = '/testCompany'; 
var testUserId = '/testUserId';
var testExternalDB = '/testExternalDB';
var testDSLid = '/testDSLid';
var value = "/";

describe('TU 209 - test store interface', function(){
	it('signal change in store', function(){
	    var test = server.onChange();
		assert.equal(test, true);
	});
});

describe('TU 210 - get store state information', function(){
	it('obtain the state of the store', function(){
	    var test = server.getState();
		assert.deepEqual(test, {});
	});
});

describe('TU 211 - get store change signal', function(){
	it('get a signal from the changed store', function(){
	    var test = server.emitChange();
		assert.equal(test, 'CHANGE_OCCURRED');
	});
});

describe('TU 212 - add store change listener', function(){
	it('add a signal listener to the store', function(){
	    var test = server.addChangeListener();
		assert.equal(test, 0);
	});
});

describe('TU 213 - remove a store change listener', function(){
	it('remove a signal listener from the store', function(){
	    var test = server.removeChangeListener();
		assert.equal(test, 0);
	});
});

describe('TU 214 - get subject store state information', function(){
	it('obtain the state of the subject store', function(){
	    var test = server.getSubjectState();
		assert.deepEqual(test, {});
	});
});