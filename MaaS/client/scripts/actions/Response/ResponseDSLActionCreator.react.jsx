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
    }
};

module.exports = ResponseDSLActionCreator;