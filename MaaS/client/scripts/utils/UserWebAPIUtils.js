var ServerActionCreators = require('../actions/ServerActionCreator.react.jsx');
var Constants = require('../constants/Constants.js');
var request = require('superagent');

//var ReactDOM = require('react-dom');

function _getErrors(json) {
  var error, message;
    if(json.message) {
      message = json.message;
      // Email
      if(JSON.stringify(message).match(/mail/)) {
          error = "Email not found, insert your registered email";
      }
    }
    return error;
}

var APIEndpoints = Constants.APIEndpoints;

module.exports = {

  resetPassword: function(email) {
    request
      .post(APIEndpoints.RESET_PASSWORD)
      .set('Accept', 'application/json')
      //.set('Authorization', sessionStorage.getItem('accessToken'))
      .send({ email: email })
      .end(function(err, res){
        if(res) {
          if(res.error) {
            var errors = _getErrors(res.body.error);
            ServerActionCreators.receiveResetPassword(null, errors);
          } else {
            //var json = JSON.parse(res.text);  //res ritorna vuoto!
            var json = { email: email};
            ServerActionCreators.receiveResetPassword(json, null);
          }
        }
        if(err){
          //ReactDOM.render(<p>Errore: {err.status} {err.message}</p>, document.getElementById('content'));
        }
      });
  },

  changePassword: function(id, password, confirmation, accessToken){
    request
      .post(APIEndpoints.USERS + '/' + id + '/changePassword')
      .set('Accept', 'application/json')
      .set('Authorization', accessToken)  // necessario per questa API
      //.type('form')
      //.set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        id: id,
        password: password,
        confirmation: confirmation
      })
      .end(function(err, res){
        if(res) {
          res = JSON.parse(res.text);
          //console.log(res);
          if(res.error) {
            // res.error.message: errori di loopback e error definito dal remote method
            ServerActionCreators.receiveChangePassword(null, res.error.message);
          } else {
            ServerActionCreators.receiveChangePassword(res.email, null);
          }
        }
        if(err){
          //ServerActionCreators.receiveChangePassword(null, err);
        }
      });
  },

  getAllUsers: function() {
    request
      .get(APIEndpoints.UTENTI)
      .set('Accept', 'application/json')
      //.set('Authorization', sessionStorage.getItem('accessToken'))
      .end(function(error, res){
        if(res) {
          var json = JSON.parse(res.text);
          ServerActionCreators.response_getUsers(json);
        }
      });
  }

};