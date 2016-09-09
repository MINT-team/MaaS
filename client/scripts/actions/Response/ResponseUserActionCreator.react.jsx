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
            type: ActionTypes.GET_EDITOR_CONFIG_RESPONSE,
            json: json
        });
    },
    
    responseGetUser: function(json) {
        Dispatcher.handleServerAction({
            type: ActionTypes.GET_USER,
            json: json
        });
    },
    
    responseDeleteUser: function(errors, email){
        Dispatcher.handleServerAction({
            type: ActionTypes.DELETE_USER,
            errors: errors,
            email: email
        });
    },
    
    responseDeleteAllSelectedUsers: function(errors, arrayId) {
        Dispatcher.handleServerAction({
            type: ActionTypes.DELETE_ALL_SELECTED_USERS_RESPONSE,
            errors: errors,
            arrayId: arrayId
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
    },
    
    responseChangeRole: function(email, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.CHANGE_ROLE_RESPONSE,
            email: email,
            errors: errors
        });
    },
    
    responseGetUsers: function(json) {
        Dispatcher.handleServerAction({
            type: ActionTypes.GET_ALL_USERS,
            json: json
        });
    },
    
    responseChangeUserEmail: function(json, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.CHANGE_USER_EMAIL,
            json: json,
            errors: errors
        });
    },
    
    responseChangeActiveDashboard: function(dashboard, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.CHANGE_ACTIVE_DASHBOARD,
            dashboard: dashboard,
            errors: errors
        });
    }
};

module.exports = ResponseUserActionCreator;