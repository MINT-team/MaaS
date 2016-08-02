/*
* Name: {RequestCompanyActionCreator.react.jsx}
* Module: {ActionCreators}
* Location: {/MaaS/client/scripts/actions/Request/}
* 
* History:
* Version         Date            Programmer
* ===================================================
* 0.0.1        2016/08/01   Navid Taha, Fabiano Tavallini
* ---------------------------------------------------
* First structure of the file.
* ===================================================
*/

var Dispatcher = require("../../dispatcher/Dispatcher.js");
var WebAPIUtils = require("../../utils/CompanyWebAPIUtils.js");
var Constants = require("../../constants/Constants.js");

var ActionTypes = Constants.ActionTypes;

var RequestDashboardActionCreator = {
    getDashboards: function(companyId) {
        WebAPIUtils.getDashboards(companyId);
    }
};

module.exports = RequestDashboardActionCreator;