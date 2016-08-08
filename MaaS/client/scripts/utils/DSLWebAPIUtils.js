/*
* Name: {DSLWebAPIUtils.js}
* Module: {Front-end}
* Location: {/MaaS/client/scripts/utils/}
* 
* History:
* Version         Date            Programmer
* ===================================================
* 0.0.1        2016/08/02   Navid Taha, Fabiano Tavallini
* ---------------------------------------------------
* First structure of the file.
* ===================================================
*/

var ResponseDSLActionCreator = require('../actions/Response/ResponseDSLActionCreator.react.jsx');
var Constants = require('../constants/Constants.js');
var request = require('superagent');

function _getErrors(json) {
  var error, message;
    if(json.message) {
        message = json.message;
        // Other cases
        if(!error) {
            error = message;
        }
    }
    return error;
}

var APIEndpoints = Constants.APIEndpoints;

module.exports = {
    saveDSLDefinition: function(userId, type, name, source) {
      request
        .post(APIEndpoints.DSL + '/saveDefinition')
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('accessToken'))
        .send({
          userId: userId,
          type: type,
          name: name,
          source: source
        })
        .end(function(err, res) {
          if(res)
          {
            res = JSON.parse(res.text);
            if(res.error)
            {
              ResponseDSLActionCreator.responseSaveDSLDefinition(null, res.error.message);
            }
            else
            {
              ResponseDSLActionCreator.responseSaveDSLDefinition(res.definition, null);
            }
          }
        });
    },
    
    overwriteDSLDefinition: function(id, type, source) {
      request
        .put(APIEndpoints.DSL + '/' + id + '/overwriteDefinition')
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('accessToken'))
        .send({
          id: id,
          type: type,
          source: source
        })
        .end(function(err, res) {
          if(res)
          {
            res = JSON.parse(res.text);
            if(res.error)
            {
              ResponseDSLActionCreator.responseOverwriteDSLDefinition(null, res.error.message);
            }
            else
            {
              ResponseDSLActionCreator.responseOverwriteDSLDefinition(res.definition, null);
            }
          }
        });
    },
    
    loadDSL: function(id) {
      request
        .get(APIEndpoints.DSL + '/' + id)
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('accessToken'))
        .end(function(error, res) {
          if(res)
          {
            ResponseDSLActionCreator.responseLoadDSL(res.body);
          }
        });
    },
    
    loadDSLList: function(userId) {
      request
        .get(APIEndpoints.DSL_ACCESSES)
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('accessToken'))
        .query({
              filter: { 
                    include:["dsl"], 
                    where: { "userId": userId }
              }
        })
        .end(function(error, res) {
          if(res)
          {
            ResponseDSLActionCreator.responseLoadDSLList(res.body);
          }
        });
    },
    
    loadDSLAccess: function(id, userId) {
      request
        .get(APIEndpoints.DSL_ACCESSES)
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('accessToken'))
        .query({
              filter: { 
                    include:["dsl"], 
                    where: { 
                            "userId": userId,
                            "dslId": id
                    }
              }
        })
        .end(function(error, res) {
          if(res)
          {
            ResponseDSLActionCreator.responseLoadDSLAccess(res.body);
          }
        });
    },
    
    deleteDSLDefinition: function(id) {
      request
        .del(APIEndpoints.DSL + '/' + id + '/deleteDefinition')
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('accessToken'))
        .end(function(error, res) {
          if (res)
          {
            res = JSON.parse(res.text);
            if(res.error) 
            {
              // res.error.message: errori di loopback e error definito dal remote method
              ResponseDSLActionCreator.responseDeleteDSLDefinition(res.error.message, null);
            } 
            else 
            {
              ResponseDSLActionCreator.responseDeleteDSLDefinition(null, id);
            }
          }
        });
    },
    
    changeDSLDefinitionPermissions: function(id, userId) {
      request
        .put(APIEndpoints.DSL + '/' + id + '/changeDefinitionPermissions')
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('accessToken'))
        .end(function(error, res) {
          if(res)
          {
            alert("Ritorno web api");
          }
        });
    },
    
    loadUserList: function(companyId) {
      request
        .get(APIEndpoints.COMPANIES + '/' + companyId + '/users')
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('accessToken'))
        .query({ 
          // {where: {and: [{title: 'My Post'}, {content: 'Hello'}]}}
          // ?filter[where][and][0][title]=My%20Post&filter[where][and][1][content]=Hello
          
          //Corretta su explorer: { "where": {"or": [{"role": "Guest"},{ "role": "Administrator"}] } }
          // https://maas-navid94.c9users.io/api/DSLAccesses?filter%5Binclude%5D=dsl&filter%5Bwhere%5D%5BuserId%5D=57a44d89dd5889111d555649
          // https://maas-navid94.c9users.io/api/Companies/579f6c08ee187d2fe6009666/users?filter=%7B%20%22where%22%3A%20%7B%22or%22%3A%20%5B%7B%22role%22%3A%20%22Guest%22%7D%2C%7B%20%22role%22%3A%20%22Administrator%22%7D%5D%20%7D%20%7D&access_token=1bjLglEfXd4bcW7oEF9eKEC8Q4NsPAQ5I4dAjwxMpiVbChEdlmweafdn9azlAbIL
     // err: https://maas-navid94.c9users.io/api/Companies/579f6c08ee187d2fe6009666/users?filter%5Bwhere%5D%5Bor%5D%5Brole%5D=Guest&filter%5Bwhere%5D%5Bor%5D%5Brole%5D=Administrator
          filter: { where: { or: [ { role: "Guest"},{ role: "Administrator"}]}}
          })
        .end(function(error, res) {
          if(res)
          {
            console.log(res.body);
          }
        });
    }
    
};