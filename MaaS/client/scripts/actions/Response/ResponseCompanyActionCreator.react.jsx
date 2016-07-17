var Dispatcher = require("../../dispatcher/Dispatcher.js");
var Constants = require("../../constants/Constants.js");

var ActionTypes = Constants.ActionTypes;

var ResponseCompanyActionCreator = {
    responseCompanyUsers: function(json, errors) {
        Dispatcher.handleServerAction({
          type: ActionTypes.GET_USERS,
          json: json,
          errors: errors
        });
    }
};

module.exports = ResponseCompanyActionCreator;