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

var APIEndpoints = Constants.APIEndpoints;

module.exports = {
    saveDSLDefinition: function(userId, type, name, source, databaseId) {
      request
        .post(APIEndpoints.DSL + '/saveDefinition')
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('accessToken'))
        .send({
          userId: userId,
          type: type,
          name: name,
          source: source,
          externalDatabaseId: databaseId
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
    
    overwriteDSLDefinition: function(id, type, source, name) {
      request
        .put(APIEndpoints.DSL + '/' + id + '/overwriteDefinition')
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('accessToken'))
        .send({
          id: id,
          type: type,
          source: source,
          name: name
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
              ResponseDSLActionCreator.responseDeleteDSLDefinition(res.error.message, null);
            } 
            else 
            {
              ResponseDSLActionCreator.responseDeleteDSLDefinition(null, id);
            }
          }
        });
    },
    
    changeDSLDefinitionPermissions: function(id, userId, permission) {
      request
        .put(APIEndpoints.DSL + '/' + id + '/changeDefinitionPermissions')
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('accessToken'))
        .send({
          id: id,
          userId: userId,
          permission: permission
        })
        .end(function(error, res) {
          if(res)
          {
            res=JSON.parse(res.text);
            if(res.error) 
            {
              ResponseDSLActionCreator.responseChangeDSLDefinitionPermissions(res.error.message, null, null);
            }
            else
            {
              ResponseDSLActionCreator.responseChangeDSLDefinitionPermissions(null, res.operation, res.userPermission);
            }
          }
        });
    },
    
    loadUserList: function(id ,companyId) {
      var userFilter = {
              where: {
                or: [
                  { role: 'Member'},
                  { role: 'Guest'}
                ]
              }
            };
      userFilter = JSON.stringify(userFilter);
      request
        .get(APIEndpoints.COMPANIES + '/' + companyId + '/users')
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('accessToken'))
        .query({ filter: userFilter })
        .end(function(error, userRes) {
          if(userRes)
          {
            var DSLAccessFilter = {
              where: {
                dslId: id
              }
            };
            DSLAccessFilter = JSON.stringify(DSLAccessFilter);
            request
              .get(APIEndpoints.DSL_ACCESSES)
              .set('Accept', 'application/json')
              .set('Authorization', localStorage.getItem('accessToken'))
              .query({ filter: DSLAccessFilter })
              .end(function(error, DSLAccessRes) {
                if (DSLAccessRes)
                {
                  ResponseDSLActionCreator.responseLoadUserList(userRes.body, DSLAccessRes.body);
                }
              });
          }
        });
    },
    
    compileDefinition: function(id) {
      request
        .post(APIEndpoints.DSL + '/' + id + '/compileDefinition')
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('accessToken'))
        .end(function(error, res) {
          if(res)
          {
            res=JSON.parse(res.text);
            if(res.error) 
            {
              //if(res.error.message)   // errore nostro
                //ResponseDSLActionCreator.responseCompileDefinition(res.error.message);
              if(res.error)           // errore sweet
                ResponseDSLActionCreator.responseCompileDefinition(res.error);
            }
            else
            {
              ResponseDSLActionCreator.responseCompileDefinition(null);
            }
          }
        });
    },
    
    executeDefinition: function(id) {
      request
        .post(APIEndpoints.DSL + '/' + id + '/executeDefinition')
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('accessToken'))
        .end(function(error, res) {
          if(res)
          {
            res=JSON.parse(res.text);
            if(res.error) 
            {
              ResponseDSLActionCreator.responseExecuteDefinition(res.error, null);
            }
            else
            {
              ResponseDSLActionCreator.responseExecuteDefinition(null, res.data);
            }
          }
        });
    },
    
    executeNestedDocument: function(id, row, identity, body) {
      request
        .post(APIEndpoints.DSL + '/' + id + '/executeNestedDocument')
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('accessToken'))
        .send(
          {
            result: row,
            identity: identity,
            body: body
          }
        )
        .end(function(error, res) {
          if(res)
          {
            res=JSON.parse(res.text);
            if(res.error) 
            {
              ResponseDSLActionCreator.responseExecuteNestedDocument(res.error, null);
            }
            else
            {
              ResponseDSLActionCreator.responseExecuteNestedDocument(null, res.data);
            }
          }
        });
    },
    
    uploadDSLDefinition: function(data) {
      request
        .post(APIEndpoints.DSL + '/uploadDSLDefinition')
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('accessToken'))
        .send(
          {
            data: data
          }
        )
        .end(function(error, res) {
          if(res)
          {
            
          }
          else
          {
            
          }
      });
    }
};