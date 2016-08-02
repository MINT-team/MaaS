/*
* Name: {CollectionStore.react.jsx}
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

var _collections = [];
var _collection = {
                    id: localStorage.getItem('collectionId'),
                    name: localStorage.getItem('collectionName')
};
var _errors = [];


var CollectionStore = assign({}, EventEmitter.prototype, {

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
    }
    
});

CollectionStore.dispatchToken = Dispatcher.register(function(payload) {
    var action = payload.action;
    
    switch(action.type) {
        case ActionTypes.GET_DASHBOARDS:
            if(action.errors) {
                _errors = action.errors;
            } else if(action.json) {
                _errors = []; // empty old errors
                // set dashboards data
                _collections = action.dashboards;
            }
            CollectionStore.emitChange();
            break;
    }
});

module.exports = CollectionStore;