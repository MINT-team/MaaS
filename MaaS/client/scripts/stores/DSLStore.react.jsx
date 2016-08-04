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
var DELETE_EVENT = 'delete';

var _DSL_LIST = JSON.parse(localStorage.getItem('DSLList'));
var _DSL = {
    id: localStorage.getItem('DSLId'),
    name: localStorage.getItem('DSLName'),
    source: localStorage.getItem('DSLSource')
};
var _errors = [];

var DSLStore = assign({}, EventEmitter.prototype, {
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
    
    getErrors: function() {
        return _errors;
    },
    
    getId: function() {
        return _DSL.id;
    },
    
    getName: function() {
        return _DSL.name;
    },
    
    getSource: function() {
        return _DSL.source;
    },
    
    getDSLList: function() {
        return _DSL_LIST;
    }
});

DSLStore.dispatchToken = Dispatcher.register(function(payload) {
    var action = payload.action;
    
    switch (action.type) {
        case ActionTypes.LOAD_DSL_RESPONSE:
            if (action.errors)
            {
                _errors = action.errors;
            }
            else if(action.json.definition)
            {
                _errors = [];
                _DSL.id = action.definition.id;
                _DSL.name = action.definition.name;
                _DSL.source = action.definition.source;
                
                localStorage.setItem('DSLId',_DSL.id);
                localStorage.setItem('DSLName',_DSL.name);
                localStorage.setItem('DSLSource',_DSL.source);
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
            break;
        
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
                _DSL.source = action.definition.source;
                
                var newDSL = {
                    id: _DSL.id,
                    name: _DSL.name,
                    source: _DSL.source
                };
                _DSL_LIST.push(newDSL);
                localStorage.setItem('DSLId',_DSL.id);
                localStorage.setItem('DSLName',_DSL.name);
                localStorage.setItem('DSLSource',_DSL.source);
            }
            DSLStore.emitChange();
            break;
    }
    
});

module.exports = DSLStore;