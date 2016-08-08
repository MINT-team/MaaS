// Name: {RequestSuperAdminActionCreator.react.jsx}
// Module: {ActionsCreators}
// Location: {/MaaS/clientscripts/actions/Request/}

// History:
// Version         Date            Programmer
// ==========================================



var Dispatcher = require("../../dispatcher/Dispatcher.js");
var WebAPIUtils = require("../../utils/SuperAdminWebAPIUtils.js");
var Constants = require("../../constants/Constants.js");

var ActionTypes = Constants.ActionTypes;

var RequestSuperAdminActionCreator = {
    
    getCompanies: function() {
        WebAPIUtils.getCompanies();
    },
    
    deleteCompany: function(id, email){
        WebAPIUtils.deleteCompany(id, email);
    }
    
};

module.exports = RequestSuperAdminActionCreator;