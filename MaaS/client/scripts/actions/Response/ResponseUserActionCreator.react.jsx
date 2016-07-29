// Name: {ResponseUserActionCreator.react.jsx}
// Module: {ActionCreators}
// Location: {/MaaS/client/scripts/actions/Response/}

// History:
// Version         Date            Programmer
// ==========================================

var Dispatcher = require("../../dispatcher/Dispatcher.js");
var Constants = require("../../constants/Constants.js");

var ActionTypes = Constants.ActionTypes;

var ResponseUserActionCreator = {

    responseResetPassword: function(json, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.RESET_PASSWORD_RESPONSE,
            json: json,
            errors: errors
        });
    },
    responseChangePassword: function(email, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.CHANGE_PASSWORD_RESPONSE,
            email: email,
            errors: errors
        });
    },
    responseChangePersonalData: function(json, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.CHANGE_DATA_RESPONSE,
            json: json,
            errors: errors
        });
    },
    responseGetEditorConfig: function(json) {
        Dispatcher.handleServerAction({
            type: ActionTypes.EDITOR_CONFIG_RESPONSE,
            json: json
        });
    },
    responseGetUser: function(json, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.GET_USER,
            json: json,
            errors: errors
        });
    },
    responseDeleteUser: function(errors, email){
        Dispatcher.handleServerAction({
            type: ActionTypes.DELETE_USER,
            errors: errors,
            email: email
        });
    },
    responseGetCompany: function(json, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.GET_COMPANY,
            json: json,
            errors: errors
        });
    },
    responseChangeEditorConfig: function(json, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.CHANGE_EDITOR_CONFIG_RESPONSE,
            json: json,
            errors: errors
        });
    }
};

module.exports = ResponseUserActionCreator;