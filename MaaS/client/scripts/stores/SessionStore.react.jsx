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

// Load values from the session storage, you might want to implement a 'remember me' using localSgorage

// var _session = {};  //new Object();
// _session['accessToken'] = sessionStorage.getItem('accessToken');
// _session['email'] = sessionStorage.getItem('email');;
// _session['userId'] = sessionStorage.getItem('userId');   // user id

// show the values stored
// for (var k in _session) {
//     // use hasOwnProperty to filter out keys from the Object.prototype
//     if (_session.hasOwnProperty(k)) {
//         alert('key is: ' + k + ', value is: ' + _session[k]);
//     }
// }

var _accessToken = sessionStorage.getItem('accessToken');
var _email = sessionStorage.getItem('email');
var _userId = sessionStorage.getItem('userId');   // user id
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
    //return _session['accessToken'] ? true : false;
    return _accessToken ? true : false;
  },

  isRegistered: function() {
    //return _session['email'] ? true : false;
    return _email ? true : false;
  },

  getAccessToken: function() {
    //return _session['accessToken'];
    return _accessToken;
  },

  getEmail: function() {
    //return _session['email'];
    return _email;
  },

  getUserId: function() {
    //return _session['userId'];
    return _userId;
  },

  // for all other items, defined by us
  // getItem: function(key) {
  //   return _session[key];
  // },

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
            // _session['email'] = action.json.email;
            sessionStorage.setItem('email', action.json.email);
        }
        SessionStore.emitChange();
        break;

    case ActionTypes.LOGIN_RESPONSE:
        if(action.errors) {
            _errors = action.errors;
        } else if(action.json && action.json.id) {
            _accessToken = action.json.id;
            _userId = action.json.userId;
            // _session['accessToken'] = action.json.id;
            // _session['userId'] = action.json.userId;
            sessionStorage.setItem('accessToken', action.json.id);
            sessionStorage.setItem('userId', action.json.userId);
        }
        SessionStore.emitChange();
        break;

    case ActionTypes.INVITE_RESPONSE:
        if(action.errors) {
            _errors = action.errors;
        } else {
            _errors = []; //empty old errors
        }
        SessionStore.emitChange();
        break;

    case ActionTypes.LOGOUT:
      // remove session data
        _accessToken = null;
        _userId = null,
        _email = null;
        // _session['accessToken'] = null;
        // _session['userId'] = null;
        // _session['email'] = null;
        // sessionStorage.removeItem('accessToken');
        // sessionStorage.removeItem('userId');
        // sessionStorage.removeItem('email');
        sessionStorage.clear(); // clear all data
        SessionStore.emitChange();
        break;

    // case ActionTypes.SESSION_SET:
    //     var key = action.key;
    //     var value = action.value;
    //     if(key && value) {
    //         sessionStorage.setItem(key, value);
    //     }
    //     SessionStore.emitChange();
    //     break;
  }

  return true;
});

module.exports = SessionStore;