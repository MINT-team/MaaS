var Dispatcher = require('../dispatcher/Dispatcher.js');
var Constants = require('../constants/Constants.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
//var WebAPIUtils = require('../utils/UserWebAPIUtils.js');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _users = [];//{ id: "a", email: "aaa" }, { id: "b", email: "bbb" }];
//var _errors = [];
var _user = { id: "", email: "" };

function create(email) {

  var id = _users.length; //Date.now() Using the current timestamp in place of a real id.
  _users[id] = {
    id: id,
    email: email
  };
}

function destroy(id) {
  delete _users[id];
}

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

  /*getErrors: function() {
    return _errors;
  }*/

  dispatcherIndex: Dispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.type) {

      case ActionTypes.CREATE_USER:
        create(action.email);
        UserStore.emitChange();
        break;

      case ActionTypes.DESTROY_USER:
        destroy(action.id);
        UserStore.emitChange();
        break;

    }

    return true;  //Niente errori, richiesto dal Promise nel Dispatcher (? ..mah ok)
  })

});

module.exports = UserStore;