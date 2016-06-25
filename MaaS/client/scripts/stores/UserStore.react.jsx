var Dispatcher = require('../dispatcher/Dispatcher.js');
var Constants = require('../constants/Constants.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var WebAPIUtils = require('../utils/UserWebAPIUtils.js');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _users = [];
//var _errors = [];
var _user = { email: "" };

var UserStore = assign({}, EventEmitter.prototype, {

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
  }/*,

  getErrors: function() {
    return _errors;
  }*/

});

UserStore.dispatchToken = Dispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {
    
    case ActionTypes.GET_USER:
        _users = action.email;
        UserStore.emitChange();
        break;
        
  }

  return true;
});

module.exports = UserStore;