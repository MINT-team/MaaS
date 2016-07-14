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

    //CHANGE PERSONAL DATA
    receiveChangePersonalData: function(json, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.CHANGE_DATA_RESPONSE,
            json: json,
            errors: errors
        });
    },

    //RESPONSE
    response_getUser: function(json, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.GET_USER,
            json: json,
            errors: errors
        });
    },

    response_getCompany: function(json, errors) {
        Dispatcher.handleServerAction({
          type: ActionTypes.GET_COMPANY,
          json: json,
          errors: errors
        });
  }
};

module.exports = ServerActionCreator;