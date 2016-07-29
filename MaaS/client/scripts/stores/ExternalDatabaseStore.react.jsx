// Name: {ExternalDatabaseStore.react.jsx}
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
var mongoose = require('mongoose');
var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _databases = [];
var _connections = [];
var _errors = [];

var ExternalDatabaseStore = assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getId: function(i) {
        return _databases[i].id;
    },

    getName: function(i) {
        return _databases[i].name;
    },

    getPassword: function(i) {
        return _databases[i].password;
    },
    
    getConnString: function(i) {
        return _databases[i].connString;
    },
    
    getCompany: function(i) {
        return _databases[i].companyName;
    },
    
    getAllowed: function(i) {
        return _databases[i].allowed;
    },
    
    getDbs: function() {
        return _databases;
    },
    
    getDbNames: function() {
        var names = [];
        var length = _databases.length;
        for(var i = 0; i < length; ++i){
            names.push({ name: (_databases[i]).name, allowed: (_databases[i]).allowed });
            localStorage.setItem('db' + i, _databases[i].name);
            var el = _databases[i];
            console.log('>' + el);
        }
        return names;
    },
    
    getConnections: function() {
        return _connections;
    },

    getErrors: function() {
        return _errors;
    },
    
    setDbs: function(dbs, cb) {
        if(dbs)
        {
            _databases = dbs;
            return cb(null);
        }
        else
        {
            console.log('> failed inserting databases in store.');
            var err = {
                    message: 'Could not store databases'
                };
            return cb(err);
        }
    },
    
    setConnections: function(connections, cb) {
        if(connections)
        {
            _connections = connections;
            return cb(null);
        }
        else
        {
            console.log('> failed inserting connections in store.');
            var err = {
                    message: 'Could not store connections'
                };
            return cb(err);
        }
    }

});

// CompanyStore.dispatchToken = Dispatcher.register(function(payload) {
//     var action = payload.action;

//     switch(action.type) {

//         case ActionTypes.GET_COMPANY:
//             if(action.errors) {
//                 _errors = action.errors;
//             } else if(action.json) {
//                 _errors = []; // empty old errors
//                 // set company data
//                 _company.id = action.json.id;
//                 _company.name = action.json.name;
//                 localStorage.setItem('companyId', _company.id);
//                 localStorage.setItem('companyName', _company.name);
//             }
//             CompanyStore.emitChange();
//             break;

//         case ActionTypes.GET_USERS:
//             if(action.errors) {
//                 _errors = action.errors;
//             } else if(action.json) {
//                 _errors = []; // empty old errors
//                 // set users of the company
//                 _users = action.json;
//             }
//             CompanyStore.emitChange();
//             break;

//     }

//     return true;  // richiesto dal Promise nel Dispatcher
// });

ExternalDatabaseStore.dispatchToken = Dispatcher.register(function(payload) {
    var action = payload.action;
    
    switch(action.type) {
        case ActionTypes.GET_DBS:
            if(action.errors) {
                _errors = action.errors;
            } else if(action.json) {
                _errors = []; // empty old errors
                // set databases of the company
                _databases = action.json;
                console.log(_databases);
                localStorage.setItem('dbCount', _databases.length);
            }
            ExternalDatabaseStore.emitChange();
            break;
        
        case ActionTypes.CONNECT_DBS_RESPONSE:
            if(action.errors) {
                _errors = action.errors;
            } else if(action.name && action.name == localStorage.getItem('companyName')) {
                _errors = []; // empty old errors
                // connect databases of the company
                var length = _databases.length;
                if(length > 0)
                {
                    for(var i = 0; i < length; ++i){
                        var connString = _databases[i].connString;
                        var conn = mongoose.createConnection(connString);
                        _connections.push(conn);
                    }
                }
            }
            ExternalDatabaseStore.emitChange();
            break;
    }
})

module.exports = ExternalDatabaseStore;