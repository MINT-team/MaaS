/*
* Name: {RequestDSLActionCreator.react.jsx}
* Module: {ActionCreators}
* Location: {/MaaS/client/scripts/actions/Request}
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
    }
};

module.exports = RequestDSLActionCreator;