var Dispatcher = require('../dispatcher/Dispatcher.js');
var Constants = require('../constants/Constants.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var SessionStore = require('./SessionStore.react.jsx');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _suerAdmin = {
    id: SessionStore.getSuperAdminId,
    email: SessionStore.getSuperAdminEmail()
}
var _errors = [];

var SuperAdminStore = assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

});
                //da agiungere man mano che vengono create le azioni
//     SuperAdminStore.dispatchToken = Dispatcher.register(function(payload) {
//         var action = payload.action;

//         switch(action.type) {

//         }

//         return true;  // richiesto dal Promise nel Dispatcher
// });

module.exports = SuperAdminStore;