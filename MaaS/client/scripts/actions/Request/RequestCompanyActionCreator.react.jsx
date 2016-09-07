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
    },
    
    deleteAllSelectedCompanies: function(arrayId) {
        WebAPIUtils.deleteAllSelectedCompanies(arrayId);
    },
    
    getCompanies: function() {
        WebAPIUtils.getCompanies();
    },
    
    changeCompanyName: function(companyId, name) {
        WebAPIUtils.changeCompanyName(companyId, name);
    },
    
    getDatabasesCount: function(companyId) {
        WebAPIUtils.getDatabasesCount(companyId);
    },
    
    getDSLDefinitionsCount: function(companyId) {
        WebAPIUtils.getDSLDefinitionsCount(companyId);
    }
};

module.exports = RequestCompanyActionCreator;