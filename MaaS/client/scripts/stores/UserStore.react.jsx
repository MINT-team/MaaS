var Dispatcher = require('../dispatcher/Dispatcher.js');
var Constants = require('../constants/Constants.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
//var WebAPIUtils = require('../utils/UserWebAPIUtils.js');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _users = [];//{ id: "a", email: "aaa" }, { id: "b", email: "bbb" }];
var _errors = [];
var _user = {
              id: sessionStorage.getItem('userId'),
              email: sessionStorage.getItem('email')
            };

var UserStore = assign({}, EventEmitter.prototype, {

  getAll: function() {
    return _users;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getUser: function() {
    return _user;
  },

  getErrors: function() {
    return _errors;
  }

});

UserStore.dispatchToken = Dispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.type) {

      case ActionTypes.RESET_PASSWORD_RESPONSE:
        if(action.errors) {
            _errors = action.errors;
        } else if(action.json) {
            var email = action.json.email;
            _user.email = email;
            sessionStorage.setItem('email', email);
        }
        UserStore.emitChange();
        break;

      case ActionTypes.CHANGE_PASSWORD_RESPONSE:
        if(action.errors) {
            _errors = action.errors;
        } else if(action.email) {
            _errors = []; // empty old errors
            _user.email = action.email;
            sessionStorage.setItem('email', action.email);
        }
        UserStore.emitChange();

        break;

      case ActionTypes.LOGOUT:
        // remove user data
        _user.id = null;
        _user.email = null;
        UserStore.emitChange();
        break;

      case ActionTypes.GET_ALL_USERS:
        _users = action.json;
        UserStore.emitChange();
        break;

    }

    return true;  //Niente errori, richiesto dal Promise nel Dispatcher (? ..mah ok)
});

module.exports = UserStore;