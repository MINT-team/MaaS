/*
* Name: {ResponseDSLActionCreator.react.jsx}
* Module: {ActionCreators}
* Location: {/MaaS/client/scripts/actions/Response}
* 
* History:
* Version         Date            Programmer
* ===================================================
* 0.0.1        2016/08/02   Navid Taha, Fabiano Tavallini
* ---------------------------------------------------
* First structure of the file.
* ===================================================
*/

var Dispatcher = require("../../dispatcher/Dispatcher.js");
var Constants = require("../../constants/Constants.js");

var ActionTypes = Constants.ActionTypes;

var ResponseDSLActionCreator = {
    responseSaveDSLDefinition: function(definition, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.SAVE_DSL_RESPONSE,
            definition: definition,
            errors: errors
        });
    },
    
    responseOverwriteDSLDefinition: function(definition, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.OVERWRITE_DSL_RESPONSE,
            definition: definition,
            errors: errors
        });
    },
    
    responseLoadDSL: function(definition) {
        Dispatcher.handleServerAction({
            type: ActionTypes.LOAD_DSL_RESPONSE,
            definition: definition
        });
        
    },
    
    responseLoadDSLAccess: function(json) {
        Dispatcher.handleServerAction({
            type: ActionTypes.LOAD_DSL_ACCESS_RESPONSE,
            json: json
        });
    },
    
    responseLoadDSLList: function(definitionList) {
        Dispatcher.handleServerAction({
            type: ActionTypes.LOAD_DSL_LIST_RESPONSE,
            definitionList: definitionList
        });
    },
    
    responseDeleteDSLDefinition: function(errors, id) {
        Dispatcher.handleServerAction({
            type: ActionTypes.DELETE_DSL_RESPONSE,
            errors: errors,
            id: id
        });
    },
    
    responseLoadUserList: function(userList, permissionList) {
        Dispatcher.handleServerAction({
            type: ActionTypes.LOAD_USER_LIST_RESPONSE,
            userList: userList,
            permissionList: permissionList
        });
    },
    
    responseChangeDSLDefinitionPermissions: function(errors, operation, userPermission) {
        Dispatcher.handleServerAction({
            type: ActionTypes.CHANGE_DSL_PERMISSION_RESPONSE,
            errors: errors,
            operation: operation,
            userPermission: userPermission
        });
    },
    
    responseCompileDefinition: function(errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.COMPILE_DEFINITION_RESPONSE,
            errors: errors
        });
    },
    
    responseExecuteDefinition: function(errors, data) {
        Dispatcher.handleServerAction({
            type: ActionTypes.EXECUTE_DEFINITION_RESPONSE,
            errors: errors,
            data: data
        });
    },
    
    responseExecuteNestedDocument: function(errors, data) {
        Dispatcher.handleServerAction({
            type: ActionTypes.EXECUTE_NESTED_DOCUMENT_RESPONSE,
            errors: errors,
            data: data
        });
    },
    
    responseUploadDefinition: function(definition, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.UPLOAD_DEFINITION_RESPONSE,
            definition: definition,
            errors: errors
        });
    },
    
    responseChangeDefinitionDatabase: function(definition, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.CHANGE_DEFINITION_RESPONSE,
            definition: definition,
            errors: errors
        });
    },
};

module.exports = ResponseDSLActionCreator;