// Name: {RequestExternalDatabaseActionCreator.react.jsx}
// Module: {ActionCreators}
// Location: {/MaaS/client/scripts/actions/Request/}

// History:
// Version         Date            Programmer
// ==========================================

var Dispatcher = require("../../dispatcher/Dispatcher.js");
var WebAPIUtils = require("../../utils/ExternalDatabaseWebAPIUtils.js");
var Constants = require("../../constants/Constants.js");

var ActionTypes = Constants.ActionTypes;


var RequestExternalDatabaseActionCreator = {
    addExtDb: function(companyId, name, connString) {
        WebAPIUtils.addExtDb(companyId, name, connString);
    },
    
    getDbs: function(id) {
        WebAPIUtils.getDbs(id);
    },
    
    deleteDb: function(id, companyId) {
        Dispatcher.handleViewAction({
            type: ActionTypes.DELETE_DB,
            id: id
        });
        WebAPIUtils.deleteDb(id, companyId);
    },
    
    changeStateDb: function(id, status, companyId) {
        WebAPIUtils.changeStateDb(id, status, companyId);
    }
};

module.exports = RequestExternalDatabaseActionCreator;