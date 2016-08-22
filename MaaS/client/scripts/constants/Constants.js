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
    EXTERNAL_DATABASES: APIRoot + "/ExternalDatabases",
    DASHBOARDS:         APIRoot + "/Dashboards",
    COLLECTIONS:        APIRoot + "/Collections",
    DOCUMENTS:          APIRoot + "/Documents",
    DSL:                APIRoot + "/DSL",
    DSL_ACCESSES:       APIRoot + "/DSLAccesses"
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
    GET_ALL_USERS: null,
    CHANGE_USER_EMAIL: null,  
    // Company
    GET_USERS: null,
    DELETE_COMPANY: null,
    GET_COMPANIES: null,
    CHANGE_COMPANY_NAME_RESPONSE: null,
    GET_DATABASES_COUNT: null,
    GET_DSLDEFINITION_COUNT: null,
    
    // Super Admin
    
    // Dashboard

    // Collection

    // Document

    // DSL
    SAVE_DSL_RESPONSE: null,
    OVERWRITE_DSL_RESPONSE: null,
    LOAD_DSL_RESPONSE: null,
    LOAD_DSL_LIST_RESPONSE: null,
    LOAD_DSL_ACCESS_RESPONSE: null,
    LOAD_USER_LIST_RESPONSE: null,
    DELETE_DSL_RESPONSE: null,
    CHANGE_DSL_PERMISSION_RESPONSE: null,
    COMPILE_DEFINITION_RESPONSE: null,
    EXECUTE_DEFINITION_RESPONSE: null,
    
    // Databases
    ADD_EXT_DB_RESPONSE: null,
    CONNECT_DBS_RESPONSE: null,
    GET_DBS: null,
    DELETE_DB: null,
    CHANGE_STATE_DB: null

  })

};