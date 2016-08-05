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
    saveDSLDefinition: function(userId, type, name, source) {
        WebAPIUtils.saveDSLDefinition(userId, type, name, source);
    },
    overwriteDSLDefinition: function(id, type, source) {
        WebAPIUtils.overwriteDSLDefinition(id, type, source);
    },
    loadDSL: function(id) {
        WebAPIUtils.loadDSL(id);
    },
    loadDSLList: function(userId) {
        WebAPIUtils.loadDSLList(userId);
    },
    deleteDSLDefinition: function(id) {
        WebAPIUtils.deleteDSLDefinition(id);
    }
    
};

module.exports = RequestDSLActionCreator;