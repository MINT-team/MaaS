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

var mongoose = require('mongoose');
var ActionTypes = Constants.ActionTypes;

var CHANGE_EVENT = 'change';
var DELETE_EVENT = 'delete';

var _databases = JSON.parse(localStorage.getItem('databaseList'));
var _connections = [];
var _errors = [];

var ExternalDatabaseStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    
    emitDelete: function() {
        this.emit(DELETE_EVENT);
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

ExternalDatabaseStore.dispatchToken = Dispatcher.register(function(payload) {
    var action = payload.action;
    
    switch(action.type) {
        case ActionTypes.GET_DBS:
            if(action.errors)
            {
                _errors = action.errors;
            }
            else if(action.json)
            {
                _errors = []; // empty old errors
                _databases = action.json;
                localStorage.setItem('databaseList',JSON.stringify(action.json));
            }
            ExternalDatabaseStore.emitChange();
            break;
        
        case ActionTypes.CONNECT_DBS_RESPONSE:
            if(action.errors)
            {
                _errors = action.errors;
            }
            else if(action.name && action.name == localStorage.getItem('companyName'))
            {
                _errors = []; // empty old errors
                // connect databases of the company
                var length = _databases.length;
                if(length > 0)
                {
                    for(var i = 0; i < length; ++i)
                    {
                        var connString = _databases[i].connString;
                        var conn = mongoose.createConnection(connString);
                        _connections.push(conn);
                    }
                }
            }
            ExternalDatabaseStore.emitChange();
            break;
        case ActionTypes.ADD_EXT_DB_RESPONSE:
            if(action.errors)
            {
                _errors = action.errors;
            }
            else if(action.json)
            {
                _errors = []; // empty old errors
                _databases.push(action.json);
            }
            ExternalDatabaseStore.emitChange();
            break;
        case ActionTypes.DELETE_DB:
            if(action.id)
            {
                _errors = [];
                
                _databases.forEach(function(database, i) {
                    if (database.id == action.id)
                    {
                        _databases.splice(i,1);
                    }
                });
            }
            ExternalDatabaseStore.emitChange();
            break;
        case ActionTypes.CHANGE_STATE_DB:
            if (action.errors)
            {
                _errors = action.errors;
            }
            else if(action.json)
            {
                _errors = [];
                _databases.forEach(function(database,i) {
                    if (database.id == action.json.id)
                    {
                        database.connected = action.json.connected;
                    }
                });
            }
            ExternalDatabaseStore.emitChange();
            break;
    }
});

module.exports = ExternalDatabaseStore;