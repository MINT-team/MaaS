/*
* Name: {RequestCellActionCreator.react.jsx}
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
var WebAPIUtils = require("../../utils/CellWebAPIUtils.js");

var ActionTypes = Constants.ActionTypes;

var RequestCellActionCreator = {
    saveCellDefinition: function(name, source) {
        WebAPIUtils.saveCellDefinition(name, source);
    },
    overwriteCellDefinition: function(id, source) {
        WebAPIUtils.overwriteCellDefinition(id, source);
    }
    
};

module.exports = RequestCellActionCreator;