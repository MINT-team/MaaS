// Name: {RequestExternalDatabaseActionCreator.react.jsx}
// Module: {ActionCreators}
// Location: {/MaaS/client/scripts/actions/Request/}

// History:
// Version         Date            Programmer
// ==========================================

var Dispatcher = require("../../dispatcher/Dispatcher.js");
var WebAPIUtils = require("../../utils/ExternalDatabaseWebAPIUtils.js");
var Constants = require("../../constants/Constants.js");

var ActionTypes = Constants.ActionTypes;


var RequestExternalDatabaseActionCreator = {
    addExtDb: function(id, name, password, connString) {
        WebAPIUtils.addExtDb(id, name, password, connString);
    },
    
    connectDb: function() {
        WebAPIUtils.connectDb();
    },
    
    getDbs: function(id) {
        WebAPIUtils.getDbs(id);
    }
};

module.exports = RequestExternalDatabaseActionCreator;