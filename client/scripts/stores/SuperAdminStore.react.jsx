var Dispatcher = require('../dispatcher/Dispatcher.js');
var Constants = require('../constants/Constants.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var SessionStore = require('./SessionStore.react.jsx');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';
var DELETE_EVENT = 'delete';
var LOGIN_SA_EVENT = 'login';

var _superAdmin = {
    id: SessionStore.getUserId(),
    email: SessionStore.getEmail()
};

  
var _errors = [];

var SuperAdminStore = assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    
    emitLoginSA: function() {
        this.emit(LOGIN_SA_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    
    addLoginSAListener: function(callback) {
        this.on(LOGIN_SA_EVENT, callback);
    },
    
    removeLoginSAListener: function(callback) {
        this.removeListener(LOGIN_SA_EVENT, callback);
    },

    getId: function() {
        return _superAdmin.id;
   },

    getEmail: function() {
      return _superAdmin.email;
   },
 
    getErrors: function() {
      return _errors;
  }
  
});

SuperAdminStore.dispatchToken = Dispatcher.register(function(payload) {
    var action = payload.action;
   
 switch(action.type)
    {

        case ActionTypes.LOGIN_RESPONSE:
            if(action.errors)
            {
                _errors = action.errors;
            }
            else if(action.json && action.json.userId)
            {
              _superAdmin.id = action.json.userId;
            }
            SuperAdminStore.emitChange();
            SuperAdminStore.emitLoginSA();
            break;

        case ActionTypes.LOGOUT:
            // remove user data
            _superAdmin.id = null;
            _superAdmin.email = null;
            SuperAdminStore.emitChange();
            break;
    }
});

module.exports = SuperAdminStore;