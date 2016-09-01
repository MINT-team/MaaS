/*
* Name: {DSLStore.react.jsx}
* Module: {Front-end}
* Location: {/MaaS/client/scripts/stores/}
* 
* History:
* Version         Date            Programmer
* ===================================================
* 0.0.1        2016/08/02   Navid Taha, Fabiano Tavallini
* ---------------------------------------------------
* First structure of the file.
* ===================================================
*/

var Dispatcher = require('../dispatcher/Dispatcher.js');
var Constants = require('../constants/Constants.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';
var SAVE_EVENT = 'save';
var COMPILE_EVENT = 'compile';
var EXECUTE_EVENT = 'execute';
var NESTED_EXECUTE_EVENT = 'nested_execute';
var UPLOAD_EVENT = 'upload';
var CHANGE_DATABASE_EVENT = 'change_database';
var INCLUDE_EVENT = 'include';
 
var _DSL_LIST = JSON.parse(localStorage.getItem('DSLList'));    // DSL LIST WITH PERMISSION for current user

var _DSL = {
    id: localStorage.getItem('DSLId'),
    name: localStorage.getItem('DSLName'),
    source: localStorage.getItem('DSLSource'),
    type: localStorage.getItem('DSLType'),
    database: localStorage.getItem('DSLDatabase')
};

var current_DSL = {
    currentDefinitionName: localStorage.getItem('currentDefinitionName'),
    currentDefinitionType: localStorage.getItem('currentDefinitionType'),
    currentDefinitionSource: localStorage.getItem('currentDefinitionSource'),
    currentDefinitionDatabase: localStorage.getItem('currentDefinitionDatabase')
};

var includeSource = localStorage.getItem('includeSource');

var _USER_LIST = []; // Member and Guest list

var _DSL_DATA; // Data results from DSL execution
var _DSL_NESTED_DATA;

var _errors = [];

var DSLStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    
    emitSave: function() {
        this.emit(SAVE_EVENT);
    },

    addSaveListener: function(callback) {
        this.on(SAVE_EVENT, callback);
    },

    removeSaveListener: function(callback) {
        this.removeListener(SAVE_EVENT, callback);
    },
    
    emitCompile: function() {
        this.emit(COMPILE_EVENT);
    },

    addCompileListener: function(callback) {
        this.on(COMPILE_EVENT, callback);
    },

    removeCompileListener: function(callback) {
        this.removeListener(COMPILE_EVENT, callback);
    },
    
    emitExecute: function() {
        this.emit(EXECUTE_EVENT);
    },

    addExecuteListener: function(callback) {
        this.on(EXECUTE_EVENT, callback);
    },

    removeExecuteListener: function(callback) {
        this.removeListener(EXECUTE_EVENT, callback);
    },
    
    emitNestedExecute: function() {
        this.emit(NESTED_EXECUTE_EVENT);
    },

    addNestedExecuteListener: function(callback) {
        this.on(NESTED_EXECUTE_EVENT, callback);
    },

    removeNestedExecuteListener: function(callback) {
        this.removeListener(NESTED_EXECUTE_EVENT, callback);
    },
    
    emitUpload: function() {
        this.emit(UPLOAD_EVENT);
    },

    addUploadListener: function(callback) {
        this.on(UPLOAD_EVENT, callback);
    },

    removeUploadListener: function(callback) {
        this.removeListener(UPLOAD_EVENT, callback);
    },
    
    emitChangeDatabase: function() {
        this.emit(CHANGE_DATABASE_EVENT);
    },

    addChangeDatabaseListener: function(callback) {
        this.on(CHANGE_DATABASE_EVENT, callback);
    },

    removeChangeDatabaseListener: function(callback) {
        this.removeListener(CHANGE_DATABASE_EVENT, callback);
    },
    
    emitInclude: function() {
        this.emit(INCLUDE_EVENT);
    },

    addIncludeListener: function(callback) {
        this.on(INCLUDE_EVENT, callback);
    },

    removeIncludeListener: function(callback) {
        this.removeListener(INCLUDE_EVENT, callback);
    },
    
    getErrors: function() {
        return _errors;
    },
    
    getId: function() {
        return _DSL.id;
    },
    
    getName: function() {
        return _DSL.name;
    },
    
    getType: function() {
        return _DSL.type;  
    },
    
    getSource: function() {
        return _DSL.source;
    },
    
    getDatabase: function() {
        return _DSL.database;
    },
    
    getDSLList: function() {
        return _DSL_LIST;
    },
    
    getUserList: function() {
        return _USER_LIST;
    },
    
    getDSLData: function() {
        return _DSL_DATA;
    },
    
    getDSLNestedData: function() {
        return _DSL_NESTED_DATA;
    },
    
    getCurrentDefinitionName: function() {
        return current_DSL.currentDefinitionName;
    },
    
    getCurrentDefinitionType: function() {
        return current_DSL.currentDefinitionType;
    },
    
    getCurrentDefinitionSource: function() {
        return current_DSL.currentDefinitionSource;
    },
    
    getCurrentDefinitionDatabase: function() {
        return current_DSL.currentDefinitionDatabase;
    },
    
    getIncludeSource: function() {
        return includeSource;
    }
});

DSLStore.dispatchToken = Dispatcher.register(function(payload) {
    var action = payload.action;
    var messages;
    
    switch (action.type) {
        case ActionTypes.LOAD_DSL_RESPONSE:
            if (action.errors)
            {
                _errors = action.errors;
            }
            else if(action.definition)
            {
                _errors = [];
                _DSL.id = action.definition.id;
                _DSL.name = action.definition.name;
                _DSL.type = action.definition.type;
                _DSL.source = action.definition.source;
                _DSL.database = action.definition.externalDatabaseId;
                
                localStorage.setItem('DSLId', _DSL.id);
                localStorage.setItem('DSLName', _DSL.name);
                localStorage.setItem('DSLType', _DSL.type);
                localStorage.setItem('DSLSource', _DSL.source);
                localStorage.setItem('DSLDatabase', _DSL.database);
            }
            DSLStore.emitChange();
            break;
            
        case ActionTypes.LOAD_DSL_ACCESS_RESPONSE:
            if (action.errors)
            {
                _errors = action.errors;
            }
            else if(action.json)
            {
                _errors = [];
                _DSL.id = action.json[0].dsl.id;
                _DSL.name = action.json[0].dsl.name;
                _DSL.type = action.json[0].dsl.type;
                _DSL.source = action.json[0].dsl.source;
                _DSL.database = action.json[0].dsl.externalDatabaseId;
                
                _DSL_LIST.push(action.json[0]);
                
                localStorage.setItem('DSLId', _DSL.id);
                localStorage.setItem('DSLName', _DSL.name);
                localStorage.setItem('DSLType', _DSL.type);
                localStorage.setItem('DSLSource', _DSL.source);
                localStorage.setItem('DSLDatabase', _DSL.database);
            }
            DSLStore.emitChange();
            break;
    
        case ActionTypes.LOAD_DSL_LIST_RESPONSE:
            if(action.definitionList)
            {
                _errors = [];
                _DSL_LIST = action.definitionList;
                localStorage.setItem('DSLList', JSON.stringify(_DSL_LIST));
            }
            DSLStore.emitChange();
        
        case ActionTypes.SAVE_DSL_RESPONSE:
            if(action.errors)
            {
                _errors.push(action.errors);
            }
            else if(action.definition)
            {
                _DSL.id = action.definition.id;
                _DSL.name = action.definition.name;
                _DSL.type = action.definition.type;
                _DSL.source = action.definition.source;
                _DSL.database = action.definition.externalDatabaseId;
                
                localStorage.setItem('DSLId',_DSL.id);
                localStorage.setItem('DSLName',_DSL.name);
                localStorage.setItem('DSLType', _DSL.type);
                localStorage.setItem('DSLSource',_DSL.source);
                localStorage.setItem('DSLDatabase', _DSL.database);
            }
            //DSLStore.emitChange();
            DSLStore.emitSave();
            break;
        
        case ActionTypes.OVERWRITE_DSL_RESPONSE:
            if(action.errors)
            {
                _errors.push(action.errors);
            }
            else if(action.definition)
            {
                _DSL.id = action.definition.id;
                _DSL.source = action.definition.source;
                _DSL.database = action.definition.externalDatabaseId;
                
                if(action.definition.name != _DSL.name || action.definition.type != _DSL.type)
                {
                    _DSL.name = action.definition.name;
                    _DSL.type = action.definition.type;
                    let trovato = false;
                    for (let i = 0; !trovato && i<_DSL_LIST.length; i++)
                    {
                        if (action.definition.id == _DSL_LIST[i].dsl.id)
                        {
                            _DSL_LIST[i].dsl.name = _DSL.name;
                            _DSL_LIST[i].dsl.type = _DSL.type;
                            trovato = true;
                        }
                    }
                }
                localStorage.setItem('DSLId',_DSL.id);
                localStorage.setItem('DSLName',_DSL.name);
                localStorage.setItem('DSLType',_DSL.type);
                localStorage.setItem('DSLSource',_DSL.source);
                localStorage.setItem('DSLDatabase', _DSL.database);
            }
            DSLStore.emitChange();
            DSLStore.emitSave();
            break;
            
        case ActionTypes.DELETE_DSL_RESPONSE:
            if(action.errors)
            {
                _errors.push(action.errors);
            }
            else if(action.id)
            {
                _errors = [];
                
                let trovato = false;
                for (let i = 0; !trovato && i<_DSL_LIST.length; i++)
                {
                    if (_DSL_LIST[i].dsl.id == action.id)
                    {
                        trovato = true;
                        _DSL_LIST.splice(i,1);
                    }
                }
                localStorage.removeItem('DSLId');
                localStorage.removeItem('DSLName');
                localStorage.removeItem('DSLType');
                localStorage.removeItem('DSLSource');
                localStorage.removeItem('DSLDatabase');
            }
            DSLStore.emitChange();
            break;
            
        case ActionTypes.LOAD_USER_LIST_RESPONSE:
            if(action.userList && action.permissionList)
            {
                var USER_LIST = action.userList;
                var PERMISSION_LIST = action.permissionList;
                let i = 0, j = 0;
                // Add permission field to users
                while(j < USER_LIST.length && i < PERMISSION_LIST.length)
                {
                    if(PERMISSION_LIST[i].userId == USER_LIST[j].id)
                    {
                        USER_LIST[j].permission = PERMISSION_LIST[i].permission;
                        j++;
                    }
                    i++;
                }
                _USER_LIST = USER_LIST;
            }
            DSLStore.emitChange();
            break;
        
        case ActionTypes.CHANGE_DSL_PERMISSION_RESPONSE:
            if(action.errors)
            {
                _errors.push(action.errors);
            }
            else if(action.operation && action.userPermission)
            {    
                if (action.operation == "create")
                {
                    _USER_LIST.push(action.userPermission);
                }
                else if(action.operation == "update")
                {
                    _USER_LIST.forEach(function(permission, i) {
                        if(permission.id == action.userPermission.id)
                        {
                            permission.permission = action.userPermission.permission;
                        }
                    });
                }
                else if(action.operation == "delete")
                {
                    _USER_LIST.forEach(function(permission, i) {
                        if(permission.id == action.userPermission.id)
                        {
                            _USER_LIST.splice(i, 1);
                        }
                    });
                }
            }
            break;
            
        case ActionTypes.COMPILE_DEFINITION_RESPONSE:
            if(action.errors)
            {
                if(typeof action.errors == 'string')
                {
                    _errors.push(action.errors);
                }
                else
                {
                    messages = Object.keys(action.errors);
                    messages.forEach(function(error) {
                       _errors.push(action.errors[error]);
                    });
                }
            }
            else
            {
                _errors = [];
            }
            //DSLStore.emitChange();
            DSLStore.emitCompile();
            break;
            
        case ActionTypes.EXECUTE_DEFINITION_RESPONSE:
            if(action.errors)
            {
                _errors = [];
                _DSL_DATA = null;
                if(typeof action.errors == 'string')
                {
                    _errors.push(action.errors);
                }
                else
                {
                    messages = Object.keys(action.errors);
                    messages.forEach(function(error) {
                       _errors.push(action.errors[error]);
                    });
                }
            }
            else if(action.data)
            {
                _errors = [];
                _DSL_DATA = action.data;
            }
            //DSLStore.emitChange();
            DSLStore.emitExecute();
            break;
            
        case ActionTypes.EXECUTE_NESTED_DOCUMENT_RESPONSE:
            if(action.errors)
            {
                _errors = [];
                _DSL_NESTED_DATA = null;
                if(typeof action.errors == 'string')
                {
                    _errors.push(action.errors);
                }
                else
                {
                    messages = Object.keys(action.errors);
                    messages.forEach(function(error) {
                       _errors.push(action.errors[error]);
                    });
                }
            }
            else if(action.data)
            {
                _errors = [];
                _DSL_NESTED_DATA = action.data;
            }
            //DSLStore.emitChange();
            DSLStore.emitNestedExecute();
            break;
        
        case ActionTypes.UPLOAD_DEFINITION_RESPONSE:
            if(action.errors)
            {
                _errors.push(action.errors);
            }
            else if(action.definition)
            {
                _DSL.id = action.definition.id;
                _DSL.name = action.definition.name;
                _DSL.type = action.definition.type;
                _DSL.source = action.definition.source;
                _DSL.database = action.definition.externalDatabaseId;
                
                localStorage.setItem('DSLId',_DSL.id);
                localStorage.setItem('DSLName',_DSL.name);
                localStorage.setItem('DSLType', _DSL.type);
                localStorage.setItem('DSLSource',_DSL.source);
                localStorage.setItem('DSLDatabase', _DSL.database);
            }
            DSLStore.emitUpload();
            break;
            
        case ActionTypes.CHANGE_DEFINITION_RESPONSE:
            if(action.errors)
            {
                _errors.push(action.errors);
            }
            else if(action.definition)
            {
                _DSL.id = action.definition.id;
                _DSL.name = action.definition.name;
                _DSL.type = action.definition.type;
                _DSL.source = action.definition.source;
                _DSL.database = action.definition.externalDatabaseId;
                
                localStorage.setItem('DSLId',_DSL.id);
                localStorage.setItem('DSLName',_DSL.name);
                localStorage.setItem('DSLType', _DSL.type);
                localStorage.setItem('DSLSource',_DSL.source);
                localStorage.setItem('DSLDatabase', _DSL.database);
            }
            DSLStore.emitChangeDatabase();
            break;
        case ActionTypes.SAVE_CURRENT_DEFINITION_DATA:
            if (action.data)
            {
                current_DSL.currentDefinitionName = action.data.currentDefinitionName;
                current_DSL.currentDefinitionType = action.data.currentDefinitionType;
                current_DSL.currentDefinitionSource = action.data.currentDefinitionSource;
                current_DSL.currentDefinitionDatabase = action.data.currentDefinitionDatabase;
                
                localStorage.setItem('currentDefinitionName', current_DSL.currentDefinitionName);
                localStorage.setItem('currentDefinitionType', current_DSL.currentDefinitionType);
                localStorage.setItem('currentDefinitionSource', current_DSL.currentDefinitionSource);
                localStorage.setItem('currentDefinitionDatabase', current_DSL.currentDefinitionDatabase);
            }
            break;
        case ActionTypes.HANDLE_INCLUDE_DEFINITION:
            if (action.data)
            {
                includeSource = action.data.includeSource;
                localStorage.setItem('includeSource', includeSource);
            }
            DSLStore.emitInclude();
            break;
         case ActionTypes.LEAVE_IMPERSONATE:
            if(_DSL_LIST){
                _DSL_LIST = [];
                localStorage.removeItem('DSLList');
            }
            if(_DSL){
                _DSL.id = null;
                _DSL.name = null;
                _DSL.source = null;
                _DSL.type = null;
                _DSL.database = null;
                
                localStorage.removeItem('DSLId');
                localStorage.removeItem('DSLName');
                localStorage.removeItem('DSLType');
                localStorage.removeItem('DSLSource');
            }
            break;   
    }
    
});

module.exports = DSLStore;