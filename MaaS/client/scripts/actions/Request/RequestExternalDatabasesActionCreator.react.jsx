// Name: {RequestExternalDatabaseActionCreator.react.jsx}
// Module: {ActionCreators}
// Location: {/MaaS/client/scripts/actions/Request/}

// History:
// Version         Date            Programmer
// ==========================================

var Dispatcher = require("../../dispatcher/Dispatcher.js");
var WebAPIUtils = require("../../utils/ExternalDatabasesWebAPIUtils.js");
var Constants = require("../../constants/Constants.js");

var ActionTypes = Constants.ActionTypes;


var ExternalDatabaseActionCreator = {
    setExtDb: function(companyId, name, password) {
        WebAPIUtils.setExtDb(companyId, name, password);
    },
    
    connectDb: function() {
        WebAPIUtils.connectDb();
    },
    
    getDbs: function() {
        WebAPIUtils.getDbs();
    }
};

module.exports = ExternalDatabaseActionCreator;