// Name: {UserStore.react.jsx}
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

var _user = {
              id: SessionStore.getUserId(),
              email: SessionStore.getEmail(),
              name: localStorage.getItem('userName') || "",
              surname: localStorage.getItem('userSurname') || "",
              dateOfBirth: new Date(localStorage.getItem('userDateOfBirth')),
              gender: localStorage.getItem('userGender'),
              avatar: localStorage.getItem('userAvatar'),
              role: localStorage.getItem('userRole'),
              softTabs: localStorage.getItem('softTabs'),
              theme: localStorage.getItem('theme')
            };
var _errors = [];

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
  },

  getId: function() {
    return _user.id;
  },

  getEmail: function() {
    return _user.email;
  },

  getName: function() {
    return _user.name;
  },

  getSurname: function() {
    return _user.surname;
  },

  getDateOfBirth: function() {
    return _user.dateOfBirth;
  },

  getGender: function() {
    return _user.gender;
  },

  getAvatar: function() {
    return _user.avatar;
  },

  getRole: function() {
    return _user.role;
  },

  getErrors: function() {
    return _errors;
  },

  getEditorTheme: function() {
    return _user.theme;
  },
  
  getEditorSoftTabs: function() {
    return _user.softTabs;
  }

});

UserStore.dispatchToken = Dispatcher.register(function(payload) {
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
          _user.id = action.json.userId;
        }
        UserStore.emitChange();
        break;

      case ActionTypes.RESET_PASSWORD_RESPONSE:
        if(action.errors) 
        {
          _errors = action.errors;
        } else if(action.json) 
        {
          _errors = []; // empty old errors
          var email = action.json.email;
          _user.email = email;    // email dell'utente corrente, anche se non loggato
          localStorage.setItem('email', _user.email);
        }
        UserStore.emitChange();
        break;

      case ActionTypes.CHANGE_PASSWORD_RESPONSE:
        if(action.errors) 
        {
          _errors = action.errors;
        } else if(action.email) 
        {
          _errors = []; // empty old errors
          _user.email = action.email;   // email dell'utente corrente, anche se non loggato
          localStorage.setItem('email', _user.email);
        }
        UserStore.emitChange();
        break;

      case ActionTypes.CHANGE_DATA_RESPONSE:
        if(action.errors) 
        {
          _errors = action.errors;
        } 
        else if(action.json) 
        {
          _errors = []; // empty old errors
          _user.name = action.json.name;
          _user.surname = action.json.surname;
          _user.dateOfBirth = new Date(action.json.dateOfBirth);
          _user.gender = action.json.gender;
          // save session data
          localStorage.setItem('userName', _user.name);
          localStorage.setItem('userSurname', _user.surname);
          localStorage.setItem('userDateOfBirth', _user.dateOfBirth);
          localStorage.setItem('userGender', _user.gender);
        }
        UserStore.emitChange();
        break;

      case ActionTypes.GET_EDITOR_CONFIG_RESPONSE:
        if(action.json) 
        {
            _errors = []; // empty old errors usare local
            _user.theme = action.json.config.theme;
            localStorage.setItem('theme',action.json.config.theme);
        }
        UserStore.emitChange();
        break;

      case ActionTypes.LOGOUT:
        // remove user data
        _user.id = null;
        _user.email = null;
        UserStore.emitChange();
        break;

      case ActionTypes.GET_USER:
        if(action.errors) 
        {
          _errors = action.errors;
        } 
        else if(action.json) 
        {
          _errors = []; // empty old errors
          // set user data
          _user.email = action.json.email;
          _user.name = action.json.name || "";
          _user.surname = action.json.surname || "";
          _user.dateOfBirth = new Date(action.json.dateOfBirth);
          _user.gender = action.json.gender || "";
          _user.avatar = action.json.avatar;
          _user.role = action.json.role;
          // save session data
          localStorage.setItem('email', _user.email);
          localStorage.setItem('userName', _user.name);
          localStorage.setItem('userSurname', _user.surname);
          localStorage.setItem('userDateOfBirth', _user.dateOfBirth);
          localStorage.setItem('userGender', _user.gender);
          localStorage.setItem('userAvatar', _user.avatar);
          localStorage.setItem('userRole', _user.role);
        }
        UserStore.emitChange();
        break;
        
      case ActionTypes.CHANGE_EDITOR_CONFIG_RESPONSE:
        if(action.errors) 
        {
          _errors = action.errors;
        } 
        else if(action.json) 
        {
          _errors = [];
          _user.softTabs = action.json.softTabs;
          _user.theme = action.json.theme;
          localStorage.setItem('softTabs', _user.softTabs);
          localStorage.setItem('theme', _user.theme);
        }
        UserStore.emitChange();
        break;
        
    }
    return true;  // richiesto dal Promise nel Dispatcher
});

module.exports = UserStore;