var keyMirror = require('keymirror');

var APIRoot = "https://maas-navid94.c9users.io/api";

module.exports = {

  APIEndpoints: {
    USERS:            APIRoot + "/users",
    SIGNUP:           APIRoot + "/users/signUp",
    LOGIN:            APIRoot + "/users/login",
    LOGOUT:           APIRoot + "/users/logout",
    RESET_PASSWORD:   APIRoot + "/users/reset",
    COMPANY:          APIRoot + "/Companies"
  },

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  }),

  ActionTypes: keyMirror({
    // Session
    LOGIN_RESPONSE: null,
    SIGNUP_RESPONSE: null,
    LOGOUT: null,
    //SESSION_SET: null,

    // User
    RESET_PASSWORD_RESPONSE: null,
    CHANGE_PASSWORD_RESPONSE: null,
    CHANGE_DATA_RESPONSE: null,
    GET_USER: null,
    GET_COMPANY: null,

    // Company
    GET_USERS: null,

    // Dashboard

    // Collection

    // Document

    // Cell

  })

};