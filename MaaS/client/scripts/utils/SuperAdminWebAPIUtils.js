// Name: {SuperAdminWebAPIUtils.js}
// Module: {Front-end::WebAPIUtils}
// Location: {/MaaS/client/scripts/utils/}

// History:
// Version         Date            Programmer
// ==========================================

var ResponseSuperAdminActionCreator = require('../actions/Response/ResponseSuperAdminActionCreator.react.jsx');
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
  
    getCompanies: function() {
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
        if(res) {
          console.log(res);
            if(res.error) {
              window.alert("errore");
                var errors = _getErrors(res.body.error);
                ResponseSuperAdminActionCreator.responseCompanyCompanies(null, errors);
            } else {
                ResponseSuperAdminActionCreator.responseCompanyCompanies(res.body, null);
            }
        }
      });
  },
  
  //delete the select company, all the users all the DSL definitions and theire Relations
  deleteCompany: function(id, email){
       request
      .del(APIEndpoints.COMPANIES + '/deleteCompany/' + id)
      .set('Accept', 'application/json')
      .set('Authorization', localStorage.getItem('accessToken'))
      .send({
        email: email
      })
      .end(function(error, res){
        if(res) {
           res = JSON.parse(res.text);
          if(res.error) {
            // res.error.message: errori di loopback e error definito dal remote method
            ResponseSuperAdminActionCreator.responseDeleteCompany(null, res.error.message);
          } else {
            ResponseSuperAdminActionCreator.responseDeleteCompany(res.name, null);
          }
        } 
      });
  },
  
  //change the name of the company wich has id = companyId
  changeCompanyName: function(companyId, name){
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
            window.alert("errore (webAPI)");
            console.log(res);
            ResponseSuperAdminActionCreator.responseChangeCompanyName(null,res.error.message);
          }
          else
          {
            window.alert("successo (webAPI)");
            ResponseSuperAdminActionCreator.responseChangeCompanyName(res.newName, null);
          }
        }
      });

  }
  
  
};