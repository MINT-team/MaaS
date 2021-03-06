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
    
    responseDeleteAllSelectedCompanies: function(errors, arrayId) {
        Dispatcher.handleServerAction({
            type: ActionTypes.DELETE_ALL_SELECTED_COMPANIES_RESPONSE,
            errors: errors,
            arrayId: arrayId
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
    
    responseGetDSLDefinitionsCount: function(count, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.GET_DSLDEFINITION_COUNT,
            count: count,
            errors: errors
        });
    }
};

module.exports = ResponseCompanyActionCreator;