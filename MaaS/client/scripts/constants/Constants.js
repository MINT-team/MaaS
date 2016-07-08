var keyMirror = require('keymirror');

var APIRoot = "https://maas-navid94.c9users.io/api";

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

    GET_USER: null,
    CREATE_USER: null,
    DESTROY_USER: null
  })

};