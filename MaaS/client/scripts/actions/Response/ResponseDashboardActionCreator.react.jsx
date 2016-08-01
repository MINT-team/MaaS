
/*
* Name: {ResponseDashboardActionCreator.react.jsx}
* Module: {Front-end}
* Location: {/MaaS/client/scripts/actions/Response/}
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
var Constants = require("../../constants/Constants.js");

var ActionTypes = Constants.ActionTypes;

var ResponseDashboardActionCreator = {
    responseCompanyDashboards: function(dashboards, errors) {
        Dispatcher.handleServerAction({
          type: ActionTypes.GET_DASHBOARDS,
          dashboards: dashboards,
          errors: errors
        });
    }
};

module.exports = ResponseDashboardActionCreator;