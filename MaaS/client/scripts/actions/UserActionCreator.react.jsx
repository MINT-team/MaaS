var Dispatcher = require("../dispatcher/Dispatcher.js");
var WebAPIUtils = require("../utils/UserWebAPIUtils.js");
var Constants = require("../constants/Constants.js");

var ActionTypes = Constants.ActionTypes;

module.exports = {
    //REQUESTS
    request_getUser : function(email) {
        Dispatcher.handleViewAction({
            type: ActionTypes.GET_USER,
            email: email
        });
    WebAPIUtils.loadUser(email);
    },
    
    //RESPONSE
    response_getUser : function(response) {
        
    }
}