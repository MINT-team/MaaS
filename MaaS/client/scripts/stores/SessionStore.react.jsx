// Name: {SessionStore.react.jsx}
// Module: {Front-end::Stores}
// Location: {/MaaS/client/scripts/stores/}

// History:
// Version         Date            Programmer
// ==========================================

var Dispatcher = require('../dispatcher/Dispatcher.js');
var Constants = require('../constants/Constants.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

// Load values from the  localSgorage
var _accessToken = localStorage.getItem('accessToken');
var _email = localStorage.getItem('email');
var _userId = localStorage.getItem('userId');   // user id
var _userType = localStorage.getItem('userType');
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

  isRegistered: function() {
    return _email ? true : false;
  },

  getAccessToken: function() {
    return _accessToken;
  },

  getEmail: function() {
    return _email;
  },

  getUserId: function() {
    return _userId;
  },

  getErrors: function() {
    return _errors;
  },
  
  whoIam: function(){
    return _userType;
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
            localStorage.setItem('email', action.json.email);
        }
        SessionStore.emitChange();
        break;

    case ActionTypes.LOGIN_RESPONSE:
        if(action.errors) {
            _errors = action.errors;
        } else if(action.json && action.json.id) {
            _accessToken = action.json.id;
            _userId = action.json.userId;
            _userType = action.json.type;
            localStorage.setItem('accessToken', action.json.id);
            localStorage.setItem('userId', action.json.userId);
            localStorage.setItem('userType', action.json.type);
        }
        SessionStore.emitChange();
        break;

    case ActionTypes.INVITE_RESPONSE:
        if(action.errors) {
            _errors = action.errors;
            _email = null;
        } else {
            _errors = []; //empty old errors
            _email = action.email;
        }
        SessionStore.emitChange();
        break;

    case ActionTypes.LOGOUT:
      // remove session data
        _accessToken = null;
        _userId = null;
        _email = null;
        localStorage.clear(); // clear all data
        SessionStore.emitChange();
        break;
  }

  return true;
});

module.exports = SessionStore;