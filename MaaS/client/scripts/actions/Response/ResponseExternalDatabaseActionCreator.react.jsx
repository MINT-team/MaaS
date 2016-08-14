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
    responseAddExtDb: function(database, errors){
        Dispatcher.handleServerAction({
            type: ActionTypes.ADD_EXT_DB_RESPONSE,
            database: database,
            errors: errors
        });
    },
    
    responseGetDbs:function(json, errors){
        Dispatcher.handleServerAction({
          type: ActionTypes.GET_DBS,
          json: json,
          errors: errors
        });
    },
    
    responseChangeStateDb: function(json, errors){
        Dispatcher.handleServerAction({
          type: ActionTypes.CHANGE_STATE_DB,
          json: json,
          errors: errors
        });  
    }

};

module.exports = ResponseExternalDatabaseActionCreator;