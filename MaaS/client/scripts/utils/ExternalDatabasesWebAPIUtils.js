// Name: {ExternalDatabasesWebAPIUtils.js}
// Module: {Front-end::WebAPIUtils}
// Location: {/MaaS/client/scripts/utils/}

// History:
// Version         Date            Programmer
// ==========================================

var ResponseExternalDatabasesActionCreator = require('../actions/Response/ResponseExternalDatabasesActionCreator.react.jsx');
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

setExtDb: function(id, name, password) {
    request
      .get(APIEndpoints.DATABASES + '/' + id + '/databases')
      .set('Authorization', sessionStorage.getItem('accessToken'))
      .send({
        id: id,
        name: name,
        password: password})
      .set('Accept', 'application/json')
      .end(function(err, res){
        if(res) {
          console.log(res);
            if(res.error) {
                var errors = _getErrors(res.body.error);
                ResponseExternalDatabasesActionCreator.responseSetExtDb(null, errors);
            } else {
                var json = {
                        id: res.body.email,
                        name: res.body.company,
                        password: res.body.password

                    };
                ResponseExternalDatabasesActionCreator.responseSetExtDb(json, null);
            }
        }
        if(err){
          //ReactDOM.render(<p>Errore: {err.status} {err.message}</p>, document.getElementById('content'));
        }
      });
  }

};