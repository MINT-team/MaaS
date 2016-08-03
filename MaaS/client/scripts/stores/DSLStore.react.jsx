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

var _DSLs = [];
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
});

DSLStore.dispatchToken = Dispatcher.register(function(payload) {
    var action = payload.action;
    
    switch (action.type) {
        /*
        case ActionTypes.GET_DSLS:
            if(action.errors)
            {
                _errors = action.json.errors
            }
            else if(action.json.DSLs)
            {
                _errors = [];
                _DSLs = action.DSLs;
            }
            DSLStore.emitChange();
            break;
        */  
        case ActionTypes.SAVE_DSL_RESPONSE:
            if(action.errors)
            {
                _errors = action.json.errors
            }
            else if(action.definition)
            {
                _errors = [];
                _DSL.name = action.definition.name;
                _DSL.source = action.definition.source;
                alert('aa');
                
            }
            DSLStore.emitChange();
            break;
    }
    
});

module.exports = DSLStore;