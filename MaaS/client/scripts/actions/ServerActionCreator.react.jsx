var Dispatcher = require("../dispatcher/Dispatcher.js");
//var WebAPIUtils = require("../utils/UserWebAPIUtils.js");
var Constants = require("../constants/Constants.js");

var ActionTypes = Constants.ActionTypes;

var ServerActionCreator = {

    //SESSION
    receiveSignup: function(json, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.SIGNUP_RESPONSE,
            json: json,
            errors: errors
        });
    },
    receiveLogin: function(json, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.LOGIN_RESPONSE,
            json: json,
            errors: errors
        });
    },

    //RESET PASSWORD
    receiveResetPassword: function(json, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.RESET_PASSWORD_RESPONSE,
            json: json,
            errors: errors
        });
    },

    //CHANGE PASSWORD
    receiveChangePassword: function(email, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.CHANGE_PASSWORD_RESPONSE,
            email: email,
            errors: errors
        });
    },

    //RESPONSE
    response_getUsers: function(json) {
        Dispatcher.handleServerAction({
            type: ActionTypes.GET_ALL_USERS,
            json: json
        });
    },

    receiveCreatedUser: function(json, errors) {
        Dispatcher.handleServerAction({
          type: ActionTypes.RECEIVE_CREATED_USER,
          json: json,
          errors: errors
        });
  }
};

module.exports = ServerActionCreator;