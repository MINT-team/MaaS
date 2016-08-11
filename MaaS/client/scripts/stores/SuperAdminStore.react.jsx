// Name: {SuperAdminStore.react.jsx}
// Module: {Front-end::Stores}
// Location: {/MaaS/client/scripts/stores/}

// History:
// Version         Date            Programmer
// ==========================================

var Dispatcher = require('../dispatcher/Dispatcher.js');
var Constants = require('../constants/Constants.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var SessionStore = require('./SessionStore.react.jsx');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';
var DELETE_EVENT = 'delete';


var _superAdmin = {
    id: SessionStore.getUserId(),
    email: SessionStore.getEmail()
};

var _companyName;

var _errors = [];

var SuperAdminStore = assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getId: function() {
        return _superAdmin.id;
   },

    getEmail: function() {
        return _superAdmin.email;
  },
  
  getCompanyName: function(){
      return _companyName;
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
            break;

        case ActionTypes.LOGOUT:
            // remove user data
            _superAdmin.id = null;
            _superAdmin.email = null;
            SuperAdminStore.emitChange();
            break;
        
        case ActionTypes.CHANGE_COMPANY_NAME_RESPONSE:
            if(action.errors)
                _errors = action.errors;
            else
            {
                _errors = [];
                _companyName = action.name;
            }
            SuperAdminStore.emitChange();
            break;
    }
});

module.exports = SuperAdminStore;