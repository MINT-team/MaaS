var ServerActionCreators = require('../actions/ServerActionCreator.react.jsx');
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
      .get(APIEndpoints.COMPANY)
      .set('Accept', 'application/json')
      .set('Authorization', sessionStorage.getItem('accessToken'))
      .send({ id: id })
      .end(function(err, res){
        if(res) {
          if(res.error) {
            var errors = _getErrors(res.body.error);
            ServerActionCreators.receiveResetPassword(null, errors);
          } else {
            ServerActionCreators.receiveResetPassword(res.body, null);
          }
        }
        if(err){
          //ReactDOM.render(<p>Errore: {err.status} {err.message}</p>, document.getElementById('content'));
        }
      });
  }

};