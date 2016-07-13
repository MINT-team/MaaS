var Dispatcher = require('../dispatcher/Dispatcher.js');
var Constants = require('../constants/Constants.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var SessionStore = require('./SessionStore.react.jsx');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _company = {
                id: sessionStorage.getItem('companyId'),
                name: sessionStorage.getItem('companyName'),
            };
var _users = [];    // users of the company
var _errors = [];

var CompanyStore = assign({}, EventEmitter.prototype, {

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
        return _company.id;
    },

    getName: function() {
        return _company.name
    },

    getUsers: function() {
        return _users;
    },

    getErrors: function() {
        return _errors;
    }

});

CompanyStore.dispatchToken = Dispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.type) {

      case ActionTypes.GET_COMPANY:
        if(action.errors) {
            _errors = action.errors;
        } else if(action.json) {
            _errors = []; // empty old errors
            // set company data
            _company.id = action.json.id;
            _company.name = action.json.name;
            sessionStorage.setItem('companyId', _company.id);
            sessionStorage.setItem('companyName', _company.name);
        }
        CompanyStore.emitChange();
        break;

    }

    return true;  // richiesto dal Promise nel Dispatcher
});

module.exports = CompanyStore;