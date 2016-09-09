var ResponseExternalDatabaseActionCreator = require('../actions/Response/ResponseExternalDatabaseActionCreator.react.jsx');
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

  addExtDb: function(companyId, name, connString) {
      request
        .post(APIEndpoints.EXTERNAL_DATABASES + '/addExtDb')
        .set('Authorization', localStorage.getItem('accessToken'))
        .set('Accept', 'application/json')
        .send({
          companyId: companyId,
          name: name,
          connString: connString
        })
        .end(function(err, res){
          if(res)
          {
              res = JSON.parse(res.text);
              if(res.error)
              {
                  ResponseExternalDatabaseActionCreator.responseAddExtDb(null, res.error.message);
              }
              else
              {
                  ResponseExternalDatabaseActionCreator.responseAddExtDb(res.database, null);
              }
          }
        });
    },
  
  getDbs: function(id) {
    request
      .get(APIEndpoints.COMPANIES + '/' + id + '/externalDatabases')
      .set('Authorization', localStorage.getItem('accessToken'))
      .set('Accept', 'application/json')
      .end(function(err, res){
        if(res) {
            if(res.error) {
                var errors = _getErrors(res.body.error);
                ResponseExternalDatabaseActionCreator.responseGetDbs(null, errors);
            }
            else
                ResponseExternalDatabaseActionCreator.responseGetDbs(res.body, null);
        }
      });
  },
  
  deleteDb: function(id, companyId) {
    request
      .del(APIEndpoints.COMPANIES + '/' + companyId + '/externalDatabases/' + id)
      .set('Authorization', localStorage.getItem('accessToken'))
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if(res)
        {
          if(res.errors)
          {
            res = JSON.parse(res.text);
            ResponseExternalDatabaseActionCreator.responseDeleteDb(res.error.message, null);
          }
          else
          {
            ResponseExternalDatabaseActionCreator.responseDeleteDb(null, id);
          }
        }
      });
  },
  
  deleteAllSelectedDatabases: function(companyId, arrayId) {
    request
      .del(APIEndpoints.EXTERNAL_DATABASES + '/deleteAllSelectedDatabases')
      .set('Accept', 'application/json')
      .set('Authorization', localStorage.getItem('accessToken'))
      .send(
        {
          companyId: companyId,
          arrayId: arrayId
        }
      )
      .end(function(error, res) {
        res = JSON.parse(res.text);
        if (res.error)
        {
          ResponseExternalDatabaseActionCreator.responseDeleteAllSelectedDatabases(res.error, null);
        }
        else
        {
          ResponseExternalDatabaseActionCreator.responseDeleteAllSelectedDatabases(null, arrayId);
        }
      });
  },
  
  changeStateDb: function(id, status, companyId) {
    request
      .put(APIEndpoints.COMPANIES + '/' + companyId + '/externalDatabases/' + id)
      .set('Authorization', localStorage.getItem('accessToken'))
      .set('Accept', 'application/json')
      .send({
        connected: status
      })
      .end(function(err, res){
        if(res) {
          if (res.errors)
          {
            var errors = _getErrors(res.body.error);
            ResponseExternalDatabaseActionCreator.responseChangeStateDb(null, errors);
          }
          else
          {
            ResponseExternalDatabaseActionCreator.responseChangeStateDb(res.body, null);
          }
        }
      });
  }
};