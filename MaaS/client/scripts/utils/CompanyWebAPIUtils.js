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
      .set('Authorization', sessionStorage.getItem('accessToken'))
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

  setExtDb: function(id, name, password) {
    request
      .get(APIEndpoints.COMPANIES + '/' + id + '/users')
      .set('Accept', 'application/json')
      .set('Authorization', sessionStorage.getItem('accessToken'))
      .send({id: id,
      name: name,
      password: password})
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
  }

};