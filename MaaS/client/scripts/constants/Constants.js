var keyMirror = require('keymirror');

var APIRoot = "https://maas-navid94.c9users.io/api";

module.exports = {

  APIEndpoints: {
    USERS:            APIRoot + "/users",
    LOGIN:            APIRoot + "/users/login",
    LOGOUT:           APIRoot + "/users/logout",
    RESET_PASSWORD:   APIRoot + "/users/reset"
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
    RESET_PASSWORD_RESPONSE: null,
    CHANGE_PASSWORD_RESPONSE: null,

    // User
    RESET_PASSWORD: null,

    GET_USER: null,
    RECEIVE_REQUESTED_USER: null,
    GET_ALL_USERS: null

    // Dashboard

    // Collection

    // Document

    // Cell

  })

};