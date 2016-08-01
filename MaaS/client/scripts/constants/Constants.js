// Name: {Constants.js}
// Module: {Front-end}
// Location: {/MaaS/client/scripts/constants/}

// History:
// Version         Date            Programmer
// ==========================================

var keyMirror = require('keymirror');

//var APIRoot = "https://maas-navid94.c9users.io/api";
var APIRoot = process.env.HOST_URL + process.env.API_ROOT;

module.exports = {

  APIEndpoints: {
    USERS:              APIRoot + "/users",
    COMPANIES:          APIRoot + "/Companies",
    SUPERADMINS:        APIRoot + "/SuperAdmins",
    DATABASES:          APIRoot + "/ExternalDatabases"
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
    GET_EDITOR_CONFIG_RESPONSE: null,
    GET_USER: null,
    DELETE_USER: null,
    GET_COMPANY: null,
    CHANGE_EDITOR_CONFIG_RESPONSE: null,
    CHANGE_ROLE_RESPONSE: null,

    // Company
    GET_USERS: null,
    DELETE_COMPANY: null,

    // Dashboard
    GET_DASHBOARDS: null,

    // Collection

    // Document

    // Cell
    
    // Databases
    ADD_EXT_DB_RESPONSE: null,
    CONNECT_DBS_RESPONSE: null,
    GET_DBS: null

  })

};