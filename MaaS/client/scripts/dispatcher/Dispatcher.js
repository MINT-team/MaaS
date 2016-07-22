// Name: {Dispatcher.js}
// Module: {Front-end}
// Location: {/MaaS/client/scripts/dispatcher/}

// History:
// Version         Date            Programmer
// ==========================================

var Constants = require('../constants/Constants.js');
var FluxDispatcher = require('flux').Dispatcher;
var assign = require('object-assign');

var PayloadSources = Constants.PayloadSources;

var Dispatcher = assign(new FluxDispatcher(), {

  handleServerAction: function(action) {
    var payload = {
      source: PayloadSources.SERVER_ACTION,
      action: action
    };
    this.dispatch(payload);
  },

  handleViewAction: function(action) {
    var payload = {
      source: PayloadSources.VIEW_ACTION,
      action: action
    };
    this.dispatch(payload);
  }
});

module.exports = Dispatcher;