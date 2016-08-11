// Name: {ResponseSuperAdminCreator.react.jsx}
// Module: {ActionCreators}
// Location: {/MaaS/client/scripts/actions/Response/}

// History:
// Version         Date            Programmer
// ==========================================

var Dispatcher = require("../../dispatcher/Dispatcher.js");
var Constants = require("../../constants/Constants.js");

var ActionTypes = Constants.ActionTypes;

var ResponseSuperAdminActionCreator = {
    
    responseCompanyCompanies: function(json, errors) {
        Dispatcher.handleServerAction({
          type: ActionTypes.COMPANIES,
          json: json,
          errors: errors
        });
    },
    
    responseDeleteCompany: function(name, errors) {
        window.alert("ho eliminato la company");
        Dispatcher.handleServerAction({
          type: ActionTypes.DELETE_COMPANY,
          name: name,
          errors: errors
        });
    },
    
    responseChangeCompanyName: function(email, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.CHANGE_COMPANY_NAME_RESPONSE,
            email: email,
            errors: errors
        });
    },
    
};

module.exports = ResponseSuperAdminActionCreator;