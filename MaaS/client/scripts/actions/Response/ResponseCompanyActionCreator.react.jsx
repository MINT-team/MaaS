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
    
    responseDeleteCompany: function(id, errors) {
        Dispatcher.handleServerAction({
          type: ActionTypes.DELETE_COMPANY,
          id: id,
          errors: errors
        });
    },
    
    responseGetCompanies: function(json, errors) {
        Dispatcher.handleServerAction({
          type: ActionTypes.COMPANIES,
          json: json,
          errors: errors
        });
    },
    
    responseChangeCompanyName: function(data, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.CHANGE_COMPANY_NAME_RESPONSE,
            data: data,
            errors: errors
        });
    },
    
    responseGetDatabasesCount: function(count, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.GET_DATABASES_COUNT,
            count: count,
            errors: errors
        });
    },
    
    responseGetDSLDefinitionsCount: function(data, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.GET_DSLDEFINITION_COUNT,
            data: data,
            errors: errors
        });
    }
};

module.exports = ResponseCompanyActionCreator;