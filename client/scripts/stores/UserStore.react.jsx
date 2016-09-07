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
var USER_LOAD_EVENT = 'load';
var CHANGE_EVENT = 'change';
var DELETE_EVENT = 'delete';
var USERS_LOAD_EVENT = 'loadAll';

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
              theme: localStorage.getItem('theme'),
              tabSize: localStorage.getItem('tabSize'),
              fontSize: localStorage.getItem('fontSize'),
              activeDashboard: localStorage.getItem('activeDashboard')
            };
var _errors = [];
var _users = JSON.parse(localStorage.getItem('users')); //all users in the system
var UserStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  
  emitDelete: function() {
    this.emit(DELETE_EVENT);
  },
  
  emitUserLoad: function() {
    this.emit(USER_LOAD_EVENT);
  },

  emitAllUsersLoad: function() {
    this.emit(USERS_LOAD_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  
  addDeleteListener: function(callback) {
      this.on(DELETE_EVENT, callback);
  },

  removeDeleteListener: function(callback) {
      this.removeListener(DELETE_EVENT, callback);
  },
  
  addUserLoadListener: function(callback) {
      this.on(USER_LOAD_EVENT, callback);
  },
  
  removeUserLoadListener: function(callback) {
      this.removeListener(USER_LOAD_EVENT, callback);
  },

  addAllUsersLoadListener: function(callback) {
      this.on(USERS_LOAD_EVENT, callback);
  },
  
  removeAllUsersLoadListener: function(callback) {
      this.removeListener(USERS_LOAD_EVENT, callback);
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
  },
  
  getEditorTabSize: function() {
    return _user.tabSize;
  },
  
  getEditorFontSize: function() {
    return _user.fontSize;
  },
  
  getActiveDashboard: function() {
    return _user.activeDashboard;
  },
  
  getAllUsers: function() {
    return _users;
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
            _user.softTabs = action.json.config.softTabs;
            _user.tabSize = action.json.config.tabSize;
            _user.fontSize = action.json.config.fontSize;
            localStorage.setItem('softTabs',_user.softTabs);
            localStorage.setItem('theme',_user.theme);
            localStorage.setItem('tabSize',_user.tabSize);
            localStorage.setItem('fontSize',_user.fontSize);
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
        if(action.json) 
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
          _user.activeDashboard = action.json.activeDashboard;
          // save session data
          localStorage.setItem('email', _user.email);
          localStorage.setItem('userName', _user.name);
          localStorage.setItem('userSurname', _user.surname);
          localStorage.setItem('userDateOfBirth', _user.dateOfBirth);
          localStorage.setItem('userGender', _user.gender);
          localStorage.setItem('userAvatar', _user.avatar);
          localStorage.setItem('userRole', _user.role);
          localStorage.setItem('activeDashboard',_user.activeDashboard);
        }
        UserStore.emitUserLoad();
        // UserStore.emitChange();
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
          _user.tabSize = action.json.tabSize;
          _user.fontSize = action.json.fontSize;
          localStorage.setItem('softTabs', _user.softTabs);
          localStorage.setItem('theme', _user.theme);
          localStorage.setItem('tabSize', _user.tabSize);
          localStorage.setItem('fontSize', _user.fontSize);
        }
        UserStore.emitChange();
        break;
        
      case ActionTypes.CHANGE_ROLE_RESPONSE:
        if(action.errors) {
            _errors = action.errors;
        } else {
            _errors = [];
            //var email = action.email;
        }
        UserStore.emitChange();
        break;
        
      case ActionTypes.DELETE_USER:
        if(action.errors)
        {
            _errors = action.errors;
        }
        else
        {
            _errors = [];
            //var email = action.email;
            
            if(_users)  // only for superadmin
            {
              var index;
              _users.forEach(function(user, i) {
                  if(user.email == action.email) 
                    index = i;
              });
              _users.splice(index, 1);
            }
        }
        UserStore.emitDelete();
        break;
        
      case ActionTypes.DELETE_ALL_SELECTED_USERS_RESPONSE:
        if(action.errors)
        {
          _errors.push(action.errors);
        }
        else
        {
          _errors = [];
          var count = 0;
          for (var i = 0; count < action.arrayId.length && i <_users.length; i++)
          {
              for (var j = 0; j < action.arrayId.length; j++)
              {
                  if(_users[i].id == action.arrayId[j])
                  {
                      _users.splice(i,1);
                      count++;
                  }
              }
          }
        }
        UserStore.emitDelete();
        break;
      
      case ActionTypes.GET_ALL_USERS:
          if(action.errors) {
            _errors = action.errors;
        } else {
            _errors = [];
            _users = action.json;
            localStorage.setItem('users', JSON.stringify(_users));
        }
        UserStore.emitAllUsersLoad();
        break;
      
      case ActionTypes.CHANGE_USER_EMAIL:
        if(action.errors) {
          _errors = action.errors;
        }
        else
        {
          _errors = [];
          
          if(_users)  // only for superadmin
          {
            var i = 0;
            while(i < _users.length && _users[i].id != action.json.id )
                i++;
            _users[i].email = action.json.newEmail;
          }
        }
        UserStore.emitChange();  
      break;
      
      case ActionTypes.CHANGE_ACTIVE_DASHBOARD:
        if(action.errors) {
          _errors = action.errors;
        }
        else
        {
          _user.activeDashboard = action.dashboard;
          localStorage.setItem('activeDashboard',_user.activeDashboard);
        }
        UserStore.emitChange();
        break;
      
      case ActionTypes.DELETE_COMPANY:
        if(action.errors) {
          _errors = action.errors;
        }
        else
        {
          _errors = [];
          
          if(_users)  // only for superadmin
          {
            var j = 0;
            while(j < _users.length)
            {
              if(_users[j].companyId == action.id)
              {
                _users.splice(j, 1); 
                j--; 
              }
              j++;
            }
          }
        }
        UserStore.emitChange(); 
      break;
      
      case ActionTypes.LEAVE_IMPERSONATE:
        _user.name = localStorage.removeItem('userName');
        _user.surname = localStorage.removeItem('userSurname');
        _user.dateOfBirth =localStorage.removeItem('userDateOfBirth');
        _user.gender = localStorage.removeItem('userGender');
        _user.avatar = localStorage.removeItem('userAvatar');
        _user.role = localStorage.removeItem('userRole');
        _user.softTabs = localStorage.removeItem('softTabs');
        _user.theme = localStorage.removeItem('theme');
        _user.tabSize = localStorage.removeItem('tabSize');
        _user.fontSize = localStorage.removeItem('fontSize');
        _user.activeDashboard = localStorage.removeItem('activeDashboard');
      break;
    }
    return true;  // richiesto dal Promise nel Dispatcher
});

module.exports = UserStore;