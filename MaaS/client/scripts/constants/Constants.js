// Name: {Constants.js}
// Module: {Front-end}
// Location: {/MaaS/client/scripts/constants/}

// History:
// Version         Date            Programmer
// ==========================================

var keyMirror = require('keymirror');

var APIRoot = "https://maas-navid94.c9users.io/api";

module.exports = {

  APIEndpoints: {
    USERS:              APIRoot + "/users",
    COMPANIES:          APIRoot + "/Companies",
    SUPERADMINS:        APIRoot + "/SuperAdmins"
  },

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  }),

  ActionTypes: keyMirror({
    // Session
    LOGIN_RESPONSE: null,
    SIGNUP_RESPONSE: null,
    INVITE_RESPONSE: null,
    LOGOUT: null,
    //SESSION_SET: null,

    // User
    RESET_PASSWORD_RESPONSE: null,
    CHANGE_PASSWORD_RESPONSE: null,
    CHANGE_DATA_RESPONSE: null,
    EDITOR_CONFIG_RESPONSE: null,
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