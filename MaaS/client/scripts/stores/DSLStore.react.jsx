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
var USERS_EVENT = 'users';

 
var _DSL_LIST = JSON.parse(localStorage.getItem('DSLList'));    // DSL LIST WITH PERMISSION for current user

var _DSL = {
    id: localStorage.getItem('DSLId'),
    name: localStorage.getItem('DSLName'),
    source: localStorage.getItem('DSLSource'),
    type: localStorage.getItem('DSLType')
};

var _USER_LIST = [];    //JSON.parse(localStorage.getItem('userList'));    // Member and Guest list

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
    /*
    emitUsers: function() {
        this.emit(USERS_EVENT);
    },
    
    addUsersListener: function(callback) {
        this.on(USERS_EVENT, callback);
    },
    
    removeUsersListener: function(callback) {
        this.removeListener(USERS_EVENT, callback);
    },
    */
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
    
    getDSLList: function() {
        return _DSL_LIST;
    },
    
    getUserList: function() {
        return _USER_LIST;
    }
});

DSLStore.dispatchToken = Dispatcher.register(function(payload) {
    var action = payload.action;
    var user_list_loaded = false;
    var permissions_list_loaded = false;
    
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
                
                localStorage.setItem('DSLId', _DSL.id);
                localStorage.setItem('DSLName', _DSL.name);
                localStorage.setItem('DSLType', _DSL.type);
                localStorage.setItem('DSLSource', _DSL.source);
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
                
                _DSL_LIST.push(action.json[0]);
                
                localStorage.setItem('DSLId', _DSL.id);
                localStorage.setItem('DSLName', _DSL.name);
                localStorage.setItem('DSLType', _DSL.type);
                localStorage.setItem('DSLSource', _DSL.source);
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
            _errors = [];
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
                
                localStorage.setItem('DSLId',_DSL.id);
                localStorage.setItem('DSLName',_DSL.name);
                localStorage.setItem('DSLType', _DSL.type);
                localStorage.setItem('DSLSource',_DSL.source);
            }
            DSLStore.emitChange();
            break;
        
        case ActionTypes.OVERWRITE_DSL_RESPONSE:
            _errors = [];
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
                
                localStorage.setItem('DSLId',_DSL.id);
                localStorage.setItem('DSLName',_DSL.name);
                localStorage.setItem('DSLType',_DSL.type);
                localStorage.setItem('DSLSource',_DSL.source);
            }
            DSLStore.emitChange();
            break;
            
        case ActionTypes.DELETE_DSL_RESPONSE:
            if(action.errors)
            {
                _errors.push(action.errors);
            }
            else if(action.id)
            {
                _errors = [];
                var index;
                _DSL_LIST.forEach(function(DSL, i) 
                {
                    if(DSL.dsl.id == action.id) 
                    {
                        index = i;
                    }
                });
                _DSL_LIST.splice(index, 1);
                localStorage.removeItem('DSLId');
                localStorage.removeItem('DSLName');
                localStorage.removeItem('DSLType');
                localStorage.removeItem('DSLSource');
            }
            DSLStore.emitChange();
            break;
            
        case ActionTypes.LOAD_USER_LIST_RESPONSE:
            if(action.userList && action.permissionList)
            {
                var USER_LIST = action.userList;
                var PERMISSION_LIST = action.permissionList;
                var i = 0, j = 0;
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
                //localStorage.setItem('userList', JSON.stringify(action.userList));
            }
            DSLStore.emitChange();
            break;
        /*    
        case ActionTypes.LOAD_USER_LIST_RESPONSE:
            if(action.userList)
            {
                _USER_LIST = action.userList;
                //localStorage.setItem('userList', JSON.stringify(action.userList));
            }
            break;
            
        case ActionTypes.LOAD_USERS_PERMISSIONS_LIST_RESPONSE:
            if(action.usersPermissions)
            {
                _USERS_PERMISSIONS = action.usersPermissions;
                //localStorage.setItem('usersPermissions', JSON.stringify(action.usersPermissions));
            }
            //DSLStore.emitChange();
            break;
        */    
        case ActionTypes.CHANGE_DSL_PERMISSION_RESPONSE:
            if(action.errors)
            {
                _errors.push(action.errors);
            }
            else if(action.operation && action.DSLAccess)
            {    
                if (action.operation == "create")
                {
                    /*
                    var newPermission = {
                        id: action.DSLAccess.id,
                        userId: action.DSLAccess.userId,
                        permission: action.DSLAccess.permission
                    };
                    */
                    _USERS_PERMISSIONS.push(action.DSLAccess);
                }
                else if(action.operation == "update")
                {
                    _USERS_PERMISSIONS.forEach(function(permission, i) {
                        if(permission.id == action.DSLAccess.id)
                        {
                            permission.permission = action.DSLAccess.permission;
                        }
                    });
                }
                else if(action.operation == "delete")
                {
                    _USERS_PERMISSIONS.forEach(function(permission, i) {
                        if(permission.id == action.DSLAccess.id)
                        {
                            _USERS_PERMISSIONS.splice(i, 1);
                        }
                    });
                }
                //localStorage.setItem('usersPermissions', JSON.stringify(_USERS_PERMISSIONS));
            }
            //DSLStore.emitChange();
            break;
            /*
        
        case ActionTypes.LOAD_USERS_PERMISSIONS_LIST_RESPONSE:
            if(action.usersPermissions)
            {
                _USERS_PERMISSIONS = action.usersPermissions;
                permissions_list_loaded = true;
                //localStorage.setItem('usersPermissions', JSON.stringify(action.usersPermissions));
            }
            //if(user_list_loaded)
                DSLStore.emitUsers();
            //alert("load permission");
            //DSLStore.emitChange();
            break;
            
        case ActionTypes.CHANGE_DSL_PERMISSION_RESPONSE:
            if(action.errors)
            {
                _errors.push(action.errors);
            }
            else if(action.operation && action.DSLAccess)
            {    
                if (action.operation == "create")
                {
                    var newPermission = {
                        id: action.DSLAccess.id,
                        userId: action.DSLAccess.userId,
                        permission: action.DSLAccess.permission
                    };
                    _USERS_PERMISSIONS.push(newPermission);
                }
                else if(action.operation == "update")
                {
                    _USERS_PERMISSIONS.forEach(function(permission, i) {
                        if(permission.id == action.DSLAccess.id)
                        {
                            permission.permission = action.DSLAccess.permission;
                        }
                    });
                }
                else if(action.operation == "delete")
                {
                    _USERS_PERMISSIONS.forEach(function(permission, i) {
                        if(permission.id == action.DSLAccess.id)
                        {
                            _USERS_PERMISSIONS.splice(i, 1);
                        }
                    });
                }
                //localStorage.setItem('usersPermissions', JSON.stringify(_USERS_PERMISSIONS));
            }
            //DSLStore.emitChange();
            break;
            */
        case ActionTypes.FLUSH_USER_LIST:
            _USER_LIST = [];
            //_USERS_PERMISSIONS = [];
            //localStorage.removeItem('userList');
            //localStorage.removeItem('usersPermissions');
            //DSLStore.emitChange();
            break;
    }
    
});

module.exports = DSLStore;