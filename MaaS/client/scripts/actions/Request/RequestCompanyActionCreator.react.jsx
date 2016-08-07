// Name: {RequestCompanyActionCreator.react.jsx}
// Module: {ActionCreators}
// Location: {/MaaS/client/scripts/actions/Request/}

// History:
// Version         Date            Programmer
// ==========================================

var Dispatcher = require("../../dispatcher/Dispatcher.js");
var WebAPIUtils = require("../../utils/CompanyWebAPIUtils.js");
var Constants = require("../../constants/Constants.js");

var ActionTypes = Constants.ActionTypes;

var RequestCompanyActionCreator = {
    getUsers: function(id) {
        WebAPIUtils.getUsers(id);
    },

    deleteCompany: function(id, email) {
       WebAPIUtils.deleteCompany(id, email);
    }
    
};

module.exports = RequestCompanyActionCreator;