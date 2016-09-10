var Dispatcher = require("../../dispatcher/Dispatcher.js");
var Constants = require("../../constants/Constants.js");
var WebAPIUtils = require("../../utils/DSLWebAPIUtils.js");

var ActionTypes = Constants.ActionTypes;

var RequestDSLActionCreator = {
    saveDSLDefinition: function(userId, type, name, source, databaseId) {
        WebAPIUtils.saveDSLDefinition(userId, type, name, source, databaseId);
    },
    
    overwriteDSLDefinition: function(id, type, source, name) {
        WebAPIUtils.overwriteDSLDefinition(id, type, source, name);
    },
    
    loadDSL: function(id) {
        WebAPIUtils.loadDSL(id);
    },
    
    loadDSLList: function(userId) {
        WebAPIUtils.loadDSLList(userId);
    },
    
    loadDSLAccess: function(id, userId) {
        WebAPIUtils.loadDSLAccess(id, userId);
    },
    
    deleteDSLDefinition: function(id) {
        WebAPIUtils.deleteDSLDefinition(id);
    },
    
    deleteAllSelectedDSLDefinitions: function(arrayId) {
        WebAPIUtils.deleteAllSelectedDSLDefinitions(arrayId);
    },
    
    changeDSLDefinitionPermissions: function(id, userId, permission) {
        WebAPIUtils.changeDSLDefinitionPermissions(id, userId, permission);
    },
    
    loadUserList: function(id, companyId) {
        WebAPIUtils.loadUserList(id, companyId);
    },
    
    compileDefinition: function(id) {
        WebAPIUtils.compileDefinition(id);
    },
    
    executeDefinition: function(id) {
        WebAPIUtils.executeDefinition(id);
    },
    
    executeNestedDocument: function(id, row, identity, body) {
        WebAPIUtils.executeNestedDocument(id, row, identity, body);
    },
    
    uploadDSLDefinition: function(userId, data) {
        WebAPIUtils.uploadDefinition(userId, data);
    },
    
    changeDefinitionDatabase: function(id, databaseId) {
        WebAPIUtils.changeDefinitionDatabase(id, databaseId);
    },
    
    saveCurrentDefinitionData: function(currentDefinitionName, currentDefinitionType, currentDefinitionSource) {
        Dispatcher.handleViewAction({
            type: ActionTypes.SAVE_CURRENT_DEFINITION_DATA,
            data: { 
                currentDefinitionName,
                currentDefinitionType,
                currentDefinitionSource
            }
        });
    },
    
    handleIncludeDefinition: function(includeSource) {
        Dispatcher.handleViewAction({
            type: ActionTypes.HANDLE_INCLUDE_DEFINITION,
            data: {
                includeSource
            }
        });
    },
    
    sendEmail: function(userId, definitonId, email, label, json, csv) {
        WebAPIUtils.sendEmail(userId, definitonId, email, label, json, csv);
    }
};

module.exports = RequestDSLActionCreator;