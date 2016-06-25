var keyMirror = require('keymirror');

var APIRoot = "http://localhost:3000";

module.exports = {

  APIEndpoints: {
    LOGIN:          APIRoot + "/Login",
    REGISTRATION:   APIRoot + "/Users",
    USERS:        APIRoot + "/Users"
  },

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  }),

  ActionTypes: keyMirror({
    // Session
    LOGIN_REQUEST: null,
    LOGIN_RESPONSE: null,

    // Routes
    REDIRECT: null,

    GET_USER: null
  })

};