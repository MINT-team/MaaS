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
    
    responseDeleteCompany: function(name, errors) {
        Dispatcher.handleServerAction({
          type: ActionTypes.DELETE_COMPANY,
          name: name,
          errors: errors
        });
    },
    
    responseCompanyCompanies: function(json, errors) {
        Dispatcher.handleServerAction({
          type: ActionTypes.COMPANIES,
          json: json,
          errors: errors
        });
    }
    
};

module.exports = ResponseCompanyActionCreator;