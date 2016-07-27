// Name: {ResponseExternalDatabaseActionCreator.react.jsx}
// Module: {ActionCreators}
// Location: {/MaaS/client/scripts/actions/Response/}

// History:
// Version         Date            Programmer
// ==========================================

var Dispatcher = require("../../dispatcher/Dispatcher.js");
var Constants = require("../../constants/Constants.js");

var ActionTypes = Constants.ActionTypes;

var ResponseExternalDatabaseActionCreator = {
    responseAddExtDb: function(json, errors){
        Dispatcher.handleServerAction({
            type: ActionTypes.ADD_EXT_DB_RESPONSE,
            json: json,
            errors: errors
        });
    },
    
    responseConnectDbs: function(errors){
         Dispatcher.handleServerAction({
            type: ActionTypes.CONNECT_DBS_RESPONSE,
            errors: errors
        });
    }

};

module.exports = ResponseExternalDatabaseActionCreator;