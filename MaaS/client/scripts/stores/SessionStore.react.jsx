var Dispatcher = require('../dispatcher/Dispatcher.js');
var Constants = require('../constants/Constants.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

// Load an access token from the session storage, you might want to implement
// a 'remember me' using localSgorage
var _accessToken = sessionStorage.getItem('accessToken');
var _email = sessionStorage.getItem('email');
var _user = sessionStorage.getItem('userId');   // user id
var _errors = [];

var SessionStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  isLogged: function() {
    return _accessToken ? true : false;
  },

  getAccessToken: function() {
    return _accessToken;
  },

  getEmail: function() {
    return _email;
  },

  getErrors: function() {
    return _errors;
  }

});

SessionStore.dispatchToken = Dispatcher.register(function(payload) {
  var action = payload.action;
  //var source = payload.source;  // lato server o lato client

  switch(action.type) {

    case ActionTypes.SIGNUP_RESPONSE:
        if(action.errors) {
            _errors = action.errors;
        } else if(action.json) {
            _email = action.json.email;
            sessionStorage.setItem('email', _email);
        }
        SessionStore.emitChange();
        break;

    case ActionTypes.LOGIN_RESPONSE:
        if(action.errors) {
            _errors = action.errors;
        } else if(action.json && action.json.id) {
            _accessToken = action.json.id;
            _user = action.json.userId;
            // Token will always live in the session, so that the API can grab it with no hassle
            sessionStorage.setItem('accessToken', _accessToken);
            sessionStorage.setItem('userId', _user);
        }
        SessionStore.emitChange();
        break;

    case ActionTypes.LOGOUT:
      // remove session data
        _accessToken = null;
        _user = null,
        _email = null;
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('email');
        SessionStore.emitChange();
        break;

  }

  return true;
});

module.exports = SessionStore;