// Name: {ResponseCompanyActionCreator.react.jsx}
// Module: {ActionCreators}
// Location: {/MaaS/client/scripts/actions/Response/}

// History:
// Version         Date            Programmer
// ==========================================

var Dispatcher = require("../../dispatcher/Dispatcher.js");
var Constants = require("../../constants/Constants.js");

var ActionTypes = Constants.ActionTypes;

var ResponseCompanyActionCreator = {
    responseCompanyUsers: function(json, errors) {
        Dispatcher.handleServerAction({
          type: ActionTypes.GET_USERS,
          json: json,
          errors: errors
        });
    },
    
    responseDeleteCompany: function(json, errors) {
        Dispatcher.handleServerAction({
          type: ActionTypes.DELETE_COMPANY,
          json: json,
          errors: errors
        });
    }
};

module.exports = ResponseCompanyActionCreator;