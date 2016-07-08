var Dispatcher = require("../dispatcher/Dispatcher.js");
//var WebAPIUtils = require("../utils/UserWebAPIUtils.js");
var Constants = require("../constants/Constants.js");

var ActionTypes = Constants.ActionTypes;

module.exports = {
    create: function(email) {
        Dispatcher.handleViewAction({
            type: ActionTypes.CREATE_USER,
            email: email
        });
    },
    destroy: function(id) {
        Dispatcher.handleViewAction({
            type: ActionTypes.DESTROY_USER,
            id: id
        });
  },
    //REQUESTS
    getUser : function(email) {
        /*Dispatcher.handleViewAction({
            type: ActionTypes.GET_USER,
            email: email
        });*/
    //WebAPIUtils.loadUser(email);
    },

    //RESPONSE
    response_getUser : function(response) {

    }
};