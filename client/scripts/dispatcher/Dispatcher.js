/*
* Name: {Dispatcher.js}
* Module: {Front-end}
* Location: {/MaaS/client/scripts/dispatcher/}
* 
* History:
* Version         Date            Programmer
* ===================================================
* 1.0.0        2016/07/11         Navid Taha
* ---------------------------------------------------
* Approved stability.
* ===================================================
* 0.1.0        2016/07/09      Fabiano Tavallini
* ---------------------------------------------------
* Verify and definition of handleViewAction and
* handleServerAction.
* ===================================================
* 0.0.2        2016/07/08         Thomas Fuser
* ---------------------------------------------------
* Definition of a payload to dispatch.
* ===================================================
* 0.0.1        2016/07/04      Fabiano Tavallini
* ---------------------------------------------------
* First structure of the file.
* ===================================================
*/

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