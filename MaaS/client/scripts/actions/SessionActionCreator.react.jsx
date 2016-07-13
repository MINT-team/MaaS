var Dispatcher = require('../dispatcher/Dispatcher.js');
var Constants = require('../constants/Constants.js');
var WebAPIUtils = require('../utils/SessionWebAPIUtils.js');

var ActionTypes = Constants.ActionTypes;

var SessionActionCreator = {

  signup: function(company, email, password, confirmation) {
    WebAPIUtils.signup(company, email, password, confirmation);
  },

  login: function(email, password) {
    WebAPIUtils.login(email, password);
  },

  logout: function(accessToken) {
    Dispatcher.handleViewAction({
      type: ActionTypes.LOGOUT
    });
    WebAPIUtils.logout(accessToken);
  }

};

module.exports = SessionActionCreator;