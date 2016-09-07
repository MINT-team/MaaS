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
    CREATE_ACCESS_TOKEN: null,
    LEAVE_IMPERSONATE: null,
    //SESSION_SET: null,

    // User
    RESET_PASSWORD_RESPONSE: null,
    CHANGE_PASSWORD_RESPONSE: null,
    CHANGE_DATA_RESPONSE: null,
    GET_EDITOR_CONFIG_RESPONSE: null,
    GET_USER: null,
    DELETE_USER: null,
    DELETE_ALL_SELECTED_USERS_RESPONSE: null,
    GET_COMPANY: null,
    CHANGE_EDITOR_CONFIG_RESPONSE: null,
    CHANGE_ROLE_RESPONSE: null,
    GET_ALL_USERS: null,
    CHANGE_USER_EMAIL: null,  
    CHANGE_ACTIVE_DASHBOARD: null,
    
    // Company
    GET_USERS: null,
    DELETE_COMPANY: null,
    DELETE_ALL_SELECTED_COMPANIES_RESPONSE: null,
    GET_COMPANIES: null,
    CHANGE_COMPANY_NAME_RESPONSE: null,
    GET_DATABASES_COUNT: null,
    GET_DSLDEFINITION_COUNT: null,
    
    // Super Admin

    // DSL
    SAVE_DSL_RESPONSE: null,
    OVERWRITE_DSL_RESPONSE: null,
    LOAD_DSL_RESPONSE: null,
    LOAD_DSL_LIST_RESPONSE: null,
    LOAD_DSL_ACCESS_RESPONSE: null,
    LOAD_USER_LIST_RESPONSE: null,
    DELETE_DSL_RESPONSE: null,
    DELETE_ALL_SELECTED_DSL_RESPONSE: null,
    CHANGE_DSL_PERMISSION_RESPONSE: null,
    COMPILE_DEFINITION_RESPONSE: null,
    EXECUTE_DEFINITION_RESPONSE: null,
    EXECUTE_NESTED_DOCUMENT_RESPONSE: null,
    UPLOAD_DEFINITION_RESPONSE: null,
    CHANGE_DEFINITION_RESPONSE: null,
    HANDLE_INCLUDE_DEFINITION: null,
    SAVE_CURRENT_DEFINITION_DATA: null,
    
    // Databases
    ADD_EXT_DB_RESPONSE: null,
    CONNECT_DBS_RESPONSE: null,
    GET_DBS: null,
    DELETE_DB_RESPONSE: null,
    DELETE_ALL_SELECTED_DATABASES_RESPONSE: null,
    CHANGE_STATE_DB: null

  })

};