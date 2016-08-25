// Name: {CompanyWebAPIUtils.js}
// Module: {Front-end::WebAPIUtils}
// Location: {/MaaS/client/scripts/utils/}

// History:
// Version         Date            Programmer
// ==========================================

var ResponseCompanyActionCreator = require('../actions/Response/ResponseCompanyActionCreator.react.jsx');
var Constants = require('../constants/Constants.js');
var request = require('superagent');

function _getErrors(json) {
  var error, message;
    if(json.message)
    {
      message = json.message;
      // Other cases
      if(!error)
      {
        error = message;
      }
    }
    return error;
}

var APIEndpoints = Constants.APIEndpoints;

module.exports = {

  getUsers: function(id) {
    request
      .get(APIEndpoints.COMPANIES + '/' + id + '/users')
      .set('Accept', 'application/json')
      .set('Authorization', localStorage.getItem('accessToken'))
      .send({ id: id })
      .end(function(err, res) {
        if(res)
        {
          if(res.error)
          {
            var errors = _getErrors(res.body.error);
            ResponseCompanyActionCreator.responseCompanyUsers(null, errors);
          }
          else
          {
            ResponseCompanyActionCreator.responseCompanyUsers(res.body, null);
          }
        }
      });
  },

  // delete company and all users account  -> old
  //delete the select company, all the users all the DSL definitions and theire Relations  ->new
  deleteCompany: function(id, email) {
    request
      .del(APIEndpoints.COMPANIES + '/deleteCompany/' + id)
      .set('Accept', 'application/json')
      .set('Authorization', localStorage.getItem('accessToken'))
      .send({
        email: email
      })
      .end(function(error, res) {
        if(res)
        {
          res = JSON.parse(res.text);
          if(res.error)
          {
            // res.error.message: errori di loopback e error definito dal remote method
            ResponseCompanyActionCreator.responseDeleteCompany(null, res.error.message);
          }
          else
          {
            ResponseCompanyActionCreator.responseDeleteCompany(res.id, null);
          }
        }
      });
  },
  
  getCompanies: function() {    //returns all companies in the db
    request
      .get(APIEndpoints.COMPANIES)
      .set('Accept', 'application/json')
      .set('Authorization', localStorage.getItem('accessToken'))
      .query({
              filter: { 
                    include:["owner"]
              }
        })
      .end(function(err, res){
        if(res)
        {
          console.log(res);
          if(res.error)
          {
            var errors = _getErrors(res.body.error);
            ResponseCompanyActionCreator.responseGetCompanies(null, errors);
          }
          else
          {
            ResponseCompanyActionCreator.responseGetCompanies(res.body, null);
          }
        }
      });
  },
  
  //change the name of the company wich has id = companyId
  changeCompanyName: function(companyId, name) {
     request
      .put(APIEndpoints.COMPANIES + '/' + companyId + '/changeCompanyName')
      .set('Accept','application/json')
      .set('Authorization', localStorage.getItem('accessToken'))
      .send({
        id: companyId,
        name: name
      })
      .end(function(error, res) {
        if (res)
        {
          res = JSON.parse(res.text);
          if (res.error)
          {
            ResponseCompanyActionCreator.responseChangeCompanyName(null,res.error.message);
          }
          else
          {
            ResponseCompanyActionCreator.responseChangeCompanyName(res.data, null);
          }
        }
      });
  },
  
  getDatabasesCount: function(companyId) {
    request
      .get(APIEndpoints.COMPANIES + '/' + companyId + '/externalDatabases/count')
      .set('Accept', 'application/json')
      .set('Authorization', localStorage.getItem('accessToken'))
      .end(function(err, res){
        if(res)
        {
          res = JSON.parse(res.text);
          if(res.error)
          {
            ResponseCompanyActionCreator.responseGetDatabasesCount(null, res.error.message);
          }
          else
          {
            ResponseCompanyActionCreator.responseGetDatabasesCount(res.count, null);
          }
        }
      });
  },
  
  getDSLDefinitionsCount: function(companyId) {
    request
      .get(APIEndpoints.COMPANIES + '/' + companyId + '/getDSLDefinitionsCount')
      .set('Accept', 'application/json')
      .set('Authorization', localStorage.getItem('accessToken'))
      .end(function(err, res){
        if(res)
        { 
          res = JSON.parse(res.text);
          if(res.error)
          {
            ResponseCompanyActionCreator.responseGetDSLDefinitionsCount(null, res.error.message);
          }
          else
          {
            ResponseCompanyActionCreator.responseGetDSLDefinitionsCount(res.count, null);
          }
        }
      });
  }
};