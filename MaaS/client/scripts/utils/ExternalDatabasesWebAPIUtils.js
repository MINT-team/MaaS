// Name: {ExternalDatabasesWebAPIUtils.js}
// Module: {Front-end::WebAPIUtils}
// Location: {/MaaS/client/scripts/utils/}

// History:
// Version         Date            Programmer
// ==========================================

var ResponseExternalDatabasesActionCreator = require('../actions/Response/ResponseExternalDatabaseActionCreator.react.jsx');
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
      .set('Authorization', localStorage.getItem('accessToken'))
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
  },

// connect db dovrebbe essere POST e passare dei dati al server per effettuare la connessione del db no?
connectDb: function() {
  request
    .get(APIEndpoints.DATABASES)
    .set('Authorization', localStorage.getItem('accessToken'))
    .set('Accept', 'application/json')
    .end(function(err, res){
      if(res) {
        console.log(res);
          if(res.error) {
              var errors = _getErrors(res.body.error);
              ResponseExternalDatabasesActionCreator.responseConnectDbs(null, errors);
          }
          else{
              //var company = localStorage.getItem('companyName'); // qua ci va una variabile ricevuta dal server!! (es. res.companyName)
              ResponseExternalDatabasesActionCreator.responseConnectDb(company, null);
          }
      }
      if(err){
        //ReactDOM.render(<p>Errore: {err.status} {err.message}</p>, document.getElementById('content'));
      }
    });
},

getDbs: function() {
  request
    .get(APIEndpoints.DATABASES + '?filter=%7B%22where%22%3A%7B%22companyName%22%3A%22' + localStorage.getItem('companyName') + '%22%7D%7D')
    .set('Authorization', localStorage.getItem('accessToken'))
    .set('Accept', 'application/json')
    .end(function(err, res){
      if(res) {
        console.log(res);
          if(res.error) {
              var errors = _getErrors(res.body.error);
              ResponseExternalDatabasesActionCreator.responseGetDbs(null, errors);
          }
          else
              ResponseExternalDatabasesActionCreator.responseGetDbs(res.body, null);
      }
      if(err){
        //ReactDOM.render(<p>Errore: {err.status} {err.message}</p>, document.getElementById('content'));
      }
    });
}

};