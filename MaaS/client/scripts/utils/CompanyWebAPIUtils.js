// Name: {CompanyWebAPIUtils.js}
// Module: {Front-end::WebAPIUtils}
// Location: {/MaaS/client/scripts/utils/}

// History:
// Version         Date            Programmer
// ==========================================

var ResponseCompanyActionCreator = require('../actions/Response/ResponseCompanyActionCreator.react.jsx');
var Constants = require('../constants/Constants.js');
var request = require('superagent');

//var ReactDOM = require('react-dom');

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

  getUsers: function(id) {
    request
      .get(APIEndpoints.COMPANIES + '/' + id + '/users')
      .set('Accept', 'application/json')
      .set('Authorization', localStorage.getItem('accessToken'))
      .send({ id: id })
      .end(function(err, res){
        if(res) {
            if(res.error) {
                var errors = _getErrors(res.body.error);
                ResponseCompanyActionCreator.responseCompanyUsers(null, errors);
            } else {
                ResponseCompanyActionCreator.responseCompanyUsers(res.body, null);
            }
        }
        if(err){
          //ReactDOM.render(<p>Errore: {err.status} {err.message}</p>, document.getElementById('content'));
        }
      });
  },

  // delete company and all users account
  deleteCompany: function(id, email) {
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
            ResponseCompanyActionCreator.responseDeleteCompany(null, res.error.message);
          } else {
            ResponseCompanyActionCreator.responseDeleteCompany(res.name, null);
          }
        } 
      });
  }
};